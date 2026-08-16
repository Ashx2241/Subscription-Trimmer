import { IAIProvider, CancellationLetterInput } from './IAIProvider';
import { MockAIProvider } from './MockAIProvider';

export class OpenAIProvider implements IAIProvider {
  readonly providerName = 'OPENAI' as const;
  private fallbackProvider = new MockAIProvider();

  async generateCancellationLetter(input: CancellationLetterInput): Promise<string> {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      console.warn('[OpenAIProvider] OPENAI_API_KEY missing. Falling back to MockAIProvider.');
      return this.fallbackProvider.generateCancellationLetter(input);
    }

    try {
      // Stub for real OpenAI fetch API call when OPENAI_API_KEY is configured
      return this.fallbackProvider.generateCancellationLetter(input);
    } catch (error) {
      console.error('[OpenAIProvider] Error generating letter via OpenAI API:', error);
      return this.fallbackProvider.generateCancellationLetter(input);
    }
  }
}
