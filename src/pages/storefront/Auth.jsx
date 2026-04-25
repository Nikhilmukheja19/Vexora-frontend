import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Zap } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const StoreAuth = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { updateUser } = useAuth(); // We'll manually update the context since it's a different login
  
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const from = location.state?.from?.pathname || `/store/${slug}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = isLogin ? '/customer-auth/login' : '/customer-auth/register';
      const res = await api.post(endpoint, {
        ...formData,
        businessSlug: slug
      });
      
      const { token, user } = res.data.data;
      localStorage.setItem('token', token);
      updateUser(user);
      
      toast.success(isLogin ? 'Welcome back!' : 'Account created successfully!');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="glass-card p-8 animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">
              {isLogin ? 'Sign in to Shop' : 'Create Store Account'}
            </h1>
            <p className="text-surface-500 text-sm">
              {isLogin ? 'Welcome back! Please enter your details.' : 'Join us to track your orders and checkout faster.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                  <input
                    type="text"
                    required
                    className="input-field !pl-10"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                <input
                  type="email"
                  required
                  className="input-field !pl-10"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                <input
                  type="password"
                  required
                  className="input-field !pl-10"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 !py-3 mt-6"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-surface-200 dark:border-surface-700 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-medium text-primary-500 hover:text-primary-600"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 opacity-50">
          <Zap className="w-4 h-4" />
          <span className="text-xs font-semibold tracking-widest uppercase">Secure Store Auth</span>
        </div>
      </div>
    </div>
  );
};

export default StoreAuth;
