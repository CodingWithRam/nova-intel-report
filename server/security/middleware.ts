import { Request, Response, NextFunction } from 'express';
import { getSession, UserSession } from './session.ts';

// Extend Express Request type
export interface AuthenticatedUser {
  id: string;
  customId?: string;
  name: string;
  email: string;
  phone?: string;
  role: 'super_admin' | 'co_admin' | 'worker' | 'student';
  status: 'active' | 'suspended';
  department?: string;
  institution?: string;
  permissions: string[];
  sessionToken: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
      session?: UserSession;
    }
  }
}

// User provider lookup function injected by server.ts
type UserLookupFn = (userId: string) => any;
let userLookupFn: UserLookupFn = () => null;

export function setUserLookup(fn: UserLookupFn) {
  userLookupFn = fn;
}

/**
 * Extract bearer token from Authorization header or cookie.
 */
export function extractToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    if (token) return token;
  }

  // Fallback to cookie if present
  if (req.headers.cookie) {
    const match = req.headers.cookie.match(/(?:^|;\s*)nova_session=([a-zA-Z0-9]+)/);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Mandatory Authentication Middleware
 * Validates session token, checks user status, rejects with 401 if missing/invalid.
 */
export function authenticate(req: Request, res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({
      error: 'Authentication required. Please provide a valid Bearer token.'
    });
  }

  const session = getSession(token);
  if (!session) {
    return res.status(401).json({
      error: 'Invalid or expired session. Please log in again.'
    });
  }

  const user = userLookupFn(session.userId);
  if (!user) {
    return res.status(401).json({
      error: 'User account associated with this session no longer exists.'
    });
  }

  if (user.status === 'suspended') {
    return res.status(403).json({
      error: 'This account has been suspended by the Super Admin.'
    });
  }

  req.session = session;
  req.user = {
    id: user.id,
    customId: user.customId,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    status: user.status,
    department: user.department,
    institution: user.institution,
    permissions: Array.isArray(user.permissions) ? user.permissions : [],
    sessionToken: token
  };

  next();
}

/**
 * Optional Authentication Middleware
 * Attaches user to req.user if a valid token is present, but does not block if omitted.
 */
export function optionalAuthenticate(req: Request, res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (!token) return next();

  const session = getSession(token);
  if (!session) return next();

  const user = userLookupFn(session.userId);
  if (user && user.status === 'active') {
    req.session = session;
    req.user = {
      id: user.id,
      customId: user.customId,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      department: user.department,
      institution: user.institution,
      permissions: Array.isArray(user.permissions) ? user.permissions : [],
      sessionToken: token
    };
  }

  next();
}

/**
 * Role-Based Access Control Middleware
 * Requires that authenticated user holds one of the specified roles.
 * Returns 401 if unauthenticated, 403 if unauthorized.
 */
export function requireRole(...allowedRoles: Array<'super_admin' | 'co_admin' | 'worker' | 'student'>) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required to access this resource.'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Access Denied: Requires one of [${allowedRoles.join(', ')}] privileges. Current role: ${req.user.role}.`
      });
    }

    next();
  };
}

/**
 * Explicit Permission-Based Access Control Middleware
 * Super Admin always passes. Co-admins and workers pass if they hold ANY of the required permissions.
 */
export function requirePermission(...requiredPermissions: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required to access this resource.'
      });
    }

    // Super Admin has global root clearance
    if (req.user.role === 'super_admin') {
      return next();
    }

    const userPerms = req.user.permissions || [];
    const hasPermission = requiredPermissions.some(p => userPerms.includes(p));

    if (!hasPermission) {
      return res.status(403).json({
        error: `Forbidden: Missing required permission [${requiredPermissions.join(' or ')}].`
      });
    }

    next();
  };
}

/**
 * Route protection audit guard for /api/admin/*
 * Automatically denies any /api/admin/* requests that have not been authenticated.
 */
export function adminRouteGuard(req: Request, res: Response, next: NextFunction) {
  // Public application route allowed without prior admin auth
  if (req.path === '/api/admin/apply' && req.method === 'POST') {
    return next();
  }

  // Public appearance endpoint (only returns public display name or title)
  if (req.path === '/api/admin/super-admin/public' && req.method === 'GET') {
    return next();
  }

  // All other /api/admin/* routes require authentication
  if (!req.user) {
    return res.status(401).json({
      error: 'Unauthorized: Administrative endpoints require valid authentication credentials.'
    });
  }

  // All administrative endpoints require at least worker, co_admin, or super_admin
  if (req.user.role !== 'super_admin' && req.user.role !== 'co_admin' && req.user.role !== 'worker') {
    return res.status(403).json({
      error: 'Forbidden: Regular student accounts cannot access administrative portals.'
    });
  }

  next();
}
