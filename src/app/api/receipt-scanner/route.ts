import { NextRequest, NextResponse } from 'next/server';
import { getSessionContext } from '@/lib/auth';
import { ReceiptOCRService } from '@/services/ai/ReceiptOCRService';

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionContext();
    const userId = session?.userId || 'user-demo-id';

    const body = await req.json();
    const { imageBase64, fileName } = body;

    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return NextResponse.json(
        { success: false, error: { message: 'No valid base64 receipt image provided' } },
        { status: 400 }
      );
    }

    const ocrResult = await ReceiptOCRService.analyzeReceiptImage(imageBase64, fileName || 'receipt.jpg');
    const registerResult = await ReceiptOCRService.registerScannedSubscription(userId, ocrResult);

    return NextResponse.json({
      success: true,
      data: ocrResult,
      dbStatus: registerResult,
    });
  } catch (err: unknown) {
    console.error('Receipt OCR Error:', err);
    return NextResponse.json(
      { success: false, error: { message: err instanceof Error ? err.message : 'Failed to scan receipt image' } },
      { status: 500 }
    );
  }
}
