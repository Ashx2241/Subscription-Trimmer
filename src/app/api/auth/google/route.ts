import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';

export async function GET(req: NextRequest) {
  const googleClientId = process.env.GOOGLE_CLIENT_ID;

  if (!googleClientId || googleClientId.includes('YOUR_GOOGLE_CLIENT_ID')) {
    const errorHtml = `
      <!DOCTYPE html>
      <html>
        <head><title>Google OAuth Configuration Error</title></head>
        <body style="font-family: system-ui; background: #070a13; color: #f8fafc; padding: 40px; line-height: 1.6;">
          <div style="max-width: 600px; margin: 0 auto; background: #0e1424; padding: 32px; border-radius: 24px; border: 1px solid #1e293b;">
            <h2 style="color: #f43f5e; margin-top: 0;">⚠️ Google OAuth Configuration Required</h2>
            <p>Google Sign-In requires a valid <strong>GOOGLE_CLIENT_ID</strong> from Google Cloud Console.</p>
            <div style="background: #070a13; padding: 16px; border-radius: 12px; font-family: monospace; font-size: 13px; color: #38bdf8; border: 1px solid #1e293b;">
              GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"<br/>
              GOOGLE_CLIENT_SECRET="your-client-secret"
            </div>
            <p style="font-size: 14px; color: #94a3b8;">Add these credentials to your Vercel Environment Variables or <code>.env</code> file and restart the server.</p>
            <a href="/login" style="display: inline-block; padding: 10px 20px; background: #06b6d4; color: #0f172a; text-decoration: none; border-radius: 12px; font-weight: bold; margin-top: 16px;">Return to Login</a>
          </div>
        </body>
      </html>
    `;
    return new NextResponse(errorHtml, { headers: { 'Content-Type': 'text/html' } });
  }

  // Generate secure random state token to prevent CSRF
  const stateToken = crypto.randomBytes(32).toString('hex');
  const cookieStore = await cookies();
  cookieStore.set('oauth_state', stateToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600, // 10 minutes
    path: '/',
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin;
  const redirectUri = `${appUrl}/api/auth/callback/google`;

  const params = new URLSearchParams({
    client_id: googleClientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid profile email',
    state: stateToken,
    access_type: 'offline',
    prompt: 'consent',
  });

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  return NextResponse.redirect(googleAuthUrl);
}
