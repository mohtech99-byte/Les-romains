import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../lib/supabase-admin.ts';
import { db } from '../db/index.ts';
import { users } from '../db/schema.ts';
import { eq } from 'drizzle-orm';

export interface AuthenticatedSupabaseUser {
  uid: string;
  email: string;
  dbId: number;
  role: 'admin' | 'manager' | 'editor';
}

export interface AuthRequest extends Request {
  user?: AuthenticatedSupabaseUser;
}

// Comma-separated list of emails that are always granted the 'admin' role on
// first sign-in, e.g. ADMIN_EMAILS="sadeco005@gmail.com,abdenour@example.com"
// This replaces the old "first user to sign in becomes admin" behavior, which
// let anyone who signed in first (not necessarily the owner) seize admin access.
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

// Helper to find or create user in the database
export async function getOrCreateDbUser(uid: string, email: string) {
  try {
    // 1. Try to find the user
    const existingUsers = await db.select().from(users).where(eq(users.uid, uid));
    if (existingUsers.length > 0) {
      // If this email is on the admin allow-list but the DB record is stale
      // (e.g. it was created before ADMIN_EMAILS was configured), keep it in sync.
      if (ADMIN_EMAILS.includes(email.toLowerCase()) && existingUsers[0].role !== 'admin') {
        const [promoted] = await db.update(users)
          .set({ role: 'admin' })
          .where(eq(users.uid, uid))
          .returning();
        return promoted;
      }
      return existingUsers[0];
    }

    // 2. If not found, insert.
    // Only emails explicitly listed in ADMIN_EMAILS get 'admin' on creation.
    // Everyone else starts as 'editor' and must be promoted by an existing admin/manager.
    const role = ADMIN_EMAILS.includes(email.toLowerCase()) ? 'admin' : 'editor';

    const inserted = await db.insert(users)
      .values({
        uid,
        email,
        role,
      })
      .returning();

    return inserted[0];
  } catch (error) {
    console.error('Error in getOrCreateDbUser:', error);
    // Fallback: create a temporary virtual user object if db fails, so the app remains partially usable
    return {
      id: 999,
      uid,
      email,
      role: 'editor' as const,
    };
  }
}

// Verifies the Supabase access token sent by the client in the
// `Authorization: Bearer <token>` header, then resolves (or creates) the
// corresponding application-level user record and attaches it to the request.
export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    // Ask Supabase Auth to validate the access token and return the user it
    // belongs to. This hits Supabase's auth server and rejects
    // expired/invalid/tampered tokens.
    const { data, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !data?.user) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    const supabaseUser = data.user;
    const email = supabaseUser.email || '';

    // Fetch or create user in our PostgreSQL database
    const dbUser = await getOrCreateDbUser(supabaseUser.id, email);

    req.user = {
      uid: supabaseUser.id,
      email,
      dbId: dbUser.id,
      role: dbUser.role as 'admin' | 'manager' | 'editor',
    };

    next();
  } catch (error) {
    console.error('Error verifying Supabase access token:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

// Role-based authorization middleware
export const requireRole = (allowedRoles: ('admin' | 'manager' | 'editor')[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized: Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }

    next();
  };
};
