import { IBankingProvider, BankAccountDTO, BankTransactionDTO } from './IBankingProvider';

export class PlaidProvider implements IBankingProvider {
  providerName: 'PLAID' = 'PLAID';

  async syncAccounts(connectionId: string): Promise<BankAccountDTO[]> {
    console.log(`[PlaidProvider] Syncing accounts for connection: ${connectionId}`);
    return [];
  }

  async syncTransactions(connectionId: string, startDate: Date): Promise<BankTransactionDTO[]> {
    console.log(`[PlaidProvider] Syncing transactions since ${startDate.toISOString()} for connection: ${connectionId}`);
    return [];
  }
}
