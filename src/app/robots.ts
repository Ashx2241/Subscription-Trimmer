import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://subscriptiontrimmer.com';

  return {
    rules: {
      userAgent: '*',
      allow: [
        '/',
        '/landing',
        '/login',
        '/register',
        '/forgot-password',
        '/reset-password',
        '/privacy',
        '/terms',
      ],
      disallow: [
        '/api/',
        '/subscriptions',
        '/transactions',
        '/cancellation-center',
        '/bank-connections',
        '/settings',
        '/admin',
        '/virtual-cards',
        '/negotiate',
        '/receipt-scanner',
        '/receipt-printer',
        '/savings',
        '/analytics',
        '/notifications',
        '/billing',
        '/onboarding',
        '/cancel/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
