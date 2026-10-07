import { one, query } from "../lib/db.js";
import { UnauthorizedError } from "../lib/errors.js";
import { env } from "../config/env.js";

export const SESSION_COOKIE_NAME = "sid";
export const SESSION_DURATION_DAYS = 30;

const sessionCookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: env.NODE_ENV === "production" ? "none" : "lax",
  path: "/",
  signed: true,
};

/**
 * Attaches signed session cookie to response
 * @param {import("express").Response} res
 * @param {string} sessionId
 */
export function setSessionCookie(res, sessionId) {
  res.cookie(SESSION_COOKIE_NAME, sessionId, {
    ...sessionCookieOptions,
    maxAge: SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000,
  });
}

/**
 * Clears session cookie from response
 * @param {import("express").Response} res
 */
export function clearSessionCookie(res) {
  res.clearCookie(SESSION_COOKIE_NAME, {
    ...sessionCookieOptions,
  });
}

/**
 * Middleware requiring authenticated user
 */
export async function requireAuth(req, _res, next) {
  try {
    const sessionId = req.signedCookies[SESSION_COOKIE_NAME] || req.cookies[SESSION_COOKIE_NAME];

    if (!sessionId) {
      throw new UnauthorizedError("Authentication required");
    }

    const session = await one("SELECT id, user_id, expires_at FROM sessions WHERE id = ?", [sessionId]);
    if (session) session.user = await one("SELECT id, name, email, avatar_url, created_at FROM users WHERE id = ?", [session.userId]);

    if (!session || !session.user || new Date(session.expiresAt) < new Date()) {
      if (session) {
        await query("DELETE FROM sessions WHERE id = ?", [session.id]);
      }
      throw new UnauthorizedError("Session expired or invalid");
    }

    req.user = session.user;
    req.sessionId = session.id;
    next();
  } catch (err) {
    next(err);
  }
}
