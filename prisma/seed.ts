import { PrismaClient } from '@prisma/client';
import { MockBankProvider } from '../src/services/banking/MockBankProvider';
import { normalizeMerchantDescription } from '../src/services/detection/normalizationEngine';
import { analyzeTransactionCadence } from '../src/services/detection/cadenceAnalyzer';
import { calculateCostEquivalents, calculateConfidenceScore } from '../src/services/detection/scoringEngine';
import { isFalsePositiveSubscription } from '../src/services/detection/falsePositiveFilter';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Create Default Users
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      passwordHash: '$2a$10$e8K7W...dummyHashForDemoPassword123',
      name: 'Jane Doe',
      role: 'USER',
      profile: {
        create: {
          currency: 'USD',
          timezone: 'America/New_York',
          phoneNumber: '+1 (555) 234-5678',
        },
      },
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      passwordHash: '$2a$10$e8K7W...dummyHashForAdminPassword123',
      name: 'Alex Rivera (Admin)',
      role: 'ADMIN',
      profile: {
        create: {
          currency: 'USD',
          timezone: 'America/New_York',
        },
      },
    },
  });

  console.log(`👤 Created Demo User (${user.email}) and Admin (${admin.email})`);

  // 2. Create Bank Connection & Accounts
  const connection = await prisma.bankConnection.create({
    data: {
      userId: user.id,
      provider: 'MOCK',
      providerConnectionId: 'mock-conn-8841',
      accessTokenEncrypted: 'mock_enc_token_xyz987',
      status: 'CONNECTED',
      institutionName: 'Chase Bank (DEMO DATA)',
      lastSyncAt: new Date(),
      accounts: {
        create: [
          {
            name: 'Premier Checking (DEMO)',
            officialName: 'Chase Premier Platinum Checking',
            maskedAccountNumber: '8841',
            type: 'CHECKING',
            balanceCurrent: 4850.25,
            balanceAvailable: 4850.25,
          },
          {
            name: 'Freedom Unlimited Credit Card (DEMO)',
            officialName: 'Chase Freedom Card',
            maskedAccountNumber: '3920',
            type: 'CREDIT_CARD',
            balanceCurrent: 620.40,
            balanceAvailable: 9380.00,
          },
        ],
      },
    },
    include: { accounts: true },
  });

  console.log(`🏦 Created Bank Connection with ${connection.accounts.length} accounts.`);

  // 3. Sync Mock Transactions
  const bankProvider = new MockBankProvider();
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 1); // 1 year of historic transactions

  const rawTxList = await bankProvider.syncTransactions(connection.id, startDate);

  const accountMap: Record<string, string> = {};
  for (const acc of connection.accounts) {
    accountMap[acc.maskedAccountNumber] = acc.id;
  }

  // Map mock account IDs to DB account IDs
  const createdTransactions = [];
  for (const tx of rawTxList) {
    const targetAccountId = tx.accountId.includes('-acc-1')
      ? connection.accounts[0].id
      : connection.accounts[1].id;

    const merchantInfo = normalizeMerchantDescription(tx.rawDescription);

    // Upsert merchant
    let merchant = await prisma.merchant.findUnique({
      where: { normalizedName: merchantInfo.normalizedName },
    });

    if (!merchant) {
      merchant = await prisma.merchant.create({
        data: {
          normalizedName: merchantInfo.normalizedName,
          category: merchantInfo.category,
          website: merchantInfo.website,
          cancellationUrl: merchantInfo.cancellationUrl,
          cancellationPhone: merchantInfo.cancellationPhone,
          cancellationEmail: merchantInfo.cancellationEmail,
          cancellationInstructions: merchantInfo.cancellationInstructions,
        },
      });
    }

    const createdTx = await prisma.transaction.upsert({
      where: { providerTransactionId: tx.providerTransactionId },
      update: {
        amount: tx.amount,
        date: tx.date,
      },
      create: {
        accountId: targetAccountId,
        providerTransactionId: tx.providerTransactionId,
        amount: tx.amount,
        currency: tx.currency,
        date: tx.date,
        rawDescription: tx.rawDescription,
        cleanDescription: merchantInfo.normalizedName,
        category: merchantInfo.category,
        merchantId: merchant.id,
      },
    });

    createdTransactions.push({ ...createdTx, merchant });
  }

  console.log(`💳 Ingested ${createdTransactions.length} historical transactions.`);

  // 4. Run Detection Engine to Auto-Generate Subscriptions
  const merchantGrouped: Record<string, typeof createdTransactions> = {};
  for (const tx of createdTransactions) {
    if (!tx.merchantId) continue;
    if (!merchantGrouped[tx.merchantId]) merchantGrouped[tx.merchantId] = [];
    merchantGrouped[tx.merchantId].push(tx);
  }

  for (const [merchantId, txList] of Object.entries(merchantGrouped)) {
    const firstTx = txList[0];
    const rawDesc = firstTx.rawDescription;
    const category = firstTx.category;
    const amounts = txList.map((t) => t.amount);

    const falsePosCheck = isFalsePositiveSubscription(rawDesc, category, amounts);
    if (falsePosCheck.isExempt) {
      continue;
    }

    const dates = txList.map((t) => new Date(t.date));
    const cadence = analyzeTransactionCadence(dates);
    const cost = calculateCostEquivalents(txList[0].amount, cadence.frequency);
    const confidence = calculateConfidenceScore({
      occurrenceCount: txList.length,
      regularityScore: cadence.regularityScore,
      isKnownCatalogMerchant: true,
    });

    const sortedDates = [...dates].sort((a, b) => b.getTime() - a.getTime());
    const lastBillingDate = sortedDates[0];

    await prisma.subscription.upsert({
      where: {
        userId_merchantId: {
          userId: user.id,
          merchantId,
        },
      },
      update: {},
      create: {
        userId: user.id,
        merchantId,
        amount: txList[0].amount,
        currency: 'USD',
        frequency: cadence.frequency,
        confidenceScore: confidence,
        status: 'ACTIVE',
        userStatus: 'REVIEW',
        lastBillingDate,
        nextBillingDate: cadence.nextBillingDateForecast,
        monthlyCost: cost.monthlyCost,
        annualizedCost: cost.annualizedCost,
      },
    });
  }

  console.log('✅ Subscription Detection Engine finished processing seeded data.');

  // 5. Create Initial Audit Logs
  await prisma.auditLog.createMany({
    data: [
      {
        actorId: user.id,
        action: 'USER_LOGIN',
        resource: '/auth/login',
        ipAddress: '127.0.0.1',
        metadataJson: JSON.stringify({ device: 'Mobile Safari / iOS' }),
      },
      {
        actorId: user.id,
        action: 'BANK_SYNC_SUCCESS',
        resource: `/api/banks/${connection.id}/sync`,
        ipAddress: '127.0.0.1',
        metadataJson: JSON.stringify({ fetchedTransactions: createdTransactions.length }),
      },
    ],
  });

  console.log('🔒 Initial audit logs recorded.');
  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
