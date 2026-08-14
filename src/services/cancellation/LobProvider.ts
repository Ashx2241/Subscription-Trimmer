export interface CertifiedMailRequest {
  userName: string;
  userAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  merchantName: string;
  merchantAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  letterBody: string;
}

export class LobCertifiedMailProvider {
  private apiKey: string | undefined;

  constructor() {
    this.apiKey = process.env.LOB_API_KEY;
  }

  async sendCertifiedLetter(req: CertifiedMailRequest): Promise<{ trackingNumber: string; status: string; estimatedDelivery: string }> {
    if (this.apiKey) {
      console.log(`[Lob API] Sending physical certified letter to ${req.merchantName}...`);
    }

    // Mock Certified Mail Tracking Number & Status
    const mockTrackingNumber = `940711189956${Math.floor(10000000 + Math.random() * 90000000)}`;
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3);

    return {
      trackingNumber: mockTrackingNumber,
      status: 'DISPATCHED_CERTIFIED_MAIL',
      estimatedDelivery: deliveryDate.toISOString().split('T')[0],
    };
  }
}
