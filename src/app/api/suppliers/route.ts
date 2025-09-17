import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { z } from 'zod';

const supplierSchema = z.object({
  name: z.string().min(1),
  contactEmail: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
});

export async function GET() {
  const sql = getDb();
  const rows = await sql`SELECT * FROM suppliers ORDER BY created_at DESC`;
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = supplierSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
  const { name, contactEmail, phone } = parsed.data;
  const sql = getDb();
  try {
    const [supplier] = await sql`INSERT INTO suppliers (name, contact_email, phone) VALUES (${name}, ${contactEmail}, ${phone}) RETURNING *`;
    return NextResponse.json(supplier, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}


