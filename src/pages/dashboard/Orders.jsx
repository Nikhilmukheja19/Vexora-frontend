import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { ShoppingCart, Eye, ChevronDown } from 'lucide-react';

const statusColors = {
  pending: 'badge-warning', confirmed: 'badge-info', processing: 'badge-info',
  shipped: 'badge-info', delivered: 'badge-success', cancelled: 'badge-danger',
};
const paymentColors = { pending: 'badge-warning', paid: 'badge-success', failed: 'badge-danger', refunded: 'badge-neutral' };

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await api.get(`/orders?status=${filter}`);
      setOrders(res.data.data.orders);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, [filter]);

  const updateStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      toast.success(`Order ${status}`);
      fetchOrders();
      setSelectedOrder(null);
    } catch { toast.error('Failed to update'); }
  };

  const filters = ['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-title">Orders</h1>
        <p className="text-surface-500 mt-1">Manage and track customer orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === f ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25' : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-700'}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="table-header">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-surface-500 uppercase">Order #</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-surface-500 uppercase">Customer</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-surface-500 uppercase">Items</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-surface-500 uppercase">Total</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-surface-500 uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-surface-500 uppercase">Payment</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-surface-500 uppercase">Date</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-surface-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [1,2,3].map(i => (
                  <tr key={i} className="table-row"><td colSpan={8} className="px-6 py-4"><div className="h-6 bg-surface-200 dark:bg-surface-700 rounded animate-pulse" /></td></tr>
                ))
              ) : orders.length === 0 ? (
                <tr><td colSpan={8} className="px-6 py-12 text-center text-surface-400">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-surface-300" />
                  <p className="font-medium">No orders found</p>
                </td></tr>
              ) : orders.map(order => (
                <tr key={order._id} className="table-row">
                  <td className="px-6 py-4 font-mono text-sm font-medium">{order.orderNumber}</td>
                  <td className="px-6 py-4 text-sm">{order.customer?.name || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm">{order.items?.length || 0} items</td>
                  <td className="px-6 py-4 text-sm font-semibold">₹{order.total?.toFixed(2)}</td>
                  <td className="px-6 py-4"><span className={statusColors[order.status] || 'badge-neutral'}>{order.status}</span></td>
                  <td className="px-6 py-4"><span className={paymentColors[order.paymentStatus] || 'badge-neutral'}>{order.paymentStatus}</span></td>
                  <td className="px-6 py-4 text-sm text-surface-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <div className="relative group">
                      <button className="btn-ghost !px-3 !py-1.5 text-xs flex items-center gap-1">
                        Update <ChevronDown className="w-3 h-3" />
                      </button>
                      <div className="absolute right-0 mt-1 w-40 glass-card p-1 hidden group-hover:block z-10">
                        {['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                          <button key={s} onClick={() => updateStatus(order._id, s)}
                            className="w-full text-left px-3 py-1.5 text-sm rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 capitalize">
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;
