import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { Role } from '@prisma/client';

const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  process.env.JWT_SECRET ||
  'subscription-trimmer-secure-production-key-2026'
);

export interface TokenPayload {
  userId: string;
  email: string;
  role: Role;
}

export const COOKIE_NAME = 'st_session_token';

// 1. Password Hashing (bcrypt with 12 salt rounds)
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

// 2. JWT Token Generation
export async function signSessionToken(payload: TokenPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d') // 7-day session token
    .sign(JWT_SECRET);
}

// 3. JWT Verification
export async function verifySessionToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      role: payload.role as Role,
    };
  } catch (err) {
    return null;
  }
}

// 4. HttpOnly, Secure, SameSite=Lax Cookie Storage
export async function setSessionCookie(payload: TokenPayload) {
  const token = await signSessionToken(payload);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true, // Prevents JavaScript document.cookie access (XSS defense)
    secure: process.env.NODE_ENV === 'production', // Transmitted over HTTPS only
    sameSite: 'lax', // Permitted across top-level redirects and navigation in production
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  });
  return token;
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

// 5. Get Session Payload from Cookie
export async function getSessionContext(): Promise<TokenPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifySessionToken(token);
}

// 6. Resolve authenticated user from session cookie + database
// Returns the full Prisma user record, or null if not authenticated
export async function getAuthenticatedUser() {
  const session = await getSessionContext();
  if (!session) return null;

  // Dynamic import to avoid circular dependency with prisma client
  const { prisma } = await import('@/lib/prisma');

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: { profile: true },
    });
    return user;
  } catch {
    return null;
  }
}

// 7. Auth guard for API routes — throws a structured object if not authenticated
export async function requireAuth() {
  const session = await getSessionContext();
  if (!session) {
    throw { code: 'UNAUTHORIZED', message: 'Authentication required', status: 401 };
  }
  return session;
}

// 8. Admin guard for API routes — throws if not admin
export async function requireAdmin() {
  const session = await requireAuth();
  if (session.role !== 'ADMIN') {
    throw { code: 'FORBIDDEN', message: 'Admin access required', status: 403 };
  }
  return session;
}
