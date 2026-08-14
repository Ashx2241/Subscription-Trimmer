import { IBankingProvider, BankAccountDTO, BankTransactionDTO } from './IBankingProvider';

export class MXProvider implements IBankingProvider {
  providerName: 'MX' = 'MX';

  async syncAccounts(connectionId: string): Promise<BankAccountDTO[]> {
    console.log(`[MXProvider] Syncing accounts for connection: ${connectionId}`);
    return [];
  }

  async syncTransactions(connectionId: string, startDate: Date): Promise<BankTransactionDTO[]> {
    console.log(`[MXProvider] Syncing transactions since ${startDate.toISOString()} for connection: ${connectionId}`);
    return [];
  }
}
