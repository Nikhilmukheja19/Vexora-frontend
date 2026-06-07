import { useState, useEffect } from "react";
import { Outlet, Link, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import {
  StoreThemeProvider,
  useStoreTheme,
} from "../../contexts/StoreThemeContext";
import { ShoppingCart, Zap, User, LogOut, Menu, X } from "lucide-react";
import api from "../../services/api";
import CartDrawer from "../storefront/CartDrawer";

const StorefrontShell = ({ business, businessName, slug }) => {
  const { totalItems, setIsOpen } = useCart();
  const { isCustomerAuthenticated, customerLogout } = useAuth();
  const { theme } = useStoreTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <header className="store-header glass sticky top-0 z-30 px-4 sm:px-6 py-2.5 sm:py-3">
        <div className="store-header-inner max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-4">
          <Link
            to={`/store/${slug}`}
            className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
            </div>
            <span className="font-bold text-sm xs:text-base sm:text-lg truncate">
              {businessName}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="store-header-nav hidden lg:flex items-center gap-6">
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
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setIsOpen(true)}
              className="relative p-2 sm:p-2.5 rounded-lg sm:rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors touch-target"
              title="Cart"
            >
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 store-bg-primary text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </button>

            {isCustomerAuthenticated ? (
              <div className="flex items-center gap-1 sm:gap-2">
                <Link
                  to={`/store/${slug}/my-orders`}
                  className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors touch-target hidden xs:block"
                  title="My Orders"
                >
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
                <button
                  onClick={customerLogout}
                  className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20 text-surface-400 hover:text-red-500 transition-colors touch-target hidden xs:flex"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            ) : (
              <Link
                to={`/store/${slug}/customerauth/login`}
                className="btn-primary text-xs xs:text-sm !py-1.5 sm:!py-2 !px-3 sm:!px-4 hidden xs:inline-flex"
              >
                Login
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 sm:p-2.5 rounded-lg sm:rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors touch-target"
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-surface-200 dark:border-surface-700 space-y-2">
            <Link
              to={`/store/${slug}`}
              className="block px-3 sm:px-4 py-2 sm:py-3 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 text-sm font-medium store-text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to={`/store/${slug}/shop`}
              className="block px-3 sm:px-4 py-2 sm:py-3 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 text-sm font-medium text-surface-600 dark:text-surface-300 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Shop
            </Link>
            {isCustomerAuthenticated ? (
              <>
                <Link
                  to={`/store/${slug}/my-orders`}
                  className="block px-3 sm:px-4 py-2 sm:py-3 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 text-sm font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-2" /> My
                  Orders
                </Link>
                <button
                  onClick={() => {
                    customerLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 sm:px-4 py-2 sm:py-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 text-sm font-medium text-red-500 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-2" />{" "}
                  Logout
                </button>
              </>
            ) : (
              <Link
                to={`/store/${slug}/customerauth/login`}
                className="block w-full px-3 sm:px-4 py-2 sm:py-3 text-center rounded-lg btn-primary text-xs xs:text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        )}
      </header>

      <main>
        <Outlet context={{ business }} />
      </main>

      <CartDrawer />

      <footer
        className={`store-footer py-12 ${theme.footerStyle === "minimal" ? "!py-6" : ""}`}
      >
        <div className="max-w-7xl mx-auto px-6 text-center">
          {theme.footerStyle !== "minimal" && (
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white">{businessName}</span>
            </div>
          )}
          <p
            className={`text-sm ${theme.footerStyle === "minimal" ? "text-surface-500" : "text-surface-400"}`}
          >
            {theme.footerStyle === "minimal"
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
      <StorefrontShell
        business={business}
        businessName={businessName}
        slug={slug}
      />
    </StoreThemeProvider>
  );
};

export default PublicLayout;
