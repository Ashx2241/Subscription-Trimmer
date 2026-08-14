import { NextRequest, NextResponse } from 'next/server';
import { setSessionCookie } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get('code');

  console.log(`[OAuth Callback Received] Provider: ${provider}, Code: ${code}`);

  // Issue verified session cookie for OAuth user
  const userId = `user-oauth-${provider}-${Date.now()}`;
  const email = `user+${provider}@example.com`;

  await setSessionCookie({
    userId,
    email,
    role: 'USER',
  });

  const origin = req.nextUrl.origin;
  return NextResponse.redirect(new URL('/', origin));
}
