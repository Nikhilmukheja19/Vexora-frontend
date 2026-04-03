import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../../services/api';
import { useCart } from '../../contexts/CartContext';
import ChatWidget from '../../components/chat/ChatWidget';
import WhatsAppButton from '../../components/storefront/WhatsAppButton';
import { ArrowRight, Star, ShoppingBag, Zap } from 'lucide-react';

const StorefrontHome = () => {
  const { slug } = useParams();
  const [business, setBusiness] = useState(null);
  const [products, setProducts] = useState([]);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bizRes, prodRes] = await Promise.all([
          api.get(`/business/public/${slug}`),
          api.get(`/products/public/${slug}?limit=6`),
        ]);
        setBusiness(bizRes.data.data.business);
        setProducts(prodRes.data.data.products);
      } catch {}
    };
    if (slug) fetchData();
  }, [slug]);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-24 px-6 overflow-hidden bg-gradient-to-br from-primary-600 via-purple-600 to-accent-600">
        <div className="absolute inset-0">
          <div className="absolute w-96 h-96 bg-white/10 rounded-full -top-20 -right-20 animate-float" />
          <div className="absolute w-64 h-64 bg-white/10 rounded-full bottom-10 left-10 animate-float" style={{animationDelay:'2s'}} />
        </div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          {business?.logo && <img src={business.logo} alt="logo" className="w-20 h-20 rounded-2xl mx-auto mb-6 shadow-xl" />}
          <h1 className="text-5xl font-extrabold text-white mb-4">{business?.name || 'Welcome to Our Store'}</h1>
          <p className="text-xl text-white/80 mb-8 max-w-xl mx-auto">{business?.description || 'Discover our amazing collection of products.'}</p>
          <Link to={`/store/${slug}/shop`} className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 font-bold rounded-xl hover:bg-primary-50 hover:shadow-xl transition-all duration-300 group">
            Shop Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      {products.length > 0 && (
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold">Featured Products</h2>
                <p className="text-surface-500 mt-1">Handpicked just for you</p>
              </div>
              <Link to={`/store/${slug}/shop`} className="btn-outline flex items-center gap-2">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <div key={product._id} className="glass-card overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="relative aspect-square bg-surface-100 dark:bg-surface-800 overflow-hidden">
                    {product.images?.[0] ? (
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-surface-300"><ShoppingBag className="w-12 h-12" /></div>
                    )}
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-surface-500 uppercase tracking-wide">{product.category}</p>
                    <h3 className="font-bold text-lg mt-1">{product.name}</h3>
                    <p className="text-surface-500 text-sm mt-1 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xl font-bold text-primary-600 dark:text-primary-400">₹{product.price}</span>
                      <button onClick={() => addItem(product)} className="btn-primary !px-4 !py-2 text-sm">Add to Cart</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why us section */}
      <section className="py-16 px-6 bg-surface-100/50 dark:bg-surface-900/50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">Why Shop With Us?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '🚀', title: 'Fast Delivery', desc: 'Quick and reliable shipping to your doorstep' },
              { icon: '🛡️', title: 'Secure Payment', desc: 'Multiple secure payment options available' },
              { icon: '💬', title: '24/7 AI Support', desc: 'Our AI assistant is always ready to help you' },
            ].map((item, i) => (
              <div key={i} className="glass-card p-8 text-center">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-surface-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {business?.settings?.enableChat && <ChatWidget businessSlug={slug} />}
      {business?.socialLinks?.whatsapp && <WhatsAppButton phone={business.socialLinks.whatsapp} />}
    </div>
  );
};

export default StorefrontHome;
