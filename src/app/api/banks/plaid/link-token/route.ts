import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { getSessionContext } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionContext();
    const userId = session?.userId || 'user-demo-1';

    const plaidClientId = process.env.PLAID_CLIENT_ID;
    const plaidSecret = process.env.PLAID_SECRET;

    if (plaidClientId && plaidSecret) {
      // Production / Sandbox Plaid API Call
      const response = await fetch('https://sandbox.plaid.com/link/token/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: plaidClientId,
          secret: plaidSecret,
          client_name: 'Subscription Trimmer AI',
          user: { client_user_id: userId },
          products: ['transactions'],
          country_codes: ['US'],
          language: 'en',
        }),
      });

      const data = await response.json();
      if (response.ok) {
        return successResponse({ linkToken: data.link_token }, 'Plaid Link token created');
      }
    }

    // Fallback Mock Link Token for Sandbox Demo Mode
    return successResponse(
      { linkToken: 'link-sandbox-mock-token-subscription-trimmer-2026' },
      'Mock Plaid Link token generated (Sandbox Demo Mode)'
    );
  } catch (error) {
    console.error('Plaid Link Token Error:', error);
    return successResponse(
      { linkToken: 'link-sandbox-mock-token-subscription-trimmer-2026' },
      'Mock Plaid Link token generated (Sandbox Fallback)'
    );
  }
}
