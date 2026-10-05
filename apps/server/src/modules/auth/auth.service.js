import bcrypt from "bcrypt";
import { prisma } from "../../lib/prisma.js";
import { ConflictError, UnauthorizedError, NotFoundError } from "../../lib/errors.js";
import { SESSION_DURATION_DAYS } from "../../middleware/auth.js";

const BCRYPT_ROUNDS = 12;

/**
 * Registers a new user and creates an initial session
 */
export async function signup({ name, email, password }) {
  const normalizedEmail = email.toLowerCase().trim();

  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existing) {
    throw new ConflictError("Email is already registered");
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
    },
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      createdAt: true,
    },
  });

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_DURATION_DAYS);

  const session = await prisma.session.create({
    data: {
      userId: user.id,
      expiresAt,
    },
  });

  return { user, session };
}

/**
 * Authenticates user credentials and creates a new session
 */
export async function login({ email, password }) {
  const normalizedEmail = email.toLowerCase().trim();

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_DURATION_DAYS);

  const session = await prisma.session.create({
    data: {
      userId: user.id,
      expiresAt,
    },
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
    },
    session,
  };
}

/**
 * Invalidates user session
 */
export async function logout(sessionId) {
  if (sessionId) {
    await prisma.session.delete({
      where: { id: sessionId },
    }).catch(() => {});
  }
}

/**
 * Retrieves current user profile
 */
export async function getCurrentUser(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  return user;
}
