import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { z } from 'zod';

const supplierSchema = z.object({
  name: z.string().min(1),
  contactEmail: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
});

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const body = await req.json();
  const parsed = supplierSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
  const { name, contactEmail, phone } = parsed.data;
  const sql = getDb();
  try {
    const [supplier] = await sql`UPDATE suppliers SET name=${name}, contact_email=${contactEmail}, phone=${phone}, updated_at=now() WHERE id=${id} RETURNING *`;
    return NextResponse.json(supplier);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const sql = getDb();
  const result = await sql`DELETE FROM suppliers WHERE id=${id}`;
  if ((result as any).count === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return new NextResponse(null, { status: 204 });
}


