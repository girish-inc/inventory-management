import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { z } from 'zod';

const productSchema = z.object({
  name: z.string().min(1),
  sku: z.string().min(1),
  quantity: z.number().int().min(0),
  unitPrice: z.number().min(0),
  supplierIds: z.array(z.string().uuid()).optional().default([]),
});

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const body = await req.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
  const { name, sku, quantity, unitPrice, supplierIds } = parsed.data;
  const sql = getDb();
  try {
    const [product] = await sql`UPDATE products SET name=${name}, sku=${sku}, quantity=${quantity}, unit_price=${unitPrice}, updated_at=now() WHERE id=${id} RETURNING *`;
    await sql`DELETE FROM product_suppliers WHERE product_id=${id}`;
    if (supplierIds && supplierIds.length) {
      await sql`INSERT INTO product_suppliers ${sql(
        supplierIds.map((sid) => ({ product_id: id, supplier_id: sid }))
      )}`;
    }
    return NextResponse.json(product);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const sql = getDb();
  const result = await sql`DELETE FROM products WHERE id=${id}`;
  if ((result as any).count === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return new NextResponse(null, { status: 204 });
}


