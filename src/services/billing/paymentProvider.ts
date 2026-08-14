export interface PlanTier {
  id: string;
  name: string;
  priceMonthly: number;
  features: string[];
}

export const AVAILABLE_PLANS: PlanTier[] = [
  {
    id: 'free-tier',
    name: 'Trimmer Basic',
    priceMonthly: 0,
    features: [
      'Link up to 2 Bank Accounts',
      'Automatic Subscription Detection',
      'Spend Analytics & Dashboard',
      '1 Guided Self-Cancellation / month',
    ],
  },
  {
    id: 'pro-tier',
    name: 'Trimmer Pro',
    priceMonthly: 5.99,
    features: [
      'Unlimited Bank & Credit Card Links',
      'Unlimited AI Legal Cancellation Notices',
      'Upcoming Renewal Charge Alerts',
      'Concierge & Postal Mail Cancellation Hooks',
      'Priority Security & Support',
    ],
  },
];

export function handleStripeWebhookEvent(eventType: string, payload: unknown) {
  console.log(`[PaymentProvider] Handled Stripe event: ${eventType}`, payload);
  return { received: true };
}
