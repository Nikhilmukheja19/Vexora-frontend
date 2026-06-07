import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import ProductCard from '../../components/storefront/ProductCard';
import ChatWidget from '../../components/chat/ChatWidget';
import { Search, SlidersHorizontal, Package } from 'lucide-react';

const Shop = () => {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('-createdAt');
  const [business, setBusiness] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const [prodRes, bizRes] = await Promise.all([
        api.get(`/products/public/${slug}?search=${search}&category=${category}&sort=${sort}`),
        api.get(`/business/public/${slug}`),
      ]);
      setProducts(prodRes.data.data.products);
      setCategories(prodRes.data.data.categories || []);
      setBusiness(bizRes.data.data.business);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, [slug, search, category, sort]);

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">{business?.name || 'Shop'}</h1>
        <p className="text-sm sm:text-base text-surface-500 mt-1 sm:mt-2">{products.length} products available</p>
      </div>

      {/* Filters and Search Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search and Sort */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              placeholder="Search products..." 
              className="input-field !pl-10 text-sm" 
            />
          </div>
          <select 
            value={sort} 
            onChange={e => setSort(e.target.value)} 
            className="input-field text-sm sm:max-w-xs"
          >
            <option value="-createdAt">Newest First</option>
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
          </select>
        </div>

        {/* Category Pills */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {['all', ...categories].map(cat => (
              <button 
                key={cat} 
                onClick={() => setCategory(cat)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  category === cat 
                    ? 'store-category-active text-white shadow-lg' 
                    : 'bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700'
                }`}
              >
                {cat === 'all' ? 'All' : cat}
              </button>
            ))}
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 pb-8 sm:pb-12">
            {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="h-64 sm:h-72 rounded-2xl bg-surface-200 dark:bg-surface-800 animate-pulse" />)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 sm:py-20">
            <Package className="w-12 sm:w-16 h-12 sm:h-16 mx-auto text-surface-300 mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">No products found</h3>
            <p className="text-sm sm:text-base text-surface-500">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 pb-8 sm:pb-12">
            {products.map(product => <ProductCard key={product._id} product={product} />)}
          </div>
        )}
      </div>

      <ChatWidget slug={slug} />
    </div>
  );
};

export default Shop;

      {business?.settings?.enableChat && <ChatWidget businessSlug={slug} />}
    </div>
  );
};

export default Shop;
