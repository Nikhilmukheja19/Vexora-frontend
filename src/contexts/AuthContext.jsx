import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [customerToken, setCustomerToken] = useState(() => localStorage.getItem('customerToken'));

  const fetchProfile = useCallback(async () => {
    try {
      const res = await api.get('/auth/profile');
      setUser(res.data.data.user);
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCustomerProfile = useCallback(async () => {
    try {
      const res = await api.get('/auth/profile', {
        headers: { Authorization: `Bearer ${localStorage.getItem('customerToken')}` }
      });
      setCustomer(res.data.data.user);
    } catch {
      customerLogout();
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      if (token) await fetchProfile();
      if (customerToken) await fetchCustomerProfile();
      setLoading(false);
    };
    initAuth();
  }, [token, customerToken, fetchProfile, fetchCustomerProfile]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: newToken, user: userData } = res.data.data;
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
    toast.success('Welcome back!');
    return userData;
  };

  const register = async (data) => {
    const res = await api.post('/auth/register', data);
    const { token: newToken, user: userData } = res.data.data;
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
    toast.success('Account created successfully!');
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const customerLogin = async (email, password, slug) => {
    const res = await api.post('/customer-auth/login', { email, password, slug });
    const { token: newToken, user: userData } = res.data.data;
    localStorage.setItem('customerToken', newToken);
    setCustomerToken(newToken);
    setCustomer(userData);
    toast.success('Welcome to the store!');
    return userData;
  };

  const customerRegister = async (data) => {
    const res = await api.post('/customer-auth/register', data);
    const { token: newToken, user: userData } = res.data.data;
    localStorage.setItem('customerToken', newToken);
    setCustomerToken(newToken);
    setCustomer(userData);
    toast.success('Registration successful!');
    return userData;
  };

  const customerLogout = () => {
    localStorage.removeItem('customerToken');
    setCustomerToken(null);
    setCustomer(null);
  };

  const updateUser = (data) => {
    setUser(prev => ({ ...prev, ...data }));
  };

  return (
    <AuthContext.Provider value={{
      user,
      customer,
      token,
      customerToken,
      loading,
      login,
      register,
      logout,
      customerLogin,
      customerRegister,
      customerLogout,
      updateUser,
      isAuthenticated: !!user,
      isCustomerAuthenticated: !!customer,
      isAdmin: user?.role === 'admin',
    }}>
      {children}
    </AuthContext.Provider>
  );
};
