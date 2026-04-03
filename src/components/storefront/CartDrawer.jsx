import { useCart } from '../../contexts/CartContext';
import { X, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const CartDrawer = () => {
  const { slug } = useParams();
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={() => setIsOpen(false)} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-surface-900 z-50 shadow-2xl animate-slide-in-right flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-surface-200 dark:border-surface-700">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary-500" />
            <h2 className="font-bold text-lg">Shopping Cart</h2>
            <span className="badge-info">{items.length} items</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-surface-400">
              <ShoppingBag className="w-16 h-16 mb-4" />
              <p className="font-medium text-lg">Cart is empty</p>
              <p className="text-sm mt-1">Add some products to get started</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.product._id} className="flex gap-4 p-3 rounded-xl bg-surface-50 dark:bg-surface-800">
                <div className="w-20 h-20 rounded-lg bg-surface-200 dark:bg-surface-700 overflow-hidden flex-shrink-0">
                  {item.product.images?.[0] ? (
                    <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-surface-400">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{item.product.name}</h4>
                  <p className="text-primary-600 dark:text-primary-400 font-semibold mt-1">₹{item.product.price}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                      className="w-7 h-7 rounded-lg bg-surface-200 dark:bg-surface-700 flex items-center justify-center hover:bg-surface-300 dark:hover:bg-surface-600"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-medium text-sm w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                      className="w-7 h-7 rounded-lg bg-surface-200 dark:bg-surface-700 flex items-center justify-center hover:bg-surface-300 dark:hover:bg-surface-600"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <button onClick={() => removeItem(item.product._id)} className="text-surface-400 hover:text-red-500 self-start">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-surface-200 dark:border-surface-700 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-surface-500">Subtotal</span>
              <span className="text-xl font-bold">₹{totalPrice.toFixed(2)}</span>
            </div>
            <button
              onClick={() => { setIsOpen(false); navigate(`/store/${slug}/checkout`); }}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              Checkout <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={clearCart} className="btn-ghost w-full text-sm text-red-500">
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
