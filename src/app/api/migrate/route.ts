import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST() {
  try {
    const sql = getDb();

    await sql`CREATE EXTENSION IF NOT EXISTS pgcrypto`;

    await sql`CREATE TABLE IF NOT EXISTS suppliers (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL UNIQUE,
      contact_email TEXT,
      phone TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )`;

    await sql`CREATE TABLE IF NOT EXISTS products (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      sku TEXT NOT NULL UNIQUE,
      quantity INTEGER NOT NULL DEFAULT 0,
      unit_price NUMERIC(12,2) NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )`;

    await sql`CREATE TABLE IF NOT EXISTS product_suppliers (
      product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
      PRIMARY KEY (product_id, supplier_id)
    )`;

    await sql`CREATE TABLE IF NOT EXISTS transactions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      type TEXT NOT NULL CHECK (type IN ('purchase','sale')),
      quantity INTEGER NOT NULL CHECK (quantity > 0),
      unit_price NUMERIC(12,2) NOT NULL CHECK (unit_price >= 0),
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )`;

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message ?? 'migration failed' }, { status: 500 });
  }
}


