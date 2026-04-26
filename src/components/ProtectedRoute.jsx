import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isCustomerAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  // Detect if we are on a storefront route
  const isStorefront = location.pathname.startsWith('/store/');
  const storeSlug = isStorefront ? location.pathname.split('/')[2] : null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
          <p className="text-surface-500 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (isStorefront) {
    if (!isCustomerAuthenticated) {
      return <Navigate to={`/store/${storeSlug}/customerauth/login`} state={{ from: location }} replace />;
    }
  } else {
    if (!isAuthenticated) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
