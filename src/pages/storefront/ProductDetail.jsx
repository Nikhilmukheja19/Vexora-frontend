import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useCart } from '../../contexts/CartContext';
import ChatWidget from '../../components/chat/ChatWidget';
import WhatsAppButton from '../../components/storefront/WhatsAppButton';
import { ShoppingCart, ArrowLeft, Star, Package, ShieldCheck, Truck } from 'lucide-react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Loader from '../../components/ui/Loader';

const ProductDetail = () => {
  const { slug, id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const [prodRes, bizRes] = await Promise.all([
          api.get(`/products/public/${slug}/${id}`),
          api.get(`/business/public/${slug}`),
        ]);
        setProduct(prodRes.data.data.product);
        setBusiness(bizRes.data.data.business);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (slug && id) fetchProduct();
  }, [slug, id]);

  if (loading) return <Loader fullPage size="lg" />;

  if (!product) return (
    <div className="max-w-7xl mx-auto px-6 py-20 text-center">
      <Package className="w-16 h-16 mx-auto text-surface-300 mb-4" />
      <h2 className="text-2xl font-bold">Product not found</h2>
      <Button variant="ghost" className="mt-4" onClick={() => navigate(-1)}>
        <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
      </Button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 lg:py-16">
      <Button variant="ghost" className="mb-8" onClick={() => navigate(-1)}>
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Shop
      </Button>

      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square glass-card overflow-hidden bg-surface-100 dark:bg-surface-800">
            {product.images?.[0] ? (
              <img 
                src={product.images[0]} 
                alt={product.name} 
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-surface-300">
                <Package className="w-24 h-24" />
              </div>
            )}
          </div>
          {/* Thumbnails if multiple images (demo/mock) */}
          <div className="flex gap-4">
            {product.images?.map((img, i) => (
              <div key={i} className="w-24 h-24 glass-card overflow-hidden cursor-pointer ring-primary-500 ring-offset-2">
                <img src={img} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Badge variant="info" className="uppercase">{product.category}</Badge>
            <h1 className="text-4xl font-extrabold text-surface-900 dark:text-white">{product.name}</h1>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center text-amber-500">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                <span className="ml-2 text-sm text-surface-500 font-medium">(24 Reviews)</span>
              </div>
              <Badge variant="success">In Stock</Badge>
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">₹{product.price}</span>
            {product.comparePrice > product.price && (
              <span className="text-xl text-surface-400 line-through">₹{product.comparePrice}</span>
            )}
          </div>

          <p className="text-surface-600 dark:text-surface-400 leading-relaxed text-lg">
            {product.description || "No description available for this product."}
          </p>

          <div className="pt-6 border-t border-surface-200 dark:border-surface-700 space-y-6">
            <div className="flex items-center gap-6">
              <div className="flex items-center bg-surface-100 dark:bg-surface-800 rounded-xl p-1">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-surface-700 transition-colors"
                >
                  -
                </button>
                <span className="w-12 text-center font-bold">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-surface-700 transition-colors"
                >
                  +
                </button>
              </div>
              <Button 
                onClick={() => addItem(product, quantity)}
                className="flex-1 !py-4 text-lg"
              >
                <ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-surface-50 dark:bg-surface-800/50 rounded-2xl">
                <Truck className="w-5 h-5 text-primary-500" />
                <div>
                  <p className="text-sm font-bold">Fast Delivery</p>
                  <p className="text-xs text-surface-500">2-4 Business days</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-surface-50 dark:bg-surface-800/50 rounded-2xl">
                <ShieldCheck className="w-5 h-5 text-primary-500" />
                <div>
                  <p className="text-sm font-bold">Secure Payment</p>
                  <p className="text-xs text-surface-500">100% Protection</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {business?.settings?.enableChat && <ChatWidget businessSlug={slug} />}
      {business?.socialLinks?.whatsapp && <WhatsAppButton phone={business.socialLinks.whatsapp} />}
    </div>
  );
};

export default ProductDetail;
