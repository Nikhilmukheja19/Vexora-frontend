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
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{business?.name || 'Shop'}</h1>
        <p className="text-surface-500 mt-1">{products.length} products available</p>
      </div>

      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="input-field !pl-11" />
        </div>
        <select value={sort} onChange={e => setSort(e.target.value)} className="input-field max-w-[180px]">
          <option value="-createdAt">Newest First</option>
          <option value="price">Price: Low to High</option>
          <option value="-price">Price: High to Low</option>
        </select>
      </div>

      {/* Category Pills */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {['all', ...categories].map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${category === cat ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25' : 'bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700'}`}>
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>
      )}

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="h-72 rounded-2xl bg-surface-200 dark:bg-surface-800 animate-pulse" />)}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <Package className="w-16 h-16 mx-auto text-surface-300 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No products found</h3>
          <p className="text-surface-500">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => <ProductCard key={product._id} product={product} />)}
        </div>
      )}

      {business?.settings?.enableChat && <ChatWidget businessSlug={slug} />}
    </div>
  );
};

export default Shop;
