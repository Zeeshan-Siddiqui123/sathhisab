import { prisma } from "../lib/prisma.js";
import { UnauthorizedError } from "../lib/errors.js";
import { env } from "../config/env.js";

export const SESSION_COOKIE_NAME = "sid";
export const SESSION_DURATION_DAYS = 30;

/**
 * Attaches signed session cookie to response
 * @param {import("express").Response} res
 * @param {string} sessionId
 */
export function setSessionCookie(res, sessionId) {
  res.cookie(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    signed: true,
    maxAge: SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000,
  });
}

/**
 * Clears session cookie from response
 * @param {import("express").Response} res
 */
export function clearSessionCookie(res) {
  res.clearCookie(SESSION_COOKIE_NAME, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    signed: true,
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

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            createdAt: true,
          },
        },
      },
    });

    if (!session || !session.user || new Date(session.expiresAt) < new Date()) {
      if (session) {
        await prisma.session.delete({ where: { id: session.id } }).catch(() => {});
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
