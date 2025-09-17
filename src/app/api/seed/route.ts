import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST() {
  try {
    const sql = getDb();

    await sql`DELETE FROM transactions`;
    await sql`DELETE FROM product_suppliers`;
    await sql`DELETE FROM products`;
    await sql`DELETE FROM suppliers`;

    const supplier1Rows = await sql`
      INSERT INTO suppliers (name, contact_email, phone) 
      VALUES ('TechCorp Electronics', 'orders@techcorp.com', '+1-555-0123')
      RETURNING *
    ` as unknown as Array<Record<string, unknown>>;
    const supplier1 = supplier1Rows[0] as { id: string };
    
    const supplier2Rows = await sql`
      INSERT INTO suppliers (name, contact_email, phone) 
      VALUES ('Office Supplies Co', 'sales@officesupplies.com', '+1-555-0456')
      RETURNING *
    ` as unknown as Array<Record<string, unknown>>;
    const supplier2 = supplier2Rows[0] as { id: string };

    const supplier3Rows = await sql`
      INSERT INTO suppliers (name, contact_email, phone) 
      VALUES ('Fashion Forward', 'orders@fashionforward.com', '+1-555-0789')
      RETURNING *
    ` as unknown as Array<Record<string, unknown>>;
    const supplier3 = supplier3Rows[0] as { id: string };

    const product1Rows = await sql`
      INSERT INTO products (name, sku, quantity, unit_price) 
      VALUES ('Wireless Mouse', 'WM-001', 25, 29.99)
      RETURNING *
    ` as unknown as Array<Record<string, unknown>>;
    const product1 = product1Rows[0] as { id: string };

    const product2Rows = await sql`
      INSERT INTO products (name, sku, quantity, unit_price) 
      VALUES ('Mechanical Keyboard', 'KB-002', 15, 89.99)
      RETURNING *
    ` as unknown as Array<Record<string, unknown>>;
    const product2 = product2Rows[0] as { id: string };

    const product3Rows = await sql`
      INSERT INTO products (name, sku, quantity, unit_price) 
      VALUES ('Office Chair', 'OC-003', 3, 199.99)
      RETURNING *
    ` as unknown as Array<Record<string, unknown>>;
    const product3 = product3Rows[0] as { id: string };

    const product4Rows = await sql`
      INSERT INTO products (name, sku, quantity, unit_price) 
      VALUES ('Desk Lamp', 'DL-004', 8, 45.50)
      RETURNING *
    ` as unknown as Array<Record<string, unknown>>;
    const product4 = product4Rows[0] as { id: string };

    const product5Rows = await sql`
      INSERT INTO products (name, sku, quantity, unit_price) 
      VALUES ('Bluetooth Headphones', 'BH-005', 12, 79.99)
      RETURNING *
    ` as unknown as Array<Record<string, unknown>>;
    const product5 = product5Rows[0] as { id: string };

    await sql`
      INSERT INTO product_suppliers (product_id, supplier_id) 
      VALUES 
        (${product1.id}, ${supplier1.id}),
        (${product2.id}, ${supplier1.id}),
        (${product5.id}, ${supplier1.id}),
        (${product3.id}, ${supplier2.id}),
        (${product4.id}, ${supplier2.id}),
        (${product4.id}, ${supplier3.id})
    `;

    await sql`
      INSERT INTO transactions (product_id, type, quantity, unit_price) 
      VALUES 
        (${product1.id}, 'purchase', 30, 25.00),
        (${product1.id}, 'sale', 5, 29.99),
        (${product2.id}, 'purchase', 20, 75.00),
        (${product2.id}, 'sale', 5, 89.99),
        (${product3.id}, 'purchase', 10, 150.00),
        (${product3.id}, 'sale', 7, 199.99),
        (${product4.id}, 'purchase', 15, 35.00),
        (${product4.id}, 'sale', 7, 45.50),
        (${product5.id}, 'purchase', 15, 65.00),
        (${product5.id}, 'sale', 3, 79.99)
    `;

    return NextResponse.json({ 
      message: 'Sample data seeded successfully',
      suppliers: 3,
      products: 5,
      transactions: 10
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
