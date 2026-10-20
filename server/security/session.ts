import { generateSecureToken } from './crypto.ts';

export interface UserSession {
  token: string;
  userId: string;
  role: 'super_admin' | 'co_admin' | 'worker' | 'student';
  permissions: string[];
  createdAt: number;
  expiresAt: number;
  lastActiveAt: number;
  ip: string;
  userAgent: string;
}

// In-memory session registry with periodic sweep
const sessionsByToken = new Map<string, UserSession>();
const tokensByUserId = new Map<string, Set<string>>();

const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const IDLE_TIMEOUT_MS = 4 * 60 * 60 * 1000; // 4 hours idle limit

/**
 * Create a new secure authenticated session for a user.
 */
export function createSession(
  userId: string,
  role: 'super_admin' | 'co_admin' | 'worker' | 'student',
  permissions: string[],
  ip = '127.0.0.1',
  userAgent = 'Unknown'
): UserSession {
  const token = generateSecureToken(32);
  const now = Date.now();
  const session: UserSession = {
    token,
    userId,
    role,
    permissions: Array.isArray(permissions) ? [...permissions] : [],
    createdAt: now,
    expiresAt: now + SESSION_TTL_MS,
    lastActiveAt: now,
    ip,
    userAgent
  };

  sessionsByToken.set(token, session);

  let userTokens = tokensByUserId.get(userId);
  if (!userTokens) {
    userTokens = new Set<string>();
    tokensByUserId.set(userId, userTokens);
  }
  userTokens.add(token);

  return session;
}

/**
 * Validate and retrieve an active session. Refreshes lastActiveAt if valid.
 */
export function getSession(token: string | undefined): UserSession | null {
  if (!token || typeof token !== 'string') return null;
  const session = sessionsByToken.get(token);
  if (!session) return null;

  const now = Date.now();
  // Check absolute expiration
  if (now > session.expiresAt) {
    revokeSession(token);
    return null;
  }

  // Check idle timeout
  if (now - session.lastActiveAt > IDLE_TIMEOUT_MS) {
    revokeSession(token);
    return null;
  }

  session.lastActiveAt = now;
  return session;
}

/**
 * Revoke a single active session token (Logout)
 */
export function revokeSession(token: string | undefined): boolean {
  if (!token) return false;
  const session = sessionsByToken.get(token);
  if (!session) return false;

  sessionsByToken.delete(token);
  const userTokens = tokensByUserId.get(session.userId);
  if (userTokens) {
    userTokens.delete(token);
    if (userTokens.size === 0) {
      tokensByUserId.delete(session.userId);
    }
  }
  return true;
}

/**
 * Revoke ALL active sessions for a specific user (on password change, ban, or admin force-revoke)
 */
export function revokeAllUserSessions(userId: string): number {
  const userTokens = tokensByUserId.get(userId);
  if (!userTokens) return 0;

  let revokedCount = 0;
  for (const token of userTokens) {
    sessionsByToken.delete(token);
    revokedCount++;
  }
  tokensByUserId.delete(userId);
  return revokedCount;
}

/**
 * Rotate an existing session token (after privilege change or high-risk action)
 */
export function rotateSession(oldToken: string): UserSession | null {
  const current = sessionsByToken.get(oldToken);
  if (!current) return null;

  revokeSession(oldToken);
  return createSession(
    current.userId,
    current.role,
    current.permissions,
    current.ip,
    current.userAgent
  );
}

/**
 * Active sessions count
 */
export function getActiveSessionCount(): number {
  return sessionsByToken.size;
}

// Periodic cleanup of expired sessions every 15 minutes
setInterval(() => {
  const now = Date.now();
  for (const [token, session] of sessionsByToken.entries()) {
    if (now > session.expiresAt || (now - session.lastActiveAt > IDLE_TIMEOUT_MS)) {
      revokeSession(token);
    }
  }
}, 15 * 60 * 1000).unref();
