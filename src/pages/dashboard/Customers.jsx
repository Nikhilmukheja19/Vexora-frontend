import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Users, Search, Mail, ShoppingCart } from 'lucide-react';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        // Fetch orders and extract unique customers
        const res = await api.get('/orders');
        const orders = res.data.data.orders;
        const customerMap = new Map();
        orders.forEach(order => {
          if (order.customer) {
            const existing = customerMap.get(order.customer._id) || { ...order.customer, totalOrders: 0, totalSpent: 0 };
            existing.totalOrders += 1;
            existing.totalSpent += order.total || 0;
            existing.lastOrder = order.createdAt;
            customerMap.set(order.customer._id, existing);
          }
        });
        setCustomers(Array.from(customerMap.values()));
      } catch { } finally { setLoading(false); }
    };
    fetchCustomers();
  }, []);

  const filtered = customers.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-title">Customers</h1>
        <p className="text-surface-500 mt-1">View and manage your customer base</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customers..." className="input-field !pl-11" />
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="table-header">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-surface-500 uppercase">Customer</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-surface-500 uppercase">Email</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-surface-500 uppercase">Orders</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-surface-500 uppercase">Total Spent</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-surface-500 uppercase">Last Order</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [1,2,3].map(i => <tr key={i} className="table-row"><td colSpan={5} className="px-6 py-4"><div className="h-6 bg-surface-200 dark:bg-surface-700 rounded animate-pulse" /></td></tr>)
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-surface-400">
                  <Users className="w-12 h-12 mx-auto mb-3 text-surface-300" />
                  <p className="font-medium">No customers yet</p>
                </td></tr>
              ) : filtered.map((customer, i) => (
                <tr key={i} className="table-row">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center text-white font-semibold text-sm">
                        {customer.name?.[0]?.toUpperCase()}
                      </div>
                      <span className="font-medium">{customer.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-surface-500">{customer.email}</td>
                  <td className="px-6 py-4 text-sm font-medium">{customer.totalOrders}</td>
                  <td className="px-6 py-4 text-sm font-bold text-primary-600 dark:text-primary-400">₹{customer.totalSpent.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-surface-500">{customer.lastOrder ? new Date(customer.lastOrder).toLocaleDateString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Customers;
