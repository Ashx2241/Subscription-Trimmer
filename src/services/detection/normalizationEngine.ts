export interface NormalizedMerchantResult {
  normalizedName: string;
  category: string;
  website?: string;
  cancellationUrl?: string;
  cancellationPhone?: string;
  cancellationEmail?: string;
  cancellationInstructions?: string;
}

const KNOWN_MERCHANT_CATALOG: Record<string, NormalizedMerchantResult> = {
  netflix: {
    normalizedName: 'Netflix',
    category: 'Entertainment',
    website: 'https://netflix.com',
    cancellationUrl: 'https://www.netflix.com/youraccount',
    cancellationPhone: '1-800-585-7265',
    cancellationEmail: 'support@netflix.com',
    cancellationInstructions: 'Log into Netflix.com -> Account -> Click "Cancel Membership".',
  },
  spotify: {
    normalizedName: 'Spotify',
    category: 'Music & Audio',
    website: 'https://spotify.com',
    cancellationUrl: 'https://www.spotify.com/account/change-plan/',
    cancellationPhone: '1-800-952-5210',
    cancellationEmail: 'support@spotify.com',
    cancellationInstructions: 'Log into Spotify.com -> Account -> Change Plan -> Cancel Premium.',
  },
  planetfitness: {
    normalizedName: 'Planet Fitness',
    category: 'Fitness & Health',
    website: 'https://planetfitness.com',
    cancellationUrl: 'https://www.planetfitness.com/about-planet-fitness/customer-service',
    cancellationPhone: '1-844-880-7180',
    cancellationEmail: 'cancellations@planetfitness.com',
    cancellationInstructions: 'Requires in-person visit to home club or Certified Postal Mail notice sent to home club manager.',
  },
  openai: {
    normalizedName: 'OpenAI (ChatGPT Plus)',
    category: 'SaaS & AI',
    website: 'https://chatgpt.com',
    cancellationUrl: 'https://chatgpt.com/#settings/Subscription',
    cancellationEmail: 'support@openai.com',
    cancellationInstructions: 'Open ChatGPT -> Settings -> Subscription -> Manage My Subscription -> Cancel Plan.',
  },
  adobe: {
    normalizedName: 'Adobe Creative Cloud',
    category: 'SaaS & Productivity',
    website: 'https://adobe.com',
    cancellationUrl: 'https://account.adobe.com/plans',
    cancellationPhone: '1-800-833-6687',
    cancellationEmail: 'support@adobe.com',
    cancellationInstructions: 'Log into Account.adobe.com -> Manage Plan -> Cancel Your Plan.',
  },
  nytimes: {
    normalizedName: 'The New York Times',
    category: 'News & Publishing',
    website: 'https://nytimes.com',
    cancellationUrl: 'https://www.nytimes.com/subscription/cancel',
    cancellationPhone: '1-800-698-4637',
    cancellationEmail: 'customercare@nytimes.com',
    cancellationInstructions: 'Must chat online with customer agent or call customer care at 1-800-698-4637.',
  },
  aws: {
    normalizedName: 'Amazon Web Services (AWS)',
    category: 'SaaS & Cloud',
    website: 'https://aws.amazon.com',
    cancellationUrl: 'https://console.aws.amazon.com/billing/home#/account',
    cancellationEmail: 'billing@amazon.com',
    cancellationInstructions: 'AWS Management Console -> Billing Dashboard -> Account -> Close Account.',
  },
  amazonprime: {
    normalizedName: 'Amazon Prime',
    category: 'E-Commerce & Delivery',
    website: 'https://amazon.com',
    cancellationUrl: 'https://www.amazon.com/mc/manage',
    cancellationInstructions: 'Amazon.com -> Account & Lists -> Prime Membership -> End Membership.',
  },
  conedison: {
    normalizedName: 'Con Edison (Electric Utility)',
    category: 'Utilities',
    website: 'https://coned.com',
    cancellationInstructions: 'Utility service auto-pay.',
  },
};

export function normalizeMerchantDescription(rawDescription: string): NormalizedMerchantResult {
  // 1. Sanitize raw description (strip processor noise, state codes, dates, phone numbers)
  const clean = rawDescription
    .toUpperCase()
    .replace(/PAYPAL\s*\*?/g, '')
    .replace(/AMZN\s*\*?/g, 'AMAZON ')
    .replace(/SPOTIFY\s*USA/g, 'SPOTIFY')
    .replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '') // remove phone numbers
    .replace(/\b[A-Z]{2}\b$/g, '') // remove trailing 2-letter state codes
    .replace(/[^A-Z0-9\s]/g, ' ')
    .trim();

  // 2. Fuzzy / Keyword catalog matching
  if (clean.includes('NETFLIX')) return KNOWN_MERCHANT_CATALOG.netflix;
  if (clean.includes('SPOTIFY')) return KNOWN_MERCHANT_CATALOG.spotify;
  if (clean.includes('PLANET FIT') || clean.includes('PLANETFITNESS')) return KNOWN_MERCHANT_CATALOG.planetfitness;
  if (clean.includes('OPENAI') || clean.includes('CHATGPT')) return KNOWN_MERCHANT_CATALOG.openai;
  if (clean.includes('ADOBE')) return KNOWN_MERCHANT_CATALOG.adobe;
  if (clean.includes('NYTIMES') || clean.includes('NEW YORK TIMES')) return KNOWN_MERCHANT_CATALOG.nytimes;
  if (clean.includes('AWS') || clean.includes('AMAZON WEB SERVICES')) return KNOWN_MERCHANT_CATALOG.aws;
  if (clean.includes('PRIME MEMBER') || clean.includes('PRIME SUB')) return KNOWN_MERCHANT_CATALOG.amazonprime;
  if (clean.includes('CON EDISON') || clean.includes('ELECTRIC BILL')) return KNOWN_MERCHANT_CATALOG.conedison;

  // Fallback for unknown merchants
  const titleName = clean
    .toLowerCase()
    .split(' ')
    .filter((w) => w.length > 2)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    normalizedName: titleName || 'Unknown Recurring Merchant',
    category: 'General Subscription',
  };
}
