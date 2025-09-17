"use client";
import { useEffect, useMemo, useState } from 'react';

type Product = {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  unit_price: number;
};

export default function ProductsPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [form, setForm] = useState({ name: '', sku: '', quantity: 0, unitPrice: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = async () => {
    const res = await fetch('/api/products');
    const data = await res.json();
    setItems(data);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  async function createProduct() {
    setLoading(true); setError(null);
    const res = await fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    if (!res.ok) { const err = await res.json(); setError(err.error || 'Failed'); setLoading(false); return; }
    setForm({ name: '', sku: '', quantity: 0, unitPrice: 0 });
    await fetchItems();
    setLoading(false);
  }

  async function deleteProduct(id: string) {
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    await fetchItems();
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-extrabold text-purple-700 tracking-tight">Products</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white rounded-lg border-2 border-gray-200 p-6 space-y-6 shadow-lg">
          <div className="font-semibold text-xl text-gray-800">Add New Product</div>
          {error && <div className="text-red-700 text-sm bg-red-100 border border-red-300 p-3 rounded-lg font-medium">{error}</div>}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input 
                value={form.name} 
                onChange={e=>setForm({ ...form, name: e.target.value })} 
                placeholder="Enter product name" 
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
              <input 
                value={form.sku} 
                onChange={e=>setForm({ ...form, sku: e.target.value })} 
                placeholder="Enter SKU" 
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900" 
              />
            </div>
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
          <button 
            disabled={loading} 
            onClick={createProduct} 
            className="w-full px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all"
          >
            {loading ? 'Saving…' : 'Add Product'}
          </button>
        </div>
        <div className="bg-white rounded-lg border-2 border-gray-200 p-6 shadow-lg">
          <div className="font-semibold text-xl text-gray-800 mb-6">All Products ({items.length})</div>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📦</div>
                <p className="text-gray-600 text-lg font-medium">No products found</p>
                <p className="text-gray-500">Add your first product using the form on the left!</p>
              </div>
            ) : (
              items.map(p => (
                <div key={p.id} className="p-4 border-2 border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-semibold text-lg text-gray-900">{p.name}</div>
                      <div className="text-sm font-medium text-gray-600 mb-1">SKU: {p.sku}</div>
                      <div className="text-sm text-gray-700">
                        Qty: <span className={`font-semibold ${p.quantity <= 5 ? 'text-red-700 bg-red-100 px-2 py-1 rounded' : 'text-green-700'}`}>{p.quantity}</span> · 
                        Price: <span className="font-semibold text-green-700">${Number(p.unit_price).toFixed(2)}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => deleteProduct(p.id)} 
                      className="text-red-700 hover:text-red-900 text-sm font-medium px-3 py-2 rounded-lg hover:bg-red-100 border border-red-300 hover:border-red-400 transition-all"
                    >
                      Delete
                    </button>
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



