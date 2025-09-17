"use client";
import { useEffect, useState } from 'react';

type Product = { id: string; name: string };
type Tx = { id: string; type: 'purchase' | 'sale'; quantity: number; unit_price: number; created_at: string };

export default function TransactionsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [txs, setTxs] = useState<Tx[]>([]);
  const [form, setForm] = useState({ productId: '', type: 'purchase' as 'purchase' | 'sale', quantity: 1, unitPrice: 0 });

  async function refresh() {
    const [pRes, tRes] = await Promise.all([fetch('/api/products'), fetch('/api/transactions')]);
    setProducts(await pRes.json());
    setTxs(await tRes.json());
  }

  useEffect(() => { refresh(); }, []);

  async function createTx() {
    await fetch('/api/transactions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setForm({ ...form, quantity: 1 });
    await refresh();
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white rounded-lg border-2 border-gray-200 p-6 space-y-6 shadow-lg">
          <div className="font-semibold text-xl text-gray-800">Record New Transaction</div>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
              <select 
                value={form.productId} 
                onChange={e=>setForm({ ...form, productId: e.target.value })} 
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              >
                <option value="">Select a product</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Type</label>
              <select 
                value={form.type} 
                onChange={e=>setForm({ ...form, type: e.target.value as any })} 
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              >
                <option value="purchase">📦 Purchase (Add Stock)</option>
                <option value="sale">💰 Sale (Remove Stock)</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input 
                  type="number" 
                  value={form.quantity} 
                  onChange={e=>setForm({ ...form, quantity: Number(e.target.value) })} 
                  placeholder="Enter quantity" 
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price ($)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  value={form.unitPrice} 
                  onChange={e=>setForm({ ...form, unitPrice: Number(e.target.value) })} 
                  placeholder="Enter price" 
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900" 
                />
              </div>
            </div>
          </div>
          <button 
            onClick={createTx} 
            className="w-full px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-md hover:shadow-lg transition-all"
          >
            Record Transaction
          </button>
        </div>
        <div className="bg-white rounded-lg border-2 border-gray-200 p-6 shadow-lg">
          <div className="font-semibold text-xl text-gray-800 mb-6">Recent Transactions ({txs.length})</div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {txs.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📊</div>
                <p className="text-gray-600 text-lg font-medium">No transactions found</p>
                <p className="text-gray-500">Record your first transaction using the form on the left!</p>
              </div>
            ) : (
              txs.map(t => (
                <div key={t.id} className="p-4 border-2 border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${t.type === 'purchase' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                          {t.type === 'purchase' ? '📦 PURCHASE' : '💰 SALE'}
                        </span>
                        <span className="text-sm text-gray-500">{new Date(t.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="text-sm text-gray-700">
                        <span className="font-semibold">Qty:</span> {t.quantity} · 
                        <span className="font-semibold ml-2">Price:</span> ${Number(t.unit_price).toFixed(2)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">
                        ${(t.quantity * Number(t.unit_price)).toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(t.created_at).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}



