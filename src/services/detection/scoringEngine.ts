import { SubscriptionFrequencyType } from './cadenceAnalyzer';

export interface CalculatedCostEquivalents {
  monthlyCost: number;
  annualizedCost: number;
}

export function calculateCostEquivalents(
  amount: number,
  frequency: SubscriptionFrequencyType
): CalculatedCostEquivalents {
  let annual = amount * 12;

  switch (frequency) {
    case 'WEEKLY':
      annual = amount * 52;
      break;
    case 'BIWEEKLY':
      annual = amount * 26;
      break;
    case 'MONTHLY':
      annual = amount * 12;
      break;
    case 'EVERY_2_MONTHS':
      annual = amount * 6;
      break;
    case 'QUARTERLY':
      annual = amount * 4;
      break;
    case 'SEMIANNUAL':
      annual = amount * 2;
      break;
    case 'ANNUAL':
      annual = amount;
      break;
    case 'IRREGULAR':
      annual = amount * 12;
      break;
  }

  const monthly = annual / 12;

  return {
    monthlyCost: Number(monthly.toFixed(2)),
    annualizedCost: Number(annual.toFixed(2)),
  };
}

export function calculateConfidenceScore({
  occurrenceCount,
  regularityScore,
  isKnownCatalogMerchant,
  hasUserOverride,
}: {
  occurrenceCount: number;
  regularityScore: number;
  isKnownCatalogMerchant: boolean;
  hasUserOverride?: boolean;
}): number {
  if (hasUserOverride) return 1.0; // 100% confidence if user explicit override

  let score = 0.5;

  // Occurrences weighting
  if (occurrenceCount >= 6) score += 0.25;
  else if (occurrenceCount >= 3) score += 0.15;
  else if (occurrenceCount >= 2) score += 0.05;

  // Regularity weighting
  score += regularityScore * 0.15;

  // Catalog match weighting
  if (isKnownCatalogMerchant) score += 0.1;

  return Number(Math.min(0.99, score).toFixed(2));
}
