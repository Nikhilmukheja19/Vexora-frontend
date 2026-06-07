import { useState, useEffect } from "react";
import { Outlet, Link, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import { StoreThemeProvider, useStoreTheme } from "../../contexts/StoreThemeContext";
import { ShoppingCart, Zap, User, LogOut } from "lucide-react";
import api from "../../services/api";
import CartDrawer from "../storefront/CartDrawer";

const StorefrontShell = ({ business, businessName, slug }) => {
  const { totalItems, setIsOpen } = useCart();
  const { isCustomerAuthenticated, customerLogout } = useAuth();
  const { theme } = useStoreTheme();

  return (
    <div className="min-h-screen">
      <header className="store-header glass sticky top-0 z-30 px-6 py-3">
        <div className="store-header-inner max-w-7xl mx-auto flex items-center justify-between">
          <Link to={`/store/${slug}`} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg">{businessName}</span>
          </Link>

          <nav className="store-header-nav flex items-center gap-4">
            <Link
              to={`/store/${slug}`}
              className="text-sm font-medium store-text-primary store-nav-link transition-colors"
            >
              Home
            </Link>
            <Link
              to={`/store/${slug}/shop`}
              className="text-sm font-medium text-surface-600 dark:text-surface-300 store-nav-link transition-colors"
            >
              Shop
            </Link>
            <button
              onClick={() => setIsOpen(true)}
              className="relative p-2.5 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 store-bg-primary text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </button>
            {isCustomerAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to={`/store/${slug}/my-orders`}
                  className="p-2.5 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                  title="My Orders"
                >
                  <User className="w-5 h-5" />
                </Link>
                <button
                  onClick={customerLogout}
                  className="p-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20 text-surface-400 hover:text-red-500 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link
                to={`/store/${slug}/customerauth/login`}
                className="btn-primary text-sm !py-2 !px-4"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main>
        <Outlet context={{ business }} />
      </main>

      <CartDrawer />

      <footer className={`store-footer py-12 ${theme.footerStyle === 'minimal' ? '!py-6' : ''}`}>
        <div className="max-w-7xl mx-auto px-6 text-center">
          {theme.footerStyle !== 'minimal' && (
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white">{businessName}</span>
            </div>
          )}
          <p className={`text-sm ${theme.footerStyle === 'minimal' ? 'text-surface-500' : 'text-surface-400'}`}>
            {theme.footerStyle === 'minimal'
              ? `© ${new Date().getFullYear()} ${businessName} • Powered by Vexora`
              : `Powered by Vexora • © ${new Date().getFullYear()}`}
          </p>
        </div>
      </footer>
    </div>
  );
};

const PublicLayout = () => {
  const { slug } = useParams();
  const [business, setBusiness] = useState(null);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const res = await api.get(`/business/public/${slug}`);
        setBusiness(res.data.data.business);
        document.title = `${res.data.data.business.name} | Vexora Store`;
      } catch (err) {
        console.error("Failed to fetch business info", err);
      }
    };
    if (slug) fetchBusiness();
  }, [slug]);

  const businessName = business?.name || "Vexora Store";

  return (
    <StoreThemeProvider business={business}>
      <StorefrontShell business={business} businessName={businessName} slug={slug} />
    </StoreThemeProvider>
  );
};

export default PublicLayout;
