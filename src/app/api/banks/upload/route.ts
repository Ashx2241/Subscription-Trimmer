import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { CSVStatementParser } from '@/services/importer/CSVStatementParser';

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    const userId = session.userId;

    const body = await req.json();
    const csvContent = body.csvText;

    if (!csvContent || typeof csvContent !== 'string') {
      return NextResponse.json(
        { success: false, error: { message: 'No valid CSV content provided' } },
        { status: 400 }
      );
    }

    const parsedRows = CSVStatementParser.parseCSVContent(csvContent);
    if (parsedRows.length === 0) {
      return NextResponse.json(
        { success: false, error: { message: 'Could not parse any transaction rows from CSV' } },
        { status: 400 }
      );
    }

    const result = await CSVStatementParser.importTransactionsAndDetect(userId, parsedRows);
    return NextResponse.json(result);
  } catch (err: unknown) {
    console.error('CSV Import Error:', err);
    return NextResponse.json(
      { success: false, error: { message: err instanceof Error ? err.message : 'Failed to process CSV file' } },
      { status: 500 }
    );
  }
}
