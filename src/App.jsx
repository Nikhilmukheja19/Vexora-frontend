import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";
import PublicLayout from "./components/layout/PublicLayout";
import { useAuth } from "./contexts/AuthContext";

// Lazy-loaded pages
const Landing = lazy(() => import("./pages/Landing"));
const Login = lazy(() => import("./pages/auth/Login"));
const Signup = lazy(() => import("./pages/auth/Signup"));

// Dashboard pages
const Overview = lazy(() => import("./pages/dashboard/Overview"));
const Products = lazy(() => import("./pages/dashboard/Products"));
const Orders = lazy(() => import("./pages/dashboard/Orders"));
const Customers = lazy(() => import("./pages/dashboard/Customers"));
const Tickets = lazy(() => import("./pages/dashboard/Tickets"));
const Analytics = lazy(() => import("./pages/dashboard/Analytics"));
const Chats = lazy(() => import("./pages/dashboard/Chats"));
const Settings = lazy(() => import("./pages/dashboard/Settings"));

// Storefront pages
const StorefrontHome = lazy(() => import("./pages/storefront/Home"));
const Shop = lazy(() => import("./pages/storefront/Shop"));
const ProductDetail = lazy(() => import("./pages/storefront/ProductDetail"));
const Checkout = lazy(() => import("./pages/storefront/Checkout"));
const OrderSuccess = lazy(() => import("./pages/storefront/OrderSuccess"));
const OrderHistory = lazy(() => import("./pages/storefront/OrderHistory"));
const StoreAuth = lazy(() => import("./pages/storefront/Auth"));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
      <p className="text-surface-400 text-sm">Loading...</p>
    </div>
  </div>
);

const App = () => {
  const { user } = useAuth();

  return (
    <CartProvider>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public landing */}
          <Route path="/" element={<Landing />} />

          {/* Auth */}
          <Route
            path="/login"
            element={
              user ? (
                <Navigate
                  to={user.role === "admin" ? "/dashboard" : "/"}
                  replace
                />
              ) : (
                <Login />
              )
            }
          />
          <Route
            path="/signup"
            element={
              user ? (
                <Navigate
                  to={user.role === "admin" ? "/dashboard" : "/"}
                  replace
                />
              ) : (
                <Signup />
              )
            }
          />

          {/* Storefront (public) */}
          <Route path="/store/:slug" element={<PublicLayout />}>
            <Route index element={<StorefrontHome />} />
            <Route path="shop" element={<Shop />} />
            <Route path="product/:id" element={<ProductDetail />} />
            <Route path="login" element={<StoreAuth />} />

            {/* Customer routes (nested for context) */}
            <Route
              path="checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="order-success"
              element={
                <ProtectedRoute>
                  <OrderSuccess />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Global Customer routes */}
          <Route
            path="/my-orders"
            element={
              <ProtectedRoute>
                <OrderHistory />
              </ProtectedRoute>
            }
          />

          {/* Dashboard (admin only) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requireAdmin>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Overview />} />
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<Orders />} />
            <Route path="customers" element={<Customers />} />
            <Route path="tickets" element={<Tickets />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="chats" element={<Chats />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Catch-all */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center text-center px-6">
                <div>
                  <h1 className="text-8xl font-extrabold gradient-text mb-4">
                    404
                  </h1>
                  <p className="text-2xl font-bold mb-2">Page Not Found</p>
                  <span className="text-xs text-surface-400 ml-2">
                    Vexora — 404
                  </span>
                  <p className="text-surface-500 mb-8">
                    The page youre looking for doesnt exist.
                  </p>
                  <a href="/" className="btn-primary">
                    Go Home
                  </a>
                </div>
              </div>
            }
          />
        </Routes>
      </Suspense>
    </CartProvider>
  );
};

export default App;

//contra  , peopleperhour  , toptal
