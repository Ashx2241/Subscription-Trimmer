import { IBankingProvider, BankAccountDTO, BankTransactionDTO } from './IBankingProvider';

export class PlaidProvider implements IBankingProvider {
  readonly providerName = 'PLAID' as const;

  async syncAccounts(connectionId: string): Promise<BankAccountDTO[]> {
    console.log(`[PlaidProvider] Syncing accounts for connection: ${connectionId}`);
    return [];
  }

  async syncTransactions(connectionId: string, startDate: Date): Promise<BankTransactionDTO[]> {
    console.log(`[PlaidProvider] Syncing transactions since ${startDate.toISOString()} for connection: ${connectionId}`);
    return [];
  }
}
