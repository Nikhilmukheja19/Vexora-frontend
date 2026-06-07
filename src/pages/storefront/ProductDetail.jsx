import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useCart } from "../../contexts/CartContext";
import ChatWidget from "../../components/chat/ChatWidget";
import WhatsAppButton from "../../components/storefront/WhatsAppButton";
import {
  ShoppingCart,
  ArrowLeft,
  Star,
  Package,
  ShieldCheck,
  Truck,
  ShoppingBag,
} from "lucide-react";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Loader from "../../components/ui/Loader";

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

  if (!product)
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <Package className="w-16 h-16 mx-auto text-surface-300 mb-4" />
        <h2 className="text-2xl font-bold">Product not found</h2>
        <Button variant="ghost" className="mt-4" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
        </Button>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-16">
      <Button
        variant="ghost"
        className="mb-4 sm:mb-6 lg:mb-8 text-sm sm:text-base"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" /> Back to
        Shop
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 xl:gap-16">
        {/* Product Images */}
        <div className="space-y-2 sm:space-y-3 lg:space-y-4 order-2 lg:order-1">
          <div className="aspect-square glass-card overflow-hidden bg-surface-100 dark:bg-surface-800">
            {product.images?.[0] ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-surface-300">
                <Package className="w-16 sm:w-20 lg:w-24 h-16 sm:h-20 lg:h-24" />
              </div>
            )}
          </div>
          {/* Thumbnails if multiple images (demo/mock) */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 sm:gap-3 lg:gap-4 overflow-x-auto pb-2">
              {product.images?.map((img, i) => (
                <div
                  key={i}
                  className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 glass-card overflow-hidden cursor-pointer flex-shrink-0"
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-4 sm:space-y-5 lg:space-y-6 order-1 lg:order-2">
          <div className="space-y-1 sm:space-y-2 lg:space-y-3">
            <Badge variant="info" className="uppercase text-xs sm:text-sm">
              {product.category}
            </Badge>
            <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-extrabold text-surface-900 dark:text-white leading-tight">
              {product.name}
            </h1>
            <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2 xs:gap-3 sm:gap-4 mt-2 sm:mt-3 flex-wrap">
              <div className="flex items-center text-amber-500 gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className="w-3 h-3 sm:w-4 sm:h-4 fill-current"
                  />
                ))}
                <span className="ml-1 sm:ml-2 text-xs sm:text-sm text-surface-500 font-medium">
                  (24 Reviews)
                </span>
              </div>
              <Badge variant="success" className="text-xs sm:text-sm">
                In Stock
              </Badge>
            </div>
          </div>

          <div className="flex items-baseline gap-2 sm:gap-3">
            <span className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-600 dark:text-primary-400">
              ₹{product.price}
            </span>
            {product.comparePrice > product.price && (
              <span className="text-lg xs:text-xl sm:text-2xl text-surface-400 line-through">
                ₹{product.comparePrice}
              </span>
            )}
          </div>

          <p className="text-sm xs:text-base text-surface-600 dark:text-surface-400 leading-relaxed">
            {product.description ||
              "No description available for this product."}
          </p>

          <div className="pt-4 sm:pt-5 lg:pt-6 border-t border-surface-200 dark:border-surface-700 space-y-4 sm:space-y-5 lg:space-y-6">
            {/* Quantity and Action Buttons */}
            <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-3">
              <div className="flex items-center bg-surface-100 dark:bg-surface-800 rounded-xl p-1 order-2 xs:order-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-surface-700 transition-colors text-sm sm:text-base"
                >
                  −
                </button>
                <span className="w-8 sm:w-12 text-center font-bold text-sm sm:text-base">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-surface-700 transition-colors text-sm sm:text-base"
                >
                  +
                </button>
              </div>
              <Button
                onClick={() => addItem(product, quantity)}
                className="flex-1 order-3 xs:order-2 !py-2.5 sm:!py-3 lg:!py-4 text-xs xs:text-sm sm:text-base"
              >
                <ShoppingCart className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />{" "}
                Add to Cart
              </Button>
              <Button
                onClick={() => {
                  navigate(`/store/${slug}/checkout`);
                }}
                className="flex-1 order-1 xs:order-3 !py-2.5 sm:!py-3 lg:!py-4 text-xs xs:text-sm sm:text-base"
              >
                <ShoppingBag className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />{" "}
                Buy Now
              </Button>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
              <div className="flex gap-2 sm:gap-3 p-2.5 sm:p-3 lg:p-4 bg-surface-50 dark:bg-surface-800/50 rounded-lg sm:rounded-2xl">
                <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-bold truncate">
                    Fast Delivery
                  </p>
                  <p className="text-2xs xs:text-xs text-surface-500 leading-tight">
                    2-4 days
                  </p>
                </div>
              </div>
              <div className="flex gap-2 sm:gap-3 p-2.5 sm:p-3 lg:p-4 bg-surface-50 dark:bg-surface-800/50 rounded-lg sm:rounded-2xl">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-bold truncate">
                    Secure Payment
                  </p>
                  <p className="text-2xs xs:text-xs text-surface-500 leading-tight">
                    100% Safe
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {business?.settings?.enableChat && <ChatWidget businessSlug={slug} />}
      {business?.socialLinks?.whatsapp && (
        <WhatsAppButton phone={business.socialLinks.whatsapp} />
      )}
    </div>
  );
};

export default ProductDetail;
