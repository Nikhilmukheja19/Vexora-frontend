import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../services/api";
import { useCart } from "../../contexts/CartContext";
import ChatWidget from "../../components/chat/ChatWidget";
import WhatsAppButton from "../../components/storefront/WhatsAppButton";
import { ArrowRight, Star, ShoppingBag, Zap } from "lucide-react";

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
      <section className="store-hero relative py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-64 sm:w-96 h-64 sm:h-96 bg-white/10 rounded-full -top-20 sm:-top-32 -right-20 sm:-right-32 animate-float" />
          <div
            className="absolute w-48 sm:w-64 h-48 sm:h-64 bg-white/10 rounded-full bottom-10 left-10 animate-float"
            style={{ animationDelay: "2s" }}
          />
        </div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          {business?.logo && (
            <img
              src={business.logo}
              alt="logo"
              className="w-14 sm:w-16 lg:w-20 h-14 sm:h-16 lg:h-20 rounded-lg sm:rounded-2xl mx-auto mb-4 sm:mb-6 shadow-xl object-cover"
            />
          )}
          <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-extrabold store-hero-title mb-3 sm:mb-4 leading-tight">
            {business?.name || "Welcome to Our Store"}
          </h1>
          <p className="text-base xs:text-lg sm:text-xl lg:text-2xl store-hero-subtitle mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
            {business?.description ||
              "Discover our amazing collection of products."}
          </p>
          <Link
            to={`/store/${slug}/shop`}
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white store-text-primary font-bold rounded-lg sm:rounded-xl hover:shadow-xl transition-all duration-300 group text-sm sm:text-base"
          >
            Shop Now{" "}
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      {products.length > 0 && (
        <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 xs:gap-4 mb-8 sm:mb-10">
              <div>
                <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold">
                  Featured Products
                </h2>
                <p className="text-xs xs:text-sm sm:text-base text-surface-500 mt-1 sm:mt-2">
                  Handpicked just for you
                </p>
              </div>
              <Link
                to={`/store/${slug}/shop`}
                className="btn-outline flex items-center justify-center gap-2 text-sm sm:text-base whitespace-nowrap"
              >
                View All <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="store-product-card glass-card overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="relative aspect-square bg-surface-100 dark:bg-surface-800 overflow-hidden">
                    <Link
                      to={`/store/${slug}/product/${product._id}`}
                      className="block w-full h-full"
                    >
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-surface-300">
                          <ShoppingBag className="w-12 sm:w-16 h-12 sm:h-16" />
                        </div>
                      )}
                    </Link>
                  </div>
                  <div className="p-3 sm:p-4 lg:p-5">
                    <Link
                      to={`/store/${slug}/product/${product._id}`}
                      className="block"
                    >
                      <p className="text-2xs xs:text-xs sm:text-sm text-surface-500 uppercase tracking-wide">
                        {product.category}
                      </p>
                      <h3 className="font-bold text-sm xs:text-base sm:text-lg mt-1 sm:mt-1.5 line-clamp-2 hover:store-text-primary transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-surface-500 text-xs xs:text-sm mt-0.5 sm:mt-1 line-clamp-2">
                        {product.description}
                      </p>
                    </Link>
                    <div className="flex items-center justify-between mt-3 sm:mt-4 gap-2">
                      <span className="text-lg xs:text-xl sm:text-2xl font-bold store-text-primary">
                        ₹{product.price}
                      </span>
                      <button
                        onClick={() => addItem(product)}
                        className="btn-primary !px-2 xs:!px-3 sm:!px-4 !py-1.5 xs:!py-2 sm:!py-2.5 text-xs xs:text-sm"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why us section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-surface-100/50 dark:bg-surface-900/50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 sm:mb-12">
            Why Shop With Us?
          </h2>
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {[
              {
                icon: "🚀",
                title: "Fast Delivery",
                desc: "Quick and reliable shipping to your doorstep",
              },
              {
                icon: "🛡️",
                title: "Secure Payment",
                desc: "Multiple secure payment options available",
              },
              {
                icon: "💬",
                title: "24/7 AI Support",
                desc: "Our AI assistant is always ready to help you",
              },
            ].map((item, i) => (
              <div key={i} className="glass-card p-4 sm:p-6 lg:p-8 text-center">
                <span className="text-4xl sm:text-5xl lg:text-6xl block mb-3 sm:mb-4">
                  {item.icon}
                </span>
                <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-2">
                  {item.title}
                </h3>
                <p className="text-xs xs:text-sm sm:text-base text-surface-500">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ChatWidget slug={slug} />
      <WhatsAppButton />
    </div>
  );
};

export default StorefrontHome;
