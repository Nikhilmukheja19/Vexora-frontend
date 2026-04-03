import { useCart } from '../../contexts/CartContext';
import { ShoppingCart, Star } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { addItem } = useCart();

  return (
    <div className="glass-card overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="relative aspect-square overflow-hidden bg-surface-100 dark:bg-surface-800">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-surface-300">
            <ShoppingCart className="w-12 h-12" />
          </div>
        )}
        {product.comparePrice > product.price && (
          <span className="absolute top-3 left-3 badge bg-red-500 text-white text-xs">
            {Math.round((1 - product.price / product.comparePrice) * 100)}% OFF
          </span>
        )}
        {product.isFeatured && (
          <span className="absolute top-3 right-3 badge bg-amber-500 text-white text-xs">
            <Star className="w-3 h-3 mr-1" /> Featured
          </span>
        )}
        <button
          onClick={() => addItem(product)}
          className="absolute bottom-3 right-3 p-2.5 rounded-xl bg-white/90 dark:bg-surface-800/90 backdrop-blur-sm shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-primary-500 hover:text-white"
        >
          <ShoppingCart className="w-4 h-4" />
        </button>
      </div>
      <div className="p-4">
        <p className="text-xs text-surface-500 uppercase tracking-wide mb-1">{product.category}</p>
        <h3 className="font-semibold text-surface-900 dark:text-white truncate">{product.name}</h3>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-lg font-bold text-primary-600 dark:text-primary-400">₹{product.price}</span>
          {product.comparePrice > product.price && (
            <span className="text-sm text-surface-400 line-through">₹{product.comparePrice}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
