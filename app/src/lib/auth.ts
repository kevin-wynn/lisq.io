import bcrypt from "bcryptjs";
import { and, eq, gt, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db } from "../db";
import { sessions, users } from "../db/schema";

const SALT_ROUNDS = 12;
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

/**
 * Provision admin user from LISQ_USERNAME / LISQ_PASSWORD env vars.
 * Creates user if missing, updates password hash if changed.
 * Called on server startup.
 */
export async function provisionUser(): Promise<void> {
  const username = process.env.LISQ_USERNAME;
  const password = process.env.LISQ_PASSWORD;

  if (!username || !password) {
    console.warn(
      "[lisq] LISQ_USERNAME and LISQ_PASSWORD not set — no user provisioned",
    );
    return;
  }

  try {
    const existing = db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .get();

    if (existing) {
      const matches = await bcrypt.compare(password, existing.passwordHash);
      if (!matches) {
        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
        db.update(users)
          .set({ passwordHash, updatedAt: new Date() })
          .where(eq(users.id, existing.id))
          .run();
        console.log(`[lisq] Updated password for user "${username}"`);
      } else {
        console.log(`[lisq] User "${username}" already exists`);
      }
    } else {
      const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
      db.insert(users)
        .values({
          id: nanoid(),
          username,
          passwordHash,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .run();
      console.log(`[lisq] Created user "${username}"`);
    }
  } catch (err) {
    console.error("[lisq] Failed to provision user:", err);
  }
}

/**
 * Verify username + password, return user or null.
 */
export async function verifyCredentials(
  username: string,
  password: string,
): Promise<{ id: string; username: string } | null> {
  const user = db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .get();

  if (!user) return null;

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return null;

  return { id: user.id, username: user.username };
}

/**
 * Create a new session for a user, return session ID (used as cookie).
 */
export function createSession(userId: string): string {
  const sessionId = nanoid(48);
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  db.insert(sessions)
    .values({
      id: sessionId,
      userId,
      expiresAt,
      createdAt: new Date(),
    })
    .run();

  return sessionId;
}

/**
 * Validate a session ID, return user ID or null if expired/missing.
 */
export function validateSession(
  sessionId: string,
): { userId: string; username: string } | null {
  const row = db
    .select({
      userId: sessions.userId,
      username: users.username,
      expiresAt: sessions.expiresAt,
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(
      and(
        eq(sessions.id, sessionId),
        gt(sessions.expiresAt, sql`${Math.floor(Date.now() / 1000)}`),
      ),
    )
    .get();

  if (!row) return null;
  return { userId: row.userId, username: row.username };
}

/**
 * Delete a session (logout).
 */
export function deleteSession(sessionId: string): void {
  db.delete(sessions).where(eq(sessions.id, sessionId)).run();
}

/**
 * Clean up expired sessions.
 */
export function cleanExpiredSessions(): void {
  db.delete(sessions)
    .where(sql`${sessions.expiresAt} < ${Math.floor(Date.now() / 1000)}`)
    .run();
}

/**
 * Check if auth is enabled (env vars set).
 */
export function isAuthEnabled(): boolean {
  return !!(process.env.LISQ_USERNAME && process.env.LISQ_PASSWORD);
}

/**
 * Extract session ID from cookie header.
 */
export function getSessionFromCookies(
  cookieHeader: string | null,
): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(/(?:^|;\s*)lisq_session=([^;]+)/);
  return match ? match[1] : null;
}

/**
 * Build a Set-Cookie header value.
 */
export function buildSessionCookie(sessionId: string, maxAge?: number): string {
  const age = maxAge ?? Math.floor(SESSION_TTL_MS / 1000);
  return `lisq_session=${sessionId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${age}`;
}

export function buildClearSessionCookie(): string {
  return "lisq_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0";
}
