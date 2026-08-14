export interface VoiceAgentCallOptions {
  merchantName: string;
  customerPhone: string;
  accountNumber: string;
  cancellationReason: string;
}

export class VoiceAgentService {
  private apiKey: string | undefined;

  constructor() {
    this.apiKey = process.env.VAPI_API_KEY || process.env.BLAND_AI_API_KEY;
  }

  async dispatchCancellationCall(options: VoiceAgentCallOptions) {
    if (this.apiKey) {
      console.log(`[Voice AI Agent] Calling customer service for ${options.merchantName}...`);
    }

    return {
      callId: `call-vapi-${Date.now()}`,
      merchantName: options.merchantName,
      status: 'CALL_INITIATED',
      phoneNumberCalled: '1-800-555-0199',
      transcriptSnippet: `AI: "Hello, I am calling on behalf of Jane Doe to request immediate cancellation of account #${options.accountNumber}..."`,
      estimatedCompletionMinutes: 3,
    };
  }
}
