# Inventory Management

A mini inventory management system for a small retail business. Tracks products, suppliers, and transactions with simple reports.

## Stack

- Next.js 15 (App Router, API Routes)
- React 19
- Tailwind CSS 4
- Neon (PostgreSQL) using `@neondatabase/serverless`
- TypeScript + ESLint
- Zod for validation
- Vercel for hosting

## Features

- Dashboard: totals, low-stock count, inventory value
- Products: create, list, delete; link suppliers
- Suppliers: create, list, delete
- Transactions: record purchases/sales with stock updates
- Reports: low stock, inventory value, products by supplier
- Seed endpoint to populate demo data

## Prerequisites

- Node.js 18+
- A Neon project/database
- Vercel account (for deployment)

## Environment Variables

Create a `.env` file in the project root:

```
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DBNAME?sslmode=require
```

Notes:
- Do not expose `DATABASE_URL` to the client.
- On Vercel, add `DATABASE_URL` in Project Settings → Environment Variables.

## Local Development

1) Install dependencies
```
npm install
```

2) Run DB migrations
```
# Starts the dev server in another terminal first or use a REST client
# Then call the migration route once to create tables
curl -X POST http://localhost:3000/api/migrate
```

3) (Optional) Seed sample data
```
curl -X POST http://localhost:3000/api/seed
```

4) Start dev server
```
npm run dev
```

Visit `http://localhost:3000`.

## API Endpoints

- `POST /api/migrate`: create tables
- `POST /api/seed`: seed demo data
- `GET /api/products`, `POST /api/products`
- `PUT /api/products/:id`, `DELETE /api/products/:id`
- `GET /api/suppliers`, `POST /api/suppliers`
- `PUT /api/suppliers/:id`, `DELETE /api/suppliers/:id`
- `GET /api/transactions`, `POST /api/transactions`
- `GET /api/reports?type=low-stock&threshold=5`
- `GET /api/reports?type=inventory-value`
- `GET /api/reports?type=products-by-supplier&supplierId=UUID`

## Deployment (Vercel)

1) Push code to GitHub.
2) In Vercel, import this repo as a project.
3) Set Environment Variable `DATABASE_URL` for Production (and Preview if needed).
4) Deploy.
5) After first deploy, run migrations:
   - `POST https://<your-app-url>/api/migrate`
   - Optionally seed: `POST https://<your-app-url>/api/seed`

### Deploy via Vercel CLI
```
# From project root
npx vercel --prod --yes
```

## Security & Best Practices

- `DATABASE_URL` is accessed server-side only via `src/lib/db.ts`
- Validation with Zod on all write endpoints
- Guard clauses for errors; no silent failures
- No comments in source files; README documents behavior

## Scripts

- `npm run dev`: start dev server
- `npm run build`: production build
- `npm start`: run production server
- `npm run lint`: run ESLint

## Troubleshooting

- Missing tables: run `POST /api/migrate`
- Empty UI: run `POST /api/seed`
- Build type errors from Neon SQL: ensure you are not tuple-destructuring SQL results; treat them as arrays.
