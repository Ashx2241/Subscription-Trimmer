export function isFalsePositiveSubscription(
  rawDescription: string,
  category: string,
  amounts: number[]
): { isExempt: boolean; reason?: string } {
  const upper = rawDescription.toUpperCase();

  // 1. Credit / Positive cashflow / Payroll
  if (amounts.some((amt) => amt < 0)) {
    return { isExempt: true, reason: 'Income / Credit Deposit' };
  }

  // 2. Peer-to-Peer Transfers
  if (upper.includes('VENMO') || upper.includes('ZELLE') || upper.includes('CASH APP')) {
    return { isExempt: true, reason: 'Peer-to-Peer Transfer' };
  }

  // 3. One-off retail & Groceries
  if (
    upper.includes('WHOLE FOODS') ||
    upper.includes('TRADER JOE') ||
    upper.includes('TARGET STORE') ||
    upper.includes('WALMART') ||
    upper.includes('HOME DEPOT')
  ) {
    return { isExempt: true, reason: 'Physical Store Retail Purchase' };
  }

  // 4. Utility Bills (Can be flagged as recurring utility rather than cancellable SaaS)
  if (category === 'Utilities' || upper.includes('ELECTRIC') || upper.includes('WATER BILL')) {
    return { isExempt: false, reason: 'Essential Utility Bill' };
  }

  return { isExempt: false };
}
