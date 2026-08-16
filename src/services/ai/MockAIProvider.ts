import { IAIProvider, CancellationLetterInput } from './IAIProvider';

function sanitizeInput(str: string | undefined): string {
  if (!str) return '';
  // Sanitize potential prompt injection characters or markdown blocks
  return str
    .replace(/[<>{}\\]/g, '')
    .replace(/ignore previous instructions/gi, '')
    .replace(/system prompt/gi, '')
    .trim();
}

export class MockAIProvider implements IAIProvider {
  readonly providerName = 'MOCK' as const;

  async generateCancellationLetter(input: CancellationLetterInput): Promise<string> {
    const safeUserName = sanitizeInput(input.userName) || 'Valued Customer';
    const safeUserEmail = sanitizeInput(input.userEmail) || 'user@example.com';
    const safeMerchant = sanitizeInput(input.merchantName) || 'Service Provider';
    const safeAccount = sanitizeInput(input.accountNumber) || 'SUB-ACCT-PENDING';
    const safePhone = sanitizeInput(input.userPhone) || 'Not Provided';
    const safeDate = sanitizeInput(input.effectiveDate) || new Date().toLocaleDateString('en-US');

    return `FORMAL NOTICE OF CANCELLATION AND REVOCATION OF PAYMENT AUTHORIZATION

DATE: ${safeDate}
TO: Customer Support & Legal Compliance Team (${safeMerchant})
RE: Immediate Cancellation of Subscription / Account: ${safeAccount}

Dear Customer Service Manager,

Please accept this letter as my formal written notice of immediate cancellation for my subscription service with ${safeMerchant}.

ACCOUNT DETAILS:
- Account Holder Name: ${safeUserName}
- Registered Email Address: ${safeUserEmail}
- Contact Phone Number: ${safePhone}
- Account / Subscription ID: ${safeAccount}

LEGAL COMPLIANCE STATEMENT:
Pursuant to applicable state and federal consumer protection statutes—including the California Automatic Renewal Law (Cal. Bus. & Prof. Code § 17600 et seq.), New York GBL § 527-a, and the FTC Rule on Recurring Subscriptions—I hereby REVOKE all ongoing authorization for automated recurring charges to my linked credit card or bank account.

REQUESTED ACTIONS:
1. Immediately terminate my active subscription and cancel all scheduled recurring billing.
2. Confirm in writing via email (${safeUserEmail}) that this account has been fully cancelled and no further charges will occur.
3. Issue a pro-rata refund for any unearned pre-paid subscription balances if applicable under your terms of service.

Thank you for your prompt assistance in resolving this matter.

Sincerely,

${safeUserName}
[Digitally Signed via Subscription Trimmer Security Verification #TRIM-${Math.floor(100000 + Math.random() * 900000)}]`;
  }
}
