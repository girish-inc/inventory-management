import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { z } from 'zod';

type ProductRow = {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  unit_price: number;
  created_at: string;
  updated_at: string;
};

const productSchema = z.object({
  name: z.string().min(1),
  sku: z.string().min(1),
  quantity: z.number().int().min(0).default(0),
  unitPrice: z.number().min(0).default(0),
  supplierIds: z.array(z.string().uuid()).optional().default([]),
});

export async function GET() {
  const sql = getDb();
  const rows = await sql<ProductRow[]>`SELECT p.*, COALESCE(json_agg(ps.supplier_id) FILTER (WHERE ps.supplier_id IS NOT NULL), '[]') AS supplier_ids
                         FROM products p
                         LEFT JOIN product_suppliers ps ON ps.product_id = p.id
                         GROUP BY p.id
                         ORDER BY p.created_at DESC`;
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
  const { name, sku, quantity, unitPrice, supplierIds } = parsed.data;
  const sql = getDb();
  try {
    const [product] = await sql<ProductRow[]>`INSERT INTO products (name, sku, quantity, unit_price)
                                VALUES (${name}, ${sku}, ${quantity}, ${unitPrice})
                                RETURNING *`;
    if (supplierIds && supplierIds.length) {
      const tuples = supplierIds.map((sid) => [product.id, sid]);
      await sql`INSERT INTO product_suppliers (product_id, supplier_id) VALUES ${sql(tuples)}`;
    }
    return NextResponse.json(product, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}


