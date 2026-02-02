import { AlertCircle, DollarSign, Layers, Package, ShoppingCart, TicketPercent, TrendingUp, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    users: 0,
    coupons: 0,
    carts: 0,
  });
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const [analyticsRes, productsRes, couponsRes, cartsRes] = await Promise.all([
          fetch('/api/admin/analytics'),
          fetch('/api/products'),
          fetch('/api/coupons'),
          fetch('/api/cart'),
        ]);

        if (analyticsRes.ok) {
          const a = await analyticsRes.json();
          const coupons = couponsRes.ok ? await couponsRes.json() : [];
          const carts = cartsRes.ok ? await cartsRes.json() : [];
          setAnalytics(a);
          setStats({
            products: a.products ?? 0,
            orders: a.orders ?? 0,
            users: a.users ?? 0,
            coupons: Array.isArray(coupons) ? coupons.length : 0,
            carts: Array.isArray(carts) ? carts.length : 0,
          });
        } else {
          const [products, orders, users, coupons, carts] = await Promise.all([
            productsRes.ok ? productsRes.json() : [],
            fetch('/api/orders').then((r) => (r.ok ? r.json() : [])),
            fetch('/api/users').then((r) => (r.ok ? r.json() : [])),
            couponsRes.ok ? couponsRes.json() : [],
            cartsRes.ok ? cartsRes.json() : [],
          ]);
          setStats({
            products: Array.isArray(products) ? products.length : 0,
            orders: Array.isArray(orders) ? orders.length : 0,
            users: Array.isArray(users) ? users.length : 0,
            coupons: Array.isArray(coupons) ? coupons.length : 0,
            carts: Array.isArray(carts) ? carts.length : 0,
          });
        }
        setError('');
      } catch (e) {
        console.error('Failed to load admin stats', e);
        setError('Some stats could not be loaded. You can still use all admin pages.');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/30 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-light tracking-wide text-gray-900">
            Dangly Dreams Admin
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            Manage the products shown in your shop, view orders, users, and more.
          </p>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <AlertCircle className="w-4 h-4 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
          <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Products</span>
              <Package className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-2xl font-semibold text-gray-900">
              {loading ? '—' : stats.products}
            </p>
            <p className="text-xs text-gray-500 mt-1">Shown in the shop</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Orders</span>
              <ShoppingCart className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-2xl font-semibold text-gray-900">
              {loading ? '—' : stats.orders}
            </p>
            <p className="text-xs text-gray-500 mt-1">Total orders</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Users</span>
              <Users className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-2xl font-semibold text-gray-900">
              {loading ? '—' : stats.users}
            </p>
            <p className="text-xs text-gray-500 mt-1">Registered customers</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Coupons</span>
              <TicketPercent className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-2xl font-semibold text-gray-900">
              {loading ? '—' : stats.coupons}
            </p>
            <p className="text-xs text-gray-500 mt-1">Active discount codes</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Carts</span>
              <Layers className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-2xl font-semibold text-gray-900">
              {loading ? '—' : stats.carts}
            </p>
            <p className="text-xs text-gray-500 mt-1">Saved customer carts</p>
          </div>
        </div>

        {/* Revenue & Sales Analytics */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Revenue</span>
                <DollarSign className="w-4 h-4 text-green-500" />
              </div>
              <p className="text-xl font-semibold text-gray-900">€{analytics.totalRevenue?.toLocaleString() ?? '0'}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Monthly Orders</span>
                <TrendingUp className="w-4 h-4 text-blue-500" />
              </div>
              <p className="text-xl font-semibold text-gray-900">{analytics.monthlyOrders ?? 0}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Monthly Revenue</span>
                <DollarSign className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-xl font-semibold text-gray-900">€{analytics.monthlyRevenue?.toLocaleString() ?? '0'}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Yearly Revenue</span>
                <TrendingUp className="w-4 h-4 text-purple-500" />
              </div>
              <p className="text-xl font-semibold text-gray-900">€{analytics.yearlyRevenue?.toLocaleString() ?? '0'}</p>
            </div>
          </div>
        )}

        {/* Recent Orders */}
        {analytics?.recentOrders?.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-10">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Orders</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-100">
                    <th className="py-2">Order ID</th>
                    <th className="py-2">User</th>
                    <th className="py-2">Total</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.recentOrders.slice(0, 5).map((o) => (
                    <tr key={o.id} className="border-b border-gray-50">
                      <td className="py-3 font-mono text-xs">{o.id?.slice(-8)}</td>
                      <td className="py-3">{o.userId}</td>
                      <td className="py-3">€{o.totalAmount?.toLocaleString()}</td>
                      <td className="py-3"><span className="px-2 py-1 rounded text-xs bg-amber-50 text-amber-700">{o.orderStatus || 'PENDING'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Management sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Catalog</h2>
            <p className="text-sm text-gray-600 mb-4">
              Control which products are visible in your Dangly Dreams shop and keep prices up to date.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                to="/admin/products"
                className="inline-flex items-center justify-center bg-amber-500 hover:bg-amber-600 text-white py-2.5 px-4 rounded-xl text-sm font-medium tracking-wide transition-colors"
              >
                Manage Products
              </Link>
              <Link
                to="/admin/categories"
                className="inline-flex items-center justify-center border border-amber-200 text-amber-700 hover:bg-amber-50 py-2.5 px-4 rounded-xl text-sm font-medium tracking-wide transition-colors"
              >
                Manage Categories
              </Link>
              <Link
                to="/admin/coupons"
                className="inline-flex items-center justify-center border border-amber-200 text-amber-700 hover:bg-amber-50 py-2.5 px-4 rounded-xl text-sm font-medium tracking-wide transition-colors"
              >
                Manage Coupons
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Customers & Orders</h2>
            <p className="text-sm text-gray-600 mb-4">
              Review customer activity, handle open orders, and inspect saved carts.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                to="/admin/orders"
                className="inline-flex items-center justify-center bg-amber-500 hover:bg-amber-600 text-white py-2.5 px-4 rounded-xl text-sm font-medium tracking-wide transition-colors"
              >
                Manage Orders
              </Link>
              <Link
                to="/admin/users"
                className="inline-flex items-center justify-center border border-amber-200 text-amber-700 hover:bg-amber-50 py-2.5 px-4 rounded-xl text-sm font-medium tracking-wide transition-colors"
              >
                Manage Users
              </Link>
              <Link
                to="/admin/carts"
                className="inline-flex items-center justify-center border border-gray-200 text-gray-800 hover:bg-gray-50 py-2.5 px-4 rounded-xl text-sm font-medium tracking-wide transition-colors"
              >
                View Carts
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;