/**
 * Idempotency middleware.
 * If an Idempotency-Key header is present, checks whether we already handled
 * a request with that exact key + user combo.  If yes, returns the cached
 * response (stored in an in-process Map for simplicity — good enough for a
 * single-process server).
 *
 * The key is scoped to the authenticated user so user A cannot replay user B.
 *
 * Cached entries expire after IDEMPOTENCY_TTL_MS (default 24 h).
 */

const IDEMPOTENCY_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

/** @type {Map<string, { status: number, body: unknown, expiresAt: number }>} */
const cache = new Map();

// Periodically prune expired entries
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of cache.entries()) {
    if (entry.expiresAt < now) {
      cache.delete(key);
    }
  }
}, 60 * 60 * 1000); // every hour

export function idempotency(req, res, next) {
  const rawKey = req.headers["idempotency-key"];
  if (!rawKey) {
    return next();
  }

  // Scope to authenticated user (may be undefined for public routes — skip)
  const userId = req.user?.id;
  if (!userId) {
    return next();
  }

  const cacheKey = `${userId}:${req.method}:${req.originalUrl}:${rawKey}`;
  const cached = cache.get(cacheKey);

  if (cached) {
    if (cached.expiresAt < Date.now()) {
      cache.delete(cacheKey);
    } else {
      return res.status(cached.status).json(cached.body);
    }
  }

  // Intercept res.json so we can cache the response
  const originalJson = res.json.bind(res);
  res.json = (body) => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      cache.set(cacheKey, {
        status: res.statusCode,
        body,
        expiresAt: Date.now() + IDEMPOTENCY_TTL_MS,
      });
    }
    return originalJson(body);
  };

  next();
}
