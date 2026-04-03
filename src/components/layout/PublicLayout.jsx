import { Outlet, Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { ShoppingCart, Zap } from 'lucide-react';
import CartDrawer from '../storefront/CartDrawer';

const PublicLayout = ({ businessName = 'Vexora Store' }) => {
  const { totalItems, setIsOpen } = useCart();

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      {/* Storefront Navbar */}
      <header className="glass sticky top-0 z-30 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg">{businessName}</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link to="/" className="btn-ghost text-sm">Home</Link>
            <Link to="/shop" className="btn-ghost text-sm">Shop</Link>
            <button
              onClick={() => setIsOpen(true)}
              className="relative p-2.5 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </button>
            <Link to="/login" className="btn-primary text-sm !py-2 !px-4">Login</Link>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <CartDrawer />

      {/* Footer */}
      <footer className="bg-surface-900 dark:bg-surface-950 text-surface-400 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white">{businessName}</span>
          </div>
          <p className="text-sm">Powered by Vexora • © {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
