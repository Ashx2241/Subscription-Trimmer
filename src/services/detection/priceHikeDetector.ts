export interface PriceHikeAlert {
  merchantName: string;
  previousAmount: number;
  newAmount: number;
  percentIncrease: number;
  detectedDate: string;
}

export function detectPriceHikes(transactions: { cleanDescription: string; amount: number; date: Date }[]): PriceHikeAlert[] {
  const merchantMap: Record<string, { amounts: number[]; dates: Date[] }> = {};

  for (const tx of transactions) {
    const key = tx.cleanDescription;
    if (!merchantMap[key]) merchantMap[key] = { amounts: [], dates: [] };
    merchantMap[key].amounts.push(tx.amount);
    merchantMap[key].dates.push(new Date(tx.date));
  }

  const hikes: PriceHikeAlert[] = [];

  for (const [merchant, data] of Object.entries(merchantMap)) {
    if (data.amounts.length >= 2) {
      const sorted = data.amounts;
      const latest = sorted[0];
      const previous = sorted[1];

      if (latest > previous * 1.05) {
        const diff = latest - previous;
        const pct = (diff / previous) * 100;
        hikes.push({
          merchantName: merchant,
          previousAmount: previous,
          newAmount: latest,
          percentIncrease: Number(pct.toFixed(1)),
          detectedDate: new Date().toISOString().split('T')[0],
        });
      }
    }
  }

  return hikes;
}
