import { NextRequest } from 'next/server';

/**
 * Checks if a hostname or URL points to a local loopback address
 */
function isLoopbackAddress(urlOrHost: string): boolean {
  const cleaned = urlOrHost.toLowerCase().trim();
  return (
    cleaned.includes('localhost') ||
    cleaned.includes('127.0.0.1') ||
    cleaned.includes('0.0.0.0') ||
    cleaned.includes(':8080') ||
    cleaned.includes(':3000')
  );
}

/**
 * Normalizes a URL string by ensuring protocol and stripping trailing slashes.
 */
function normalizeUrl(url: string, defaultProtocol = 'https'): string {
  let cleaned = url.trim().replace(/\/+$/, '');
  if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
    cleaned = `${defaultProtocol}://${cleaned}`;
  }
  return cleaned;
}

/**
 * Resolves the canonical base URL of the application.
 *
 * In Production (Vercel / Production environments):
 * - Prioritizes APP_URL, NEXT_PUBLIC_APP_URL, NEXTAUTH_URL, VERCEL_PROJECT_PRODUCTION_URL, VERCEL_URL.
 * - Inspects request headers (x-forwarded-host / host) while rejecting loopback/localhost addresses.
 * - Fails with a clear server-side configuration error if no production domain is found (never silently falls back to localhost).
 *
 * In Local Development:
 * - Falls back to http://localhost:3000.
 */
export function getAppUrl(req?: NextRequest): string {
  const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';

  // 1. Explicit Application URL Environment Variables
  const explicitEnvUrl =
    process.env.APP_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXTAUTH_URL;

  if (explicitEnvUrl && explicitEnvUrl.trim().length > 0) {
    const normalized = normalizeUrl(explicitEnvUrl);
    // In production, ensure the configured env URL is not accidentally set to localhost
    if (isProduction && isLoopbackAddress(normalized)) {
      console.warn(
        `⚠️ [OAuth Security Warning] APP_URL / NEXT_PUBLIC_APP_URL is set to loopback address "${normalized}" in production. Ignoring to prevent redirect_uri_mismatch.`
      );
    } else {
      return normalized;
    }
  }

  // 2. Vercel System Environment Variables (Automatically provided by Vercel deployments)
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return normalizeUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL, 'https');
  }

  if (process.env.VERCEL_URL) {
    return normalizeUrl(process.env.VERCEL_URL, 'https');
  }

  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return normalizeUrl(process.env.NEXT_PUBLIC_VERCEL_URL, 'https');
  }

  // 3. Dynamic Request Headers (Forwarded host from Vercel edge/proxy)
  if (req) {
    const forwardedHost = req.headers.get('x-forwarded-host') || req.headers.get('host');
    const forwardedProto = req.headers.get('x-forwarded-proto') || (isProduction ? 'https' : 'http');

    if (forwardedHost) {
      const isLoopback = isLoopbackAddress(forwardedHost);
      if (isProduction && isLoopback) {
        console.warn(
          `⚠️ [OAuth Security Warning] Received loopback host "${forwardedHost}" in production request headers.`
        );
      } else {
        return normalizeUrl(`${forwardedProto}://${forwardedHost}`, forwardedProto);
      }
    }
  }

  // 4. Production Safeguard: Never fall back to localhost in production
  if (isProduction) {
    throw new Error(
      'Google OAuth Configuration Error: Missing production domain. Please configure NEXT_PUBLIC_APP_URL or APP_URL in your Vercel Project Environment Variables (e.g. NEXT_PUBLIC_APP_URL="https://subscription-trimmer-six.vercel.app").'
    );
  }

  // 5. Default Local Development Fallback
  return 'http://localhost:3000';
}

/**
 * Returns the exact, canonical Google OAuth callback URI.
 * Guarantees identical redirect_uri generation between /api/auth/google and /api/auth/callback/google.
 */
export function getGoogleRedirectUri(req?: NextRequest): string {
  // Allow explicit override if GOOGLE_REDIRECT_URI / GOOGLE_CALLBACK_URL is set
  const explicitRedirectUri = process.env.GOOGLE_REDIRECT_URI || process.env.GOOGLE_CALLBACK_URL;
  if (explicitRedirectUri && explicitRedirectUri.trim().length > 0) {
    return normalizeUrl(explicitRedirectUri);
  }

  const baseUrl = getAppUrl(req);
  return `${baseUrl}/api/auth/callback/google`;
}
