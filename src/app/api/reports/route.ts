import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(req: NextRequest) {
  const sql = getDb();
  const search = new URL(req.url).searchParams;
  const report = search.get('type');

  if (report === 'low-stock') {
    const threshold = Number(search.get('threshold') ?? 5);
    if (!Number.isFinite(threshold) || threshold < 0) return NextResponse.json({ error: 'Invalid threshold' }, { status: 400 });
    const rows = await sql`SELECT * FROM products WHERE quantity <= ${threshold} ORDER BY quantity ASC`;
    return NextResponse.json(rows);
  }

  if (report === 'inventory-value') {
    const rows = await sql`SELECT COALESCE(SUM(quantity * unit_price), 0) AS total FROM products` as unknown as Array<{ total: number }>;
    const row = rows[0] ?? { total: 0 };
    return NextResponse.json({ total: row.total });
  }

  if (report === 'products-by-supplier') {
    const supplierId = search.get('supplierId');
    if (!supplierId) return NextResponse.json({ error: 'supplierId is required' }, { status: 400 });
    const rows = await sql`SELECT p.* FROM products p
                           JOIN product_suppliers ps ON ps.product_id = p.id
                           WHERE ps.supplier_id = ${supplierId}`;
    return NextResponse.json(rows);
  }

  return NextResponse.json({ error: 'Unknown report' }, { status: 400 });
}


