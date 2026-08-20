import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { setSessionCookie } from '@/lib/auth';
import { getAppUrl, getGoogleRedirectUri } from '@/lib/appUrl';
import { logAuditEvent } from '@/services/security/auditLogger';
import { Role } from '@prisma/client';

export async function GET(req: NextRequest) {
  let appUrl: string;
  let redirectUri: string;

  try {
    appUrl = getAppUrl(req);
    redirectUri = getGoogleRedirectUri(req);
  } catch (err) {
    console.error('OAuth Domain Error:', err);
    return NextResponse.json(
      { error: 'Google OAuth domain configuration error' },
      { status: 500 }
    );
  }

  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error || !code) {
    console.error('Google OAuth Error from Callback:', error);
    return NextResponse.redirect(new URL('/login?error=google_auth_failed', appUrl));
  }

  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

  console.log(`[Google Callback] Received code: ${code ? 'PRESENT' : 'MISSING'}, redirect_uri: ${redirectUri}`);

  if (!googleClientId || !googleClientSecret || googleClientSecret.trim().length === 0) {
    console.error('[Google Callback Error] GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET is missing from environment variables.');
    return NextResponse.redirect(new URL('/login?error=google_auth_failed', appUrl));
  }

  let googleEmail: string | null = null;
  let googleName = 'Google User';
  let googleSub: string | null = null;
  let avatarUrl = 'https://lh3.googleusercontent.com/a/default-user';

  try {
    console.log('[Google Callback] Exchanging authorization code for tokens with Google...');
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: googleClientId,
        client_secret: googleClientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.access_token) {
      console.error('[Google Callback Error] Google token exchange failed:', JSON.stringify(tokenData));
      return NextResponse.redirect(new URL('/login?error=google_auth_failed', appUrl));
    }

    console.log('[Google Callback] Token exchange successful. Fetching Google user profile...');
    const profileRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const profile = await profileRes.json();
    if (!profile || !profile.email) {
      console.error('[Google Callback Error] Google profile missing email:', JSON.stringify(profile));
      return NextResponse.redirect(new URL('/login?error=google_auth_failed', appUrl));
    }

    googleEmail = profile.email.toLowerCase().trim();
    googleName = profile.name || 'Google User';
    googleSub = profile.sub || `google-${Date.now()}`;
    avatarUrl = profile.picture || avatarUrl;
    console.log(`[Google Callback] Profile retrieved for: ${googleEmail} (${googleName})`);
  } catch (err) {
    console.error('[Google Callback Exception] Error during Google OAuth exchange:', err);
    return NextResponse.redirect(new URL('/login?error=google_auth_failed', appUrl));
  }

  if (!googleEmail || !googleSub) {
    return NextResponse.redirect(new URL('/login?error=google_auth_failed', appUrl));
  }

  // Find or Create the authenticated user in Database and establish session
  try {
    let dbUser = await prisma.user.findFirst({
      where: {
        OR: [
          { googleId: googleSub },
          { email: googleEmail },
        ],
      },
      include: {
        profile: true,
      },
    });

    if (dbUser) {
      dbUser = await prisma.user.update({
        where: { id: dbUser.id },
        data: {
          googleId: googleSub,
          avatarUrl: avatarUrl || dbUser.avatarUrl,
          emailVerified: true,
          name: dbUser.name || googleName,
        },
        include: {
          profile: true,
        },
      });

      // If user profile record is missing, create it
      if (!dbUser.profile) {
        await prisma.userProfile.create({
          data: {
            userId: dbUser.id,
            currency: 'INR',
            timezone: 'Asia/Kolkata',
          },
        }).catch((err) => console.warn('[Google Callback] Profile creation warning:', err));
      }
    } else {
      dbUser = await prisma.user.create({
        data: {
          email: googleEmail,
          name: googleName,
          passwordHash: '$2a$10$oauthGoogleNoPasswordSet',
          googleId: googleSub,
          avatarUrl,
          emailVerified: true,
          role: Role.USER,
          profile: {
            create: {
              currency: 'INR',
              timezone: 'Asia/Kolkata',
            },
          },
        },
        include: {
          profile: true,
        },
      });
    }

    // Set secure HttpOnly session cookie strictly tied to this authenticated user ID
    await setSessionCookie({
      userId: dbUser.id,
      email: dbUser.email,
      role: dbUser.role,
    });

    // Create redirect response and explicitly attach session cookie to response headers
    const redirectResponse = NextResponse.redirect(new URL('/', appUrl));
    const token = await (await import('@/lib/auth')).signSessionToken({
      userId: dbUser.id,
      email: dbUser.email,
      role: dbUser.role,
    });

    redirectResponse.cookies.set('st_session_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    await logAuditEvent({
      actorId: dbUser.id,
      action: 'USER_GOOGLE_OAUTH_SUCCESS',
      resource: '/api/auth/callback/google',
      ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
      metadata: {
        email: dbUser.email,
        googleId: googleSub,
      },
    });

    // Redirect authenticated user to Dashboard
    return redirectResponse;
  } catch (dbErr) {
    console.error('[Google Callback Exception] Database or session error during Google OAuth callback:', dbErr);
    return NextResponse.redirect(new URL('/login?error=google_auth_failed', appUrl));
  }
}
