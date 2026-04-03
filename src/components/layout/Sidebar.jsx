import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import {
  LayoutDashboard, Package, ShoppingCart, Users, TicketCheck,
  Bell, Settings, LogOut, ChevronLeft, ChevronRight, Zap,
  BarChart3, MessageSquare, Store
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { path: '/dashboard/products', label: 'Products', icon: Package },
  { path: '/dashboard/orders', label: 'Orders', icon: ShoppingCart },
  { path: '/dashboard/customers', label: 'Customers', icon: Users },
  { path: '/dashboard/tickets', label: 'Tickets', icon: TicketCheck },
  { path: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/dashboard/chats', label: 'Chats', icon: MessageSquare },
  { path: '/dashboard/settings', label: 'Settings', icon: Settings },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className={`glass-sidebar fixed left-0 top-0 h-screen z-40 flex flex-col transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-surface-200/50 dark:border-surface-700/50">
        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
          <Zap className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="font-bold text-lg gradient-text whitespace-nowrap">Vexora</h1>
            <p className="text-xs text-surface-500 truncate">{user?.email}</p>
          </div>
        )}
      </div>

      {/* Nav Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-link ${isActive ? 'sidebar-link-active' : ''} ${collapsed ? 'justify-center px-2' : ''}`}
              title={collapsed ? item.label : ''}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Store Link */}
      <div className="p-3 border-t border-surface-200/50 dark:border-surface-700/50">
        <Link
          to={`/store/${user?.businessId?.slug || 'my-store'}`}
          target="_blank"
          className={`sidebar-link text-accent-600 dark:text-accent-400 ${collapsed ? 'justify-center px-2' : ''}`}
        >
          <Store className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>View Storefront</span>}
        </Link>
      </div>

      {/* Bottom */}
      <div className="p-3 border-t border-surface-200/50 dark:border-surface-700/50 space-y-1">
        <button
          onClick={handleLogout}
          className={`sidebar-link text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 w-full ${collapsed ? 'justify-center px-2' : ''}`}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 flex items-center justify-center shadow-md hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>
    </aside>
  );
};

export default Sidebar;
