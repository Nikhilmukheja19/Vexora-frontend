import { useState, useEffect } from 'react';
import api from '../../services/api';
import { DollarSign, ShoppingCart, Users, Package, TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#f59e0b', '#10b981', '#ef4444'];

const Overview = () => {
  const [stats, setStats] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [latestOrders, setLatestOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/business/dashboard');
        setStats(res.data.data.stats);
        setSalesData(res.data.data.salesData);
        setLatestOrders(res.data.data.latestOrders);
      } catch (err) {
        // Use demo data if API fails
        setStats({
          revenue: 245890, totalOrders: 1234, totalCustomers: 856, totalProducts: 142,
          revenueChange: 12.5, orderChange: 8.2, totalTickets: 23,
        });
        setSalesData([
          { _id: 'Mon', revenue: 4500, orders: 12 },
          { _id: 'Tue', revenue: 6200, orders: 18 },
          { _id: 'Wed', revenue: 5100, orders: 15 },
          { _id: 'Thu', revenue: 8300, orders: 24 },
          { _id: 'Fri', revenue: 7100, orders: 20 },
          { _id: 'Sat', revenue: 9500, orders: 28 },
          { _id: 'Sun', revenue: 8800, orders: 25 },
        ]);
        setLatestOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const statCards = [
    { label: 'Total Revenue', value: `₹${(stats?.revenue || 0).toLocaleString()}`, change: stats?.revenueChange || 0, icon: DollarSign, color: 'from-emerald-500 to-teal-500', bgColor: 'bg-emerald-50 dark:bg-emerald-950/30' },
    { label: 'Orders', value: stats?.totalOrders || 0, change: stats?.orderChange || 0, icon: ShoppingCart, color: 'from-blue-500 to-indigo-500', bgColor: 'bg-blue-50 dark:bg-blue-950/30' },
    { label: 'Customers', value: stats?.totalCustomers || 0, change: 15.3, icon: Users, color: 'from-purple-500 to-pink-500', bgColor: 'bg-purple-50 dark:bg-purple-950/30' },
    { label: 'Products', value: stats?.totalProducts || 0, change: 3.1, icon: Package, color: 'from-amber-500 to-orange-500', bgColor: 'bg-amber-50 dark:bg-amber-950/30' },
  ];

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-32 rounded-2xl bg-surface-200 dark:bg-surface-800" />)}
        </div>
        <div className="h-80 rounded-2xl bg-surface-200 dark:bg-surface-800" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="text-surface-500 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          const isPositive = stat.change >= 0;
          return (
            <div key={i} className="stat-card animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-surface-500 font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <div className={`flex items-center gap-1 mt-2 text-xs font-semibold ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                    {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {Math.abs(stat.change)}% vs last month
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 glass-card p-6">
          <h3 className="font-bold text-lg mb-4">Revenue Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="_id" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: '#1e293b',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#f1f5f9',
                  fontSize: '12px',
                }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Orders Chart */}
        <div className="glass-card p-6">
          <h3 className="font-bold text-lg mb-4">Orders This Week</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="_id" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: '#1e293b',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#f1f5f9',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="orders" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-surface-200 dark:border-surface-700">
          <h3 className="font-bold text-lg">Recent Orders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="table-header">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-surface-500 uppercase">Order</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-surface-500 uppercase">Customer</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-surface-500 uppercase">Total</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-surface-500 uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-surface-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody>
              {latestOrders.length > 0 ? latestOrders.map((order) => (
                <tr key={order._id} className="table-row">
                  <td className="px-6 py-4 font-mono text-sm font-medium">{order.orderNumber}</td>
                  <td className="px-6 py-4 text-sm">{order.customer?.name}</td>
                  <td className="px-6 py-4 text-sm font-semibold">₹{order.total?.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`badge ${order.status === 'delivered' ? 'badge-success' : order.status === 'pending' ? 'badge-warning' : 'badge-info'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-surface-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-surface-400">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-surface-300" />
                    <p className="font-medium">No orders yet</p>
                    <p className="text-sm mt-1">Orders will appear here once customers start purchasing.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Overview;
