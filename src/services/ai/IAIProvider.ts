export interface CancellationLetterInput {
  userName: string;
  userEmail: string;
  userPhone?: string;
  merchantName: string;
  merchantEmail?: string;
  accountNumber?: string;
  effectiveDate?: string;
  additionalDetails?: string;
}

export interface IAIProvider {
  providerName: 'OPENAI' | 'MOCK';
  generateCancellationLetter(input: CancellationLetterInput): Promise<string>;
}
