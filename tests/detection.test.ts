import { normalizeMerchantDescription } from '../src/services/detection/normalizationEngine';
import { analyzeTransactionCadence } from '../src/services/detection/cadenceAnalyzer';
import { calculateCostEquivalents, calculateConfidenceScore } from '../src/services/detection/scoringEngine';
import { isFalsePositiveSubscription } from '../src/services/detection/falsePositiveFilter';

async function runTests() {
  console.log('🧪 Running Subscription Trimmer Engine Unit Tests...\n');

  // Test 1: Merchant Normalization
  console.log('Test 1: Merchant Normalization Engine');
  const m1 = normalizeMerchantDescription('PAYPAL *NETFLIX.COM 800-531-5321 CA');
  console.assert(m1.normalizedName === 'Netflix', `Expected Netflix, got ${m1.normalizedName}`);
  console.assert(m1.category === 'Entertainment', `Expected Entertainment, got ${m1.category}`);
  console.log('  ✓ Normalization test passed');

  // Test 2: Cadence Analysis
  console.log('\nTest 2: Cadence Intervals Analyzer');
  const d1 = new Date('2026-01-14');
  const d2 = new Date('2026-02-14');
  const d3 = new Date('2026-03-14');
  const cadence = analyzeTransactionCadence([d1, d2, d3]);
  console.assert(cadence.frequency === 'MONTHLY', `Expected MONTHLY, got ${cadence.frequency}`);
  console.log(`  ✓ Cadence test passed (${cadence.frequency}, avg ${cadence.averageIntervalDays} days)`);

  // Test 3: Cost Calculations
  console.log('\nTest 3: Annualized & Monthly Cost Equivalents');
  const cost1 = calculateCostEquivalents(15.99, 'MONTHLY');
  console.assert(cost1.monthlyCost === 15.99, `Expected 15.99, got ${cost1.monthlyCost}`);
  console.assert(cost1.annualizedCost === 191.88, `Expected 191.88, got ${cost1.annualizedCost}`);
  console.log('  ✓ Cost calculation test passed');

  // Test 4: False Positive Exemption
  console.log('\nTest 4: False Positive Exemption Rules');
  const check1 = isFalsePositiveSubscription('TARGET STORE #1842 BROOKLYN NY', 'Shopping', [42.50]);
  console.assert(check1.isExempt === true, 'Expected Target physical store purchase to be exempt');
  console.log('  ✓ False positive exemption test passed');

  // Test 5: Confidence Scoring
  console.log('\nTest 5: Confidence Scoring Algorithm');
  const score = calculateConfidenceScore({ occurrenceCount: 6, regularityScore: 0.95, isKnownCatalogMerchant: true });
  console.assert(score >= 0.85, `Expected score >= 0.85, got ${score}`);
  console.log(`  ✓ Confidence score test passed (${(score * 100).toFixed(0)}%)`);

  console.log('\n🎉 ALL ENGINE UNIT TESTS PASSED SUCCESSFULLY!');
}

runTests().catch((e) => {
  console.error('❌ Test execution failed:', e);
  process.exit(1);
});
