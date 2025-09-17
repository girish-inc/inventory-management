"use client";
import { useEffect, useState } from 'react';

type DashboardData = {
  productsCount: number;
  lowStockCount: number;
  inventoryValue: number;
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData>({
    productsCount: 0,
    lowStockCount: 0,
    inventoryValue: 0
  });
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsRes, lowStockRes, valueRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/reports?type=low-stock&threshold=5'),
        fetch('/api/reports?type=inventory-value')
      ]);

      const products = await productsRes.json();
      const lowStock = await lowStockRes.json();
      const value = await valueRes.json();

      setData({
        productsCount: products.length,
        lowStockCount: lowStock.length,
        inventoryValue: Number(value.total || 0)
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const seedData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      if (res.ok) {
        await fetchData();
        alert('Sample data seeded successfully!');
      } else {
        alert('Failed to seed data');
      }
    } catch (error) {
      alert('Failed to seed data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-blue-700 tracking-tight">Dashboard</h1>
        <div className="flex gap-3">
          <button
            onClick={fetchData}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
          <button
            onClick={seedData}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Seeding...' : 'Seed Sample Data'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border-2 border-gray-200 p-6 shadow-lg hover:shadow-xl transition-shadow">
          <div className="text-sm font-medium text-gray-700 mb-2">Total Products</div>
          <div className="text-4xl font-bold text-blue-700">{data.productsCount}</div>
        </div>
        <div className="bg-white rounded-lg border-2 border-gray-200 p-6 shadow-lg hover:shadow-xl transition-shadow">
          <div className="text-sm font-medium text-gray-700 mb-2">Low Stock Items</div>
          <div className="text-4xl font-bold text-red-700">{data.lowStockCount}</div>
        </div>
        <div className="bg-white rounded-lg border-2 border-gray-200 p-6 shadow-lg hover:shadow-xl transition-shadow">
          <div className="text-sm font-medium text-gray-700 mb-2">Inventory Value</div>
          <div className="text-4xl font-bold text-green-700">${data.inventoryValue.toFixed(2)}</div>
        </div>
      </div>

      {data.productsCount === 0 && (
        <div className="bg-yellow-100 border-2 border-yellow-300 rounded-lg p-6 shadow-md">
          <div className="flex items-center">
            <div className="text-yellow-600 mr-4 text-2xl">⚠️</div>
            <div>
              <h3 className="text-lg font-semibold text-yellow-900">No data found</h3>
              <p className="text-base text-yellow-800 mt-2">
                Click &quot;Seed Sample Data&quot; to populate the system with sample products, suppliers, and transactions.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



