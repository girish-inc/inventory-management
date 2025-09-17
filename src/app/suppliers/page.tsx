"use client";
import { useEffect, useState } from 'react';

type Supplier = { id: string; name: string; contact_email?: string | null; phone?: string | null };

export default function SuppliersPage() {
  const [items, setItems] = useState<Supplier[]>([]);
  const [form, setForm] = useState({ name: '', contactEmail: '', phone: '' });

  async function fetchItems() {
    const res = await fetch('/api/suppliers');
    setItems(await res.json());
  }

  useEffect(() => { fetchItems(); }, []);

  async function createSupplier() {
    await fetch('/api/suppliers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setForm({ name: '', contactEmail: '', phone: '' });
    await fetchItems();
  }

  async function removeSupplier(id: string) {
    await fetch(`/api/suppliers/${id}`, { method: 'DELETE' });
    await fetchItems();
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Suppliers</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white rounded-lg border-2 border-gray-200 p-6 space-y-6 shadow-lg">
          <div className="font-semibold text-xl text-gray-800">Add New Supplier</div>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <input 
                value={form.name} 
                onChange={e=>setForm({ ...form, name: e.target.value })} 
                placeholder="Enter company name" 
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
              <input 
                value={form.contactEmail} 
                onChange={e=>setForm({ ...form, contactEmail: e.target.value })} 
                placeholder="Enter email address" 
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input 
                value={form.phone} 
                onChange={e=>setForm({ ...form, phone: e.target.value })} 
                placeholder="Enter phone number" 
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900" 
              />
            </div>
          </div>
          <button 
            onClick={createSupplier} 
            className="w-full px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-md hover:shadow-lg transition-all"
          >
            Add Supplier
          </button>
        </div>
        <div className="bg-white rounded-lg border-2 border-gray-200 p-6 shadow-lg">
          <div className="font-semibold text-xl text-gray-800 mb-6">All Suppliers ({items.length})</div>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🏢</div>
                <p className="text-gray-600 text-lg font-medium">No suppliers found</p>
                <p className="text-gray-500">Add your first supplier using the form on the left!</p>
              </div>
            ) : (
              items.map(s => (
                <div key={s.id} className="p-4 border-2 border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-semibold text-lg text-gray-900">{s.name}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">📧</span>
                          <span>{s.contact_email || 'No email'}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-gray-500">📞</span>
                          <span>{s.phone || 'No phone'}</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeSupplier(s.id)} 
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



