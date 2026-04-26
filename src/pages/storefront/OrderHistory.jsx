import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import { Package, Clock } from "lucide-react";

const statusColors = {
  pending: "badge-warning",
  confirmed: "badge-info",
  processing: "badge-info",
  shipped: "badge-info",
  delivered: "badge-success",
  cancelled: "badge-danger",
};

const OrderHistory = () => {
  const { slug } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/orders/my-orders?businessSlug=${slug}`);
        setOrders(res.data.data.orders);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetch();
  }, [slug]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 rounded-2xl bg-surface-200 dark:bg-surface-800 animate-pulse"
            />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Package className="w-16 h-16 mx-auto text-surface-300 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
          <p className="text-surface-500">
            Your order history will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="glass-card p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-mono font-bold text-sm">
                    #{order.orderNumber}
                  </p>
                  <p className="text-surface-500 text-sm mt-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={statusColors[order.status] || "badge-neutral"}
                  >
                    {order.status}
                  </span>
                  <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                    ₹{order.total?.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {order.items?.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 bg-surface-50 dark:bg-surface-800 rounded-xl p-3"
                  >
                    <div className="w-12 h-12 rounded-lg bg-surface-200 dark:bg-surface-700 overflow-hidden flex-shrink-0">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-surface-500">
                        Qty: {item.quantity} · ₹{item.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
