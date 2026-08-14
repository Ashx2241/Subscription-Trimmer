export type SubscriptionFrequencyType =
  | 'WEEKLY'
  | 'BIWEEKLY'
  | 'MONTHLY'
  | 'EVERY_2_MONTHS'
  | 'QUARTERLY'
  | 'SEMIANNUAL'
  | 'ANNUAL'
  | 'IRREGULAR';

export interface CadenceAnalysisResult {
  frequency: SubscriptionFrequencyType;
  averageIntervalDays: number;
  regularityScore: number; // 0.0 to 1.0
  nextBillingDateForecast: Date;
}

export function analyzeTransactionCadence(dates: Date[]): CadenceAnalysisResult {
  if (dates.length < 2) {
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 30);
    return {
      frequency: 'MONTHLY',
      averageIntervalDays: 30,
      regularityScore: 0.5,
      nextBillingDateForecast: nextDate,
    };
  }

  // Sort dates chronologically ascending
  const sorted = [...dates].sort((a, b) => a.getTime() - b.getTime());
  const intervals: number[] = [];

  for (let i = 1; i < sorted.length; i++) {
    const diffMs = sorted[i].getTime() - sorted[i - 1].getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    intervals.push(diffDays);
  }

  const sum = intervals.reduce((acc, val) => acc + val, 0);
  const avgDays = sum / intervals.length;

  // Calculate variance for regularity score
  const variance =
    intervals.reduce((acc, val) => acc + Math.pow(val - avgDays, 2), 0) / intervals.length;
  const stdDev = Math.sqrt(variance);
  const regularityScore = Math.max(0, Math.min(1, 1 - stdDev / (avgDays || 1)));

  let frequency: SubscriptionFrequencyType = 'MONTHLY';

  if (avgDays >= 5 && avgDays <= 9) frequency = 'WEEKLY';
  else if (avgDays >= 11 && avgDays <= 17) frequency = 'BIWEEKLY';
  else if (avgDays >= 25 && avgDays <= 35) frequency = 'MONTHLY';
  else if (avgDays >= 52 && avgDays <= 68) frequency = 'EVERY_2_MONTHS';
  else if (avgDays >= 80 && avgDays <= 100) frequency = 'QUARTERLY';
  else if (avgDays >= 170 && avgDays <= 195) frequency = 'SEMIANNUAL';
  else if (avgDays >= 340 && avgDays <= 385) frequency = 'ANNUAL';
  else frequency = 'IRREGULAR';

  // Forecast next billing date based on last charge + average interval
  const lastDate = sorted[sorted.length - 1];
  const forecastDate = new Date(lastDate.getTime() + avgDays * 24 * 60 * 60 * 1000);

  return {
    frequency,
    averageIntervalDays: Math.round(avgDays),
    regularityScore: Number(regularityScore.toFixed(2)),
    nextBillingDateForecast: forecastDate,
  };
}
