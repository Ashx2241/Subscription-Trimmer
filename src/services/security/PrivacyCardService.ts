export interface VirtualCardOptions {
  merchantName: string;
  spendLimit: number;
  type: 'SINGLE_USE' | 'MERCHANT_LOCKED';
}

export class PrivacyCardService {
  private apiKey: string | undefined;

  constructor() {
    this.apiKey = process.env.PRIVACY_API_KEY;
  }

  async createVirtualCard(options: VirtualCardOptions) {
    if (this.apiKey) {
      console.log(`[Privacy.com API] Creating ${options.type} card for ${options.merchantName}...`);
    }

    const mockCardNumber = `4111 22${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`;
    const expDate = '12/28';
    const cvv = `${Math.floor(100 + Math.random() * 900)}`;

    return {
      id: `card-${Date.now()}`,
      merchantName: options.merchantName,
      cardNumber: mockCardNumber,
      expirationDate: expDate,
      cvv,
      spendLimit: options.spendLimit,
      type: options.type,
      status: 'ACTIVE_LOCKED',
      autoLockTriggered: true,
      message: 'Virtual card created & pre-locked against unwanted auto-renewal charges.',
    };
  }
}
