import { Link } from 'react-router-dom';
import { Zap, Store, Bot, BarChart3, ShoppingCart, Shield, ArrowRight, Star, ChevronRight, Globe, Sparkles, Users } from 'lucide-react';

const features = [
  { icon: Store, title: 'Website Generator', desc: 'Create a beautiful storefront in minutes. No coding required.', color: 'from-blue-500 to-cyan-500' },
  { icon: Bot, title: 'AI Chatbot', desc: 'Automate customer support with intelligent AI responses.', color: 'from-purple-500 to-pink-500' },
  { icon: ShoppingCart, title: 'E-commerce', desc: 'Full shopping cart, checkout, and order management.', color: 'from-orange-500 to-red-500' },
  { icon: BarChart3, title: 'Analytics', desc: 'Track sales, customers, and growth with real-time dashboards.', color: 'from-emerald-500 to-teal-500' },
  { icon: Shield, title: 'Multi-Tenant', desc: 'Each business gets its own isolated workspace and data.', color: 'from-indigo-500 to-violet-500' },
  { icon: Users, title: 'Customer Management', desc: 'Manage customers, orders, and support tickets in one place.', color: 'from-pink-500 to-rose-500' },
];

const stats = [
  { value: '10K+', label: 'Businesses' },
  { value: '50M+', label: 'Transactions' },
  { value: '99.9%', label: 'Uptime' },
  { value: '24/7', label: 'AI Support' },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl gradient-text">Vexora</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-medium text-surface-600 dark:text-surface-400 hover:text-primary-500 transition-colors">Features</a>
            <a href="#stats" className="text-sm font-medium text-surface-600 dark:text-surface-400 hover:text-primary-500 transition-colors">Stats</a>
            <a href="#pricing" className="text-sm font-medium text-surface-600 dark:text-surface-400 hover:text-primary-500 transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-ghost text-sm">Login</Link>
            <Link to="/signup" className="btn-primary text-sm !py-2">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute top-40 -left-40 w-96 h-96 bg-accent-400/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-400/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-100 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 text-sm font-medium mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              AI-Powered Business Platform
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight animate-slide-up">
              <span className="text-surface-900 dark:text-white">Boost Your</span>
              <br />
              <span className="gradient-text">Local Business</span>
              <br />
              <span className="text-surface-900 dark:text-white">Online</span>
            </h1>
            <p className="mt-6 text-lg text-surface-500 dark:text-surface-400 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Create your online store, manage customers, and automate support with AI — all in one powerful platform designed for local businesses.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Link to="/signup" className="btn-primary text-lg !px-8 !py-3.5 flex items-center gap-2 group">
                Start Free Trial
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/store/demo" className="btn-outline text-lg !px-8 !py-3.5 flex items-center gap-2">
                <Globe className="w-5 h-5" />
                View Demo Store
              </Link>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="mt-20 relative animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="glass-card p-2 max-w-5xl mx-auto">
              <div className="rounded-xl bg-surface-900 dark:bg-surface-800 overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-surface-700">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-xs text-surface-400 ml-2">Vexora — Dashboard</span>
                </div>
                <div className="p-6 grid grid-cols-4 gap-4">
                  {[
                    { label: 'Revenue', value: '₹2,45,890', change: '+12.5%', color: 'text-emerald-400' },
                    { label: 'Orders', value: '1,234', change: '+8.2%', color: 'text-blue-400' },
                    { label: 'Customers', value: '856', change: '+15.3%', color: 'text-purple-400' },
                    { label: 'Products', value: '142', change: '+3.1%', color: 'text-amber-400' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-surface-800 dark:bg-surface-700/50 p-4 rounded-xl">
                      <p className="text-xs text-surface-400">{stat.label}</p>
                      <p className="text-xl font-bold text-white mt-1">{stat.value}</p>
                      <p className={`text-xs ${stat.color} mt-1`}>{stat.change}</p>
                    </div>
                  ))}
                </div>
                <div className="px-6 pb-6 grid grid-cols-3 gap-4">
                  <div className="col-span-2 bg-surface-800 dark:bg-surface-700/50 p-4 rounded-xl h-40 flex items-end gap-2">
                    {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                      <div key={i} className="flex-1 bg-gradient-to-t from-primary-500 to-primary-400 rounded-t" style={{ height: `${h}%` }}></div>
                    ))}
                  </div>
                  <div className="bg-surface-800 dark:bg-surface-700/50 p-4 rounded-xl h-40">
                    <p className="text-xs text-surface-400 mb-2">Top Products</p>
                    {['Product A', 'Product B', 'Product C'].map((p, i) => (
                      <div key={i} className="flex items-center justify-between py-1.5">
                        <span className="text-xs text-surface-300">{p}</span>
                        <span className="text-xs text-primary-400">{234 - i * 45}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* Glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/20 via-purple-500/20 to-accent-500/20 blur-3xl -z-10 rounded-3xl"></div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="py-20 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <p className="text-4xl font-extrabold gradient-text">{stat.value}</p>
              <p className="text-surface-500 mt-1 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-white/50 dark:bg-surface-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-surface-900 dark:text-white">
              Everything You Need to
              <span className="gradient-text"> Succeed Online</span>
            </h2>
            <p className="mt-4 text-surface-500 max-w-xl mx-auto">
              Powerful tools designed specifically for local businesses to thrive in the digital world.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="glass-card p-6 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-surface-500 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-card p-12 relative overflow-hidden">
            <div className="absolute inset-0 gradient-accent opacity-5"></div>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 relative">
              Ready to <span className="gradient-text">Boost Your Business</span>?
            </h2>
            <p className="text-surface-500 mb-8 relative max-w-lg mx-auto">
              Join thousands of businesses already using Vexora to grow their online presence.
            </p>
            <Link to="/signup" className="btn-primary text-lg !px-10 !py-3.5 relative inline-flex items-center gap-2 group">
              Get Started for Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-900 dark:bg-surface-950 text-surface-400 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white">Vexora</span>
          </div>
          <p className="text-sm">© {new Date().getFullYear()} Vexora. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
