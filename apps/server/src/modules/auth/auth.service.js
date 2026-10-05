import bcrypt from "bcrypt";
import { one, query, newId, transaction } from "../../lib/db.js";
import { ConflictError, UnauthorizedError, NotFoundError } from "../../lib/errors.js";
import { SESSION_DURATION_DAYS } from "../../middleware/auth.js";

async function createSession(userId, connection) {
  const id = newId();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_DAYS * 86400000);
  await query("INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)", [id, userId, expiresAt], connection);
  return one("SELECT * FROM sessions WHERE id = ?", [id], connection);
}

export async function signup({ name, email, password }) {
  const normalizedEmail = email.toLowerCase().trim();
  const passwordHash = await bcrypt.hash(password, 12);
  try {
    return await transaction(async connection => {
      const id = newId();
      await query("INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)", [id, name.trim(), normalizedEmail, passwordHash], connection);
      const user = await one("SELECT id, name, email, avatar_url, created_at FROM users WHERE id = ?", [id], connection);
      return { user, session: await createSession(id, connection) };
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") throw new ConflictError("Email is already registered");
    throw error;
  }
}

export async function login({ email, password }) {
  const user = await one("SELECT * FROM users WHERE email = ?", [email.toLowerCase().trim()]);
  if (!user || !await bcrypt.compare(password, user.passwordHash)) throw new UnauthorizedError("Invalid email or password");
  return {
    user: { id: user.id, name: user.name, email: user.email, avatarUrl: user.avatarUrl, createdAt: user.createdAt },
    session: await createSession(user.id),
  };
}

export async function logout(sessionId) {
  if (sessionId) await query("DELETE FROM sessions WHERE id = ?", [sessionId]);
}

export async function getCurrentUser(userId) {
  const user = await one("SELECT id, name, email, avatar_url, created_at FROM users WHERE id = ?", [userId]);
  if (!user) throw new NotFoundError("User not found");
  return user;
}
