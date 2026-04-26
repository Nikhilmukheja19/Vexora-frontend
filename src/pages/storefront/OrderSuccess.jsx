import { useLocation, Link } from "react-router-dom";
import { CheckCircle, Package, ArrowRight } from "lucide-react";

const OrderSuccess = () => {
  const { state } = useLocation();
  const order = state?.order;

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="glass-card p-12 max-w-md w-full text-center animate-scale-in">
        <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-emerald-500" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Order Placed! 🎉</h1>
        <p className="text-surface-500 mb-6">
          Thank you for your purchase. Your order has been confirmed.
        </p>
        {order && (
          <div className="bg-surface-50 dark:bg-surface-800 rounded-xl p-4 mb-6 text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-surface-500">Order #</span>
              <span className="font-mono font-bold">{order.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-surface-500">Total</span>
              <span className="font-bold text-primary-600">
                ₹{order.total?.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-surface-500">Payment</span>
              <span className="capitalize badge-warning">
                {order.paymentMethod}
              </span>
            </div>
          </div>
        )}
        <div className="flex flex-col gap-3">
          <Link
            to="/my-orders"
            className="btn-primary flex items-center justify-center gap-2"
          >
            <Package className="w-4 h-4" /> Track My Orders
          </Link>
          <Link to="/store/:slug" className="btn-secondary">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
