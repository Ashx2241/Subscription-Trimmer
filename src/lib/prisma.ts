import { PrismaClient } from '@prisma/client';

function getDatabaseUrl(): string | undefined {
  let url = process.env.DATABASE_URL;
  if (!url) return undefined;

  try {
    const parsed = new URL(url);
    // If DATABASE_URL uses Supabase direct connection host (IPv6 only on AWS),
    // normalize to Supabase IPv4 connection pooler so serverless runtimes (Vercel) connect reliably.
    if (parsed.hostname.startsWith('db.') && parsed.hostname.endsWith('.supabase.co')) {
      const parts = parsed.hostname.split('.');
      const projectRef = parts[1];
      if (projectRef) {
        parsed.hostname = 'aws-0-ap-southeast-1.pooler.supabase.com';
        if (parsed.username === 'postgres') {
          parsed.username = `postgres.${projectRef}`;
        }
        parsed.port = '6543';
        parsed.searchParams.set('pgbouncer', 'true');
        url = parsed.toString();
      }
    }
  } catch (e) {
    // If URL parsing fails, retain original value
  }

  return url;
}

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const databaseUrl = getDatabaseUrl();

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: databaseUrl
      ? {
          db: {
            url: databaseUrl,
          },
        }
      : undefined,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

