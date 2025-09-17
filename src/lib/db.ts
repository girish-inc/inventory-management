import 'server-only';
import { neon, type NeonQueryFunction } from '@neondatabase/serverless';

let cachedClient: NeonQueryFunction<Record<string, unknown>[]> | null = null;

export function getDb(): NeonQueryFunction<Record<string, unknown>[]> {
  const connectionString = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
  }
  if (!cachedClient) {
    cachedClient = neon(connectionString);
  }
  return cachedClient;
}

export async function withTransaction<T>(fn: (sql: NeonQueryFunction<Record<string, unknown>[]>) => Promise<T>): Promise<T> {
  const sql = getDb();
  await sql`BEGIN`;
  try {
    const result = await fn(sql);
    await sql`COMMIT`;
    return result;
  } catch (error) {
    await sql`ROLLBACK`;
    throw error;
  }
}


