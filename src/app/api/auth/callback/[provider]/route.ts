import { NextRequest, NextResponse } from 'next/server';
import { setSessionCookie } from '@/lib/auth';
import { getAppUrl } from '@/lib/appUrl';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;
  const appUrl = getAppUrl(req);
  const searchParams = req.nextUrl.searchParams;

  if (provider.toLowerCase() === 'google') {
    const forwardUrl = new URL('/api/auth/callback/google', appUrl);
    forwardUrl.search = searchParams.toString();
    return NextResponse.redirect(forwardUrl);
  }

  const code = searchParams.get('code');
  console.log(`[OAuth Callback Received] Provider: ${provider}, Code: ${code}`);

  return NextResponse.redirect(new URL('/login?error=provider_not_configured', appUrl));
}
