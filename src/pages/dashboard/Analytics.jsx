import { useState, useEffect } from 'react';
import api from '../../services/api';
import { BarChart3 } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#f59e0b', '#10b981', '#ef4444'];

const Analytics = () => {
  const [data, setData] = useState({ monthlyRevenue: [], statusDistribution: [], topProducts: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/orders/analytics');
        setData(res.data.data);
      } catch {
        // Demo data
        setData({
          monthlyRevenue: [
            { _id: '2025-07', revenue: 12000, orders: 45 }, { _id: '2025-08', revenue: 18500, orders: 62 },
            { _id: '2025-09', revenue: 15000, orders: 53 }, { _id: '2025-10', revenue: 22000, orders: 78 },
            { _id: '2025-11', revenue: 28000, orders: 92 }, { _id: '2025-12', revenue: 35000, orders: 110 },
          ],
          statusDistribution: [
            { _id: 'pending', count: 15 }, { _id: 'confirmed', count: 25 },
            { _id: 'shipped', count: 30 }, { _id: 'delivered', count: 80 }, { _id: 'cancelled', count: 5 },
          ],
          topProducts: [
            { _id: 'Premium Widget', totalSold: 234, revenue: 45000 },
            { _id: 'Basic Package', totalSold: 189, revenue: 32000 },
            { _id: 'Pro Bundle', totalSold: 156, revenue: 28000 },
            { _id: 'Starter Kit', totalSold: 120, revenue: 18000 },
            { _id: 'Enterprise Plan', totalSold: 89, revenue: 55000 },
          ],
        });
      } finally { setLoading(false); }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div className="animate-pulse space-y-6">{[1,2].map(i => <div key={i} className="h-80 rounded-2xl bg-surface-200 dark:bg-surface-800" />)}</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-title">Analytics</h1>
        <p className="text-surface-500 mt-1">Track your business performance</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly Revenue */}
        <div className="glass-card p-6">
          <h3 className="font-bold text-lg mb-4">Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data.monthlyRevenue}>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="_id" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '12px', color: '#f1f5f9' }} />
              <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fill="url(#grad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Order Status */}
        <div className="glass-card p-6">
          <h3 className="font-bold text-lg mb-4">Order Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={data.statusDistribution} dataKey="count" nameKey="_id" cx="50%" cy="50%" outerRadius={100} label={({ _id, count }) => `${_id}: ${count}`}>
                {data.statusDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '12px', color: '#f1f5f9' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products */}
        <div className="lg:col-span-2 glass-card p-6">
          <h3 className="font-bold text-lg mb-4">Top Products by Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.topProducts} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" stroke="#94a3b8" fontSize={12} />
              <YAxis dataKey="_id" type="category" stroke="#94a3b8" fontSize={12} width={120} />
              <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '12px', color: '#f1f5f9' }} />
              <Bar dataKey="revenue" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
