import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { z } from 'zod';

const productSchema = z.object({
  name: z.string().min(1),
  sku: z.string().min(1),
  quantity: z.number().int().min(0).default(0),
  unitPrice: z.number().min(0).default(0),
  supplierIds: z.array(z.string().uuid()).optional().default([]),
});

export async function GET() {
  const sql = getDb();
  const rows = await sql`SELECT * FROM products ORDER BY created_at DESC`;
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
  const { name, sku, quantity, unitPrice, supplierIds } = parsed.data;
  const sql = getDb();
  try {
    const [product] = await sql`INSERT INTO products (name, sku, quantity, unit_price)
                                VALUES (${name}, ${sku}, ${quantity}, ${unitPrice})
                                RETURNING *`;
    if (supplierIds && supplierIds.length) {
      for (const supplierId of supplierIds) {
        await sql`INSERT INTO product_suppliers (product_id, supplier_id) VALUES (${product.id}, ${supplierId})`;
      }
    }
    return NextResponse.json(product, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}


