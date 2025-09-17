import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { z } from 'zod';

const txSchema = z.object({
  productId: z.string().uuid(),
  type: z.enum(['purchase', 'sale']),
  quantity: z.number().int().positive(),
  unitPrice: z.number().nonnegative(),
});

type QtyRow = { quantity: number };

export async function GET() {
  const sql = getDb();
  const rows = await sql`SELECT * FROM transactions ORDER BY created_at DESC`;
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = txSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
  const { productId, type, quantity, unitPrice } = parsed.data;
  const sql = getDb();
  try {
    const sign = type === 'purchase' ? 1 : -1;
    const [p] = await sql<QtyRow[]>`SELECT quantity FROM products WHERE id=${productId}`;
    if (!p) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    const newQty = Number(p.quantity ?? 0) + sign * quantity;
    if (newQty < 0) return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 });

    const [tx] = await sql`INSERT INTO transactions (product_id, type, quantity, unit_price)
                           VALUES (${productId}, ${type}, ${quantity}, ${unitPrice})
                           RETURNING *`;
    await sql`UPDATE products SET quantity=${newQty}, updated_at=now() WHERE id=${productId}`;
    return NextResponse.json(tx, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}


