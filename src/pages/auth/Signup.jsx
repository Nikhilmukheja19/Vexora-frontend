import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Zap, Mail, Lock, User, Store, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'admin',
    businessName: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      return toast.error('Please fill all required fields');
    }
    if (formData.role === 'admin' && !formData.businessName) {
      return toast.error('Business name is required for admin accounts');
    }
    setLoading(true);
    try {
      const user = await register(formData);
      navigate(user.role === 'admin' ? '/dashboard' : '/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-surface-50 dark:bg-surface-950">
      {/* Left side - Visual */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-accent-500 via-primary-500 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute w-72 h-72 bg-white/10 rounded-full -bottom-20 -left-20 animate-float"></div>
          <div className="absolute w-48 h-48 bg-white/10 rounded-full top-20 right-20 animate-float" style={{ animationDelay: '2s' }}></div>
        </div>
        <div className="text-center text-white relative z-10 px-12">
          <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-8">
            <Store className="w-10 h-10" />
          </div>
          <h2 className="text-4xl font-extrabold mb-4">Launch Your Store</h2>
          <p className="text-white/80 max-w-sm mx-auto">
            Get your business online in minutes with our AI-powered platform.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-slide-up">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl gradient-text">Vexora</span>
          </Link>

          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-surface-500 mb-8">Set up your business in just a few steps</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Toggle */}
            <div className="flex rounded-xl bg-surface-100 dark:bg-surface-800 p-1">
              <button
                type="button"
                onClick={() => setFormData(p => ({ ...p, role: 'admin' }))}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${formData.role === 'admin' ? 'bg-white dark:bg-surface-700 shadow-sm text-primary-600' : 'text-surface-500'}`}
              >
                Business Owner
              </button>
              <button
                type="button"
                onClick={() => setFormData(p => ({ ...p, role: 'customer' }))}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${formData.role === 'customer' ? 'bg-white dark:bg-surface-700 shadow-sm text-primary-600' : 'text-surface-500'}`}
              >
                Customer
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                <input name="name" value={formData.name} onChange={handleChange} className="input-field !pl-11" placeholder="John Doe" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                <input name="email" type="email" value={formData.email} onChange={handleChange} className="input-field !pl-11" placeholder="you@example.com" required />
              </div>
            </div>

            {formData.role === 'admin' && (
              <div>
                <label className="block text-sm font-medium mb-2">Business Name</label>
                <div className="relative">
                  <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                  <input name="businessName" value={formData.businessName} onChange={handleChange} className="input-field !pl-11" placeholder="My Awesome Store" required />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                <input
                  name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange}
                  className="input-field !pl-11 !pr-11" placeholder="Min 6 characters" required minLength={6}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 !py-3">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Create Account'}
            </button>
          </form>

          <p className="text-center mt-6 text-surface-500">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-500 font-semibold hover:text-primary-600">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
