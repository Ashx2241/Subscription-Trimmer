export interface BankAccountDTO {
  id: string;
  name: string;
  officialName?: string;
  maskedAccountNumber: string;
  type: 'CHECKING' | 'SAVINGS' | 'CREDIT_CARD';
  currency: string;
  balanceCurrent: number;
  balanceAvailable?: number;
}

export interface BankTransactionDTO {
  providerTransactionId: string;
  accountId: string;
  amount: number;
  currency: string;
  date: Date;
  rawDescription: string;
  category: string;
  isPending: boolean;
}

export interface IBankingProvider {
  providerName: 'PLAID' | 'MX' | 'MOCK';
  syncAccounts(connectionId: string): Promise<BankAccountDTO[]>;
  syncTransactions(connectionId: string, startDate: Date): Promise<BankTransactionDTO[]>;
}
