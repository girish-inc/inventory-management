import 'server-only';
import { neon } from '@neondatabase/serverless';

type Sql = ReturnType<typeof neon>;

let cachedClient: Sql | null = null;

export function getDb(): Sql {
  const connectionString = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
  }
  if (!cachedClient) {
    cachedClient = neon(connectionString);
  }
  return cachedClient;
}

export async function withTransaction<T>(fn: (sql: Sql) => Promise<T>): Promise<T> {
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


