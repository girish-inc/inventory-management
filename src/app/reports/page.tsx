"use client";
import { useEffect, useState } from 'react';

type Product = {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  unit_price: number;
};

type Supplier = {
  id: string;
  name: string;
  contact_email?: string | null;
  phone?: string | null;
};

type ReportData = {
  lowStock: Product[];
  inventoryValue: { total: number };
  productsBySupplier: { [key: string]: Product[] };
};

export default function ReportsPage() {
  const [data, setData] = useState<ReportData>({
    lowStock: [],
    inventoryValue: { total: 0 },
    productsBySupplier: {}
  });
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const [lowStockRes, valueRes, suppliersRes] = await Promise.all([
        fetch('/api/reports?type=low-stock&threshold=5'),
        fetch('/api/reports?type=inventory-value'),
        fetch('/api/suppliers')
      ]);

      const lowStock = await lowStockRes.json();
      const inventoryValue = await valueRes.json();
      const suppliers = await suppliersRes.json();

      setData({ lowStock, inventoryValue, productsBySupplier: {} });
      setSuppliers(suppliers);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductsBySupplier = async (supplierId: string) => {
    if (!supplierId) return;
    try {
      const res = await fetch(`/api/reports?type=products-by-supplier&supplierId=${supplierId}`);
      const products = await res.json();
      setData(prev => ({
        ...prev,
        productsBySupplier: { ...prev.productsBySupplier, [supplierId]: products }
      }));
    } catch (error) {
      console.error('Failed to fetch products by supplier:', error);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    if (selectedSupplier) {
      fetchProductsBySupplier(selectedSupplier);
    }
  }, [selectedSupplier]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        <button
          onClick={fetchReports}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 shadow-md hover:shadow-lg transition-all"
        >
          {loading ? 'Refreshing...' : '🔄 Refresh Reports'}
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white rounded-lg border-2 border-gray-200 p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="text-2xl">⚠️</div>
            <h2 className="text-xl font-bold text-gray-800">Low Stock Alert</h2>
          </div>
          <div className="text-sm font-medium text-gray-600 mb-4 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            Products with quantity ≤ 5 units
          </div>
          {data.lowStock.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-green-500 text-4xl mb-2">✅</div>
              <p className="text-gray-600 font-medium">All products are well stocked!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.lowStock.map(product => (
                <div key={product.id} className="flex justify-between items-center p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                  <div>
                    <div className="font-semibold text-gray-900">{product.name}</div>
                    <div className="text-sm text-gray-600">SKU: {product.sku}</div>
                  </div>
                  <div className="text-red-700 font-bold text-lg bg-red-100 px-3 py-1 rounded-full">
                    {product.quantity} units
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg border-2 border-gray-200 p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="text-2xl">💰</div>
            <h2 className="text-xl font-bold text-gray-800">Total Inventory Value</h2>
          </div>
          <div className="text-5xl font-bold text-green-700 mb-4">
            ${Number(data.inventoryValue.total).toFixed(2)}
          </div>
          <div className="text-sm font-medium text-gray-600 bg-green-50 p-3 rounded-lg border border-green-200">
            Current value of all products in stock
          </div>
        </div>

        <div className="bg-white rounded-lg border-2 border-gray-200 p-6 shadow-lg md:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="text-2xl">🏢</div>
            <h2 className="text-xl font-bold text-gray-800">Products by Supplier</h2>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Supplier</label>
            <select
              value={selectedSupplier}
              onChange={(e) => setSelectedSupplier(e.target.value)}
              className="border-2 border-gray-300 rounded-lg px-4 py-3 w-full max-w-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            >
              <option value="">Choose a supplier to view their products</option>
              {suppliers.map(supplier => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>
          {selectedSupplier && (
            <div>
              {data.productsBySupplier[selectedSupplier]?.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">📦</div>
                  <p className="text-gray-600 text-lg font-medium">No products found for this supplier</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {data.productsBySupplier[selectedSupplier]?.map(product => (
                    <div key={product.id} className="p-4 border-2 border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all">
                      <div className="font-semibold text-lg text-gray-900 mb-2">{product.name}</div>
                      <div className="text-sm text-gray-600 mb-1">SKU: {product.sku}</div>
                      <div className="text-sm text-gray-700 mb-1">
                        Qty: <span className={`font-semibold ${product.quantity <= 5 ? 'text-red-700' : 'text-green-700'}`}>{product.quantity}</span>
                      </div>
                      <div className="text-sm font-semibold text-green-700">
                        Price: ${Number(product.unit_price).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
