import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import api from '../../services/api';
import { Bell, Sun, Moon, Search, User, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get('/notifications?limit=5');
        setNotifications(res.data.data.notifications);
        setUnreadCount(res.data.data.unreadCount);
      } catch {}
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const markAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch {}
  };

  return (
    <header className="glass sticky top-0 z-30 px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Search */}
        <div className="relative hidden md:block w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-surface-100 dark:bg-surface-800 border-none focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-surface-500" />}
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
            >
              <Bell className="w-5 h-5 text-surface-500" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 glass-card p-2 animate-scale-in">
                <div className="flex items-center justify-between px-3 py-2">
                  <h3 className="font-semibold text-sm">Notifications</h3>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="text-xs text-primary-500 hover:text-primary-600">
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-center py-6 text-surface-400 text-sm">No notifications</p>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif._id}
                        className={`px-3 py-2 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800 cursor-pointer transition-colors ${!notif.read ? 'bg-primary-50/50 dark:bg-primary-950/20' : ''}`}
                      >
                        <p className="text-sm font-medium">{notif.title}</p>
                        <p className="text-xs text-surface-500 mt-0.5">{notif.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <span className="text-white font-semibold text-sm">{user?.name?.[0]?.toUpperCase()}</span>
              </div>
              <span className="hidden sm:block text-sm font-medium">{user?.name}</span>
              <ChevronDown className="w-4 h-4 text-surface-400" />
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-48 glass-card p-2 animate-scale-in">
                <div className="px-3 py-2 border-b border-surface-200 dark:border-surface-700">
                  <p className="font-medium text-sm">{user?.name}</p>
                  <p className="text-xs text-surface-500">{user?.role}</p>
                </div>
                <button
                  onClick={logout}
                  className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
