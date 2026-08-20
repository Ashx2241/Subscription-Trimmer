import { IBankingProvider, BankAccountDTO, BankTransactionDTO } from './IBankingProvider';

export class MockBankProvider implements IBankingProvider {
  readonly providerName = 'MOCK' as const;

  async syncAccounts(connectionId: string): Promise<BankAccountDTO[]> {
    return [
      {
        id: `${connectionId}-acc-1`,
        name: 'Premier Checking (DEMO)',
        officialName: 'Chase Premier Platinum Checking',
        maskedAccountNumber: '8841',
        type: 'CHECKING',
        currency: 'INR',
        balanceCurrent: 4850.25,
        balanceAvailable: 4850.25,
      },
      {
        id: `${connectionId}-acc-2`,
        name: 'Freedom Unlimited Credit Card (DEMO)',
        officialName: 'Chase Freedom Card',
        maskedAccountNumber: '3920',
        type: 'CREDIT_CARD',
        currency: 'INR',
        balanceCurrent: 620.40,
        balanceAvailable: 9380.00,
      },
    ];
  }

  async syncTransactions(connectionId: string, startDate: Date): Promise<BankTransactionDTO[]> {
    const acc1 = `${connectionId}-acc-1`;
    const acc2 = `${connectionId}-acc-2`;
    const transactions: BankTransactionDTO[] = [];

    const now = new Date();
    const currentYear = now.getFullYear();

    // Generate 12 months of recurring subscription charges + one-offs
    for (let monthOffset = 0; monthOffset < 12; monthOffset++) {
      const txDate = new Date(now);
      txDate.setMonth(now.getMonth() - monthOffset);

      const d14 = new Date(txDate.getFullYear(), txDate.getMonth(), 14);
      const d01 = new Date(txDate.getFullYear(), txDate.getMonth(), 1);
      const d20 = new Date(txDate.getFullYear(), txDate.getMonth(), 20);
      const d05 = new Date(txDate.getFullYear(), txDate.getMonth(), 5);

      // 1. Netflix ($15.99/mo)
      transactions.push({
        providerTransactionId: `tx-netflix-${monthOffset}`,
        accountId: acc2,
        amount: 15.99,
        currency: 'INR',
        date: d14,
        rawDescription: `PAYPAL *NETFLIX.COM 800-531-5321 CA`,
        category: 'Entertainment',
        isPending: false,
      });

      // 2. Spotify Family ($16.99/mo)
      transactions.push({
        providerTransactionId: `tx-spotify-${monthOffset}`,
        accountId: acc2,
        amount: 16.99,
        currency: 'INR',
        date: d01,
        rawDescription: `SPOTIFY USA 877-778-1161 NY`,
        category: 'Music & Audio',
        isPending: false,
      });

      // 3. Planet Fitness ($24.99/mo)
      transactions.push({
        providerTransactionId: `tx-planetfitness-${monthOffset}`,
        accountId: acc1,
        amount: 24.99,
        currency: 'INR',
        date: d20,
        rawDescription: `PLANET FIT CLUB 9942 ACH DEBIT`,
        category: 'Fitness & Health',
        isPending: false,
      });

      // 4. OpenAI ChatGPT Plus ($20.00/mo)
      transactions.push({
        providerTransactionId: `tx-openai-${monthOffset}`,
        accountId: acc2,
        amount: 20.00,
        currency: 'INR',
        date: d05,
        rawDescription: `OPENAI *CHATGPT SUBSCRIPTION SAN FRANCISCO CA`,
        category: 'SaaS & AI',
        isPending: false,
      });

      // 5. Adobe Creative Cloud ($54.99/mo)
      transactions.push({
        providerTransactionId: `tx-adobe-${monthOffset}`,
        accountId: acc2,
        amount: 54.99,
        currency: 'INR',
        date: new Date(txDate.getFullYear(), txDate.getMonth(), 18),
        rawDescription: `ADOBE *CREATIVE CLOUD 800-833-6687 CA`,
        category: 'SaaS & Productivity',
        isPending: false,
      });

      // 6. NY Times Digital ($4.00/mo)
      transactions.push({
        providerTransactionId: `tx-nytimes-${monthOffset}`,
        accountId: acc2,
        amount: 4.00,
        currency: 'INR',
        date: new Date(txDate.getFullYear(), txDate.getMonth(), 28),
        rawDescription: `NYTIMES DIGITAL SUB 800-698-4637 NY`,
        category: 'News & Publishing',
        isPending: false,
      });

      // 7. Electric Utility (Variable $85-$120 - False positive candidate / Utility)
      transactions.push({
        providerTransactionId: `tx-electric-${monthOffset}`,
        accountId: acc1,
        amount: 85 + (monthOffset * 3) % 35,
        currency: 'INR',
        date: new Date(txDate.getFullYear(), txDate.getMonth(), 25),
        rawDescription: `CON EDISON ELECTRIC BILL AUTO-PAY`,
        category: 'Utilities',
        isPending: false,
      });
    }

    // Annual Subscriptions (AWS, Amazon Prime)
    transactions.push({
      providerTransactionId: `tx-aws-annual-0`,
      accountId: acc2,
      amount: 149.00,
      currency: 'USD',
      date: new Date(currentYear, 1, 10),
      rawDescription: `AMAZON WEB SERVICES AWS.AMAZON.COM WA`,
      category: 'SaaS & Cloud',
      isPending: false,
    });

    transactions.push({
      providerTransactionId: `tx-prime-annual-0`,
      accountId: acc2,
      amount: 139.00,
      currency: 'USD',
      date: new Date(currentYear, 3, 12),
      rawDescription: `AMZN Prime Member amzn.com/pmts WA`,
      category: 'E-Commerce & Delivery',
      isPending: false,
    });

    // One-Off Retail Purchases (Should NOT be detected as subscriptions)
    transactions.push({
      providerTransactionId: `tx-amazon-oneoff-1`,
      accountId: acc2,
      amount: 42.50,
      currency: 'USD',
      date: new Date(now.valueOf() - 8 * 86400000),
      rawDescription: `AMAZON.COM*MB9214 WA`,
      category: 'Shopping',
      isPending: false,
    });

    transactions.push({
      providerTransactionId: `tx-target-oneoff-2`,
      accountId: acc1,
      amount: 89.12,
      currency: 'USD',
      date: new Date(now.valueOf() - 15 * 86400000),
      rawDescription: `TARGET STORE #1842 BROOKLYN NY`,
      category: 'Shopping',
      isPending: false,
    });

    return transactions.filter((t) => t.date >= startDate);
  }
}
