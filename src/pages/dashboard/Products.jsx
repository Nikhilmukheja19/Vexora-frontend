import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Plus, Search, Edit2, Trash2, Package, X, Eye, EyeOff, Star, StarOff } from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', comparePrice: '', category: '', stock: '', images: [], isActive: true, isFeatured: false });

  const fetchProducts = async () => {
    try {
      const res = await api.get(`/products?search=${search}`);
      setProducts(res.data.data.products);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, [search]);

  const resetForm = () => {
    setForm({ name: '', description: '', price: '', comparePrice: '', category: '', stock: '', images: [], isActive: true, isFeatured: false });
    setEditing(null);
  };

  const openEdit = (product) => {
    setEditing(product._id);
    setForm({
      name: product.name, description: product.description || '', price: product.price,
      comparePrice: product.comparePrice || '', category: product.category || '',
      stock: product.stock, images: product.images || [], isActive: product.isActive, isFeatured: product.isFeatured,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, price: Number(form.price), comparePrice: Number(form.comparePrice) || 0, stock: Number(form.stock) || 0 };
      if (editing) {
        await api.put(`/products/${editing}`, payload);
        toast.success('Product updated');
      } else {
        await api.post('/products', payload);
        toast.success('Product created');
      }
      setShowModal(false);
      resetForm();
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch { toast.error('Failed to delete'); }
  };

  const toggleActive = async (product) => {
    try {
      await api.put(`/products/${product._id}`, { isActive: !product.isActive });
      fetchProducts();
    } catch { }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Products</h1>
          <p className="text-surface-500 mt-1">Manage your product catalog</p>
        </div>
        <button onClick={() => { resetForm(); setShowModal(true); }} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="input-field !pl-11" />
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-64 rounded-2xl bg-surface-200 dark:bg-surface-800 animate-pulse" />)}
        </div>
      ) : products.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Package className="w-16 h-16 mx-auto text-surface-300 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No products yet</h3>
          <p className="text-surface-500 mb-6">Start by adding your first product to the catalog.</p>
          <button onClick={() => { resetForm(); setShowModal(true); }} className="btn-primary">Add Your First Product</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product._id} className="glass-card overflow-hidden group">
              <div className="relative aspect-square bg-surface-100 dark:bg-surface-800">
                {product.images?.[0] ? (
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-surface-300"><Package className="w-12 h-12" /></div>
                )}
                {!product.isActive && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="badge bg-red-500 text-white">Inactive</span>
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(product)} className="p-2 rounded-lg bg-white/90 dark:bg-surface-800/90 shadow hover:bg-primary-500 hover:text-white transition-colors">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => toggleActive(product)} className="p-2 rounded-lg bg-white/90 dark:bg-surface-800/90 shadow hover:bg-amber-500 hover:text-white transition-colors">
                    {product.isActive ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                  <button onClick={() => handleDelete(product._id)} className="p-2 rounded-lg bg-white/90 dark:bg-surface-800/90 shadow hover:bg-red-500 hover:text-white transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2">
                  {product.isFeatured && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />}
                  <span className="text-xs text-surface-500 uppercase">{product.category}</span>
                </div>
                <h3 className="font-semibold truncate mt-1">{product.name}</h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-lg font-bold text-primary-600 dark:text-primary-400">₹{product.price}</span>
                  <span className="text-xs text-surface-500">Stock: {product.stock}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={() => setShowModal(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="glass-card w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in">
              <div className="flex items-center justify-between p-6 border-b border-surface-200 dark:border-surface-700">
                <h2 className="text-lg font-bold">{editing ? 'Edit Product' : 'Add Product'}</h2>
                <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Product Name *</label>
                  <input value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))} className="input-field" rows={3} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Price (₹) *</label>
                    <input type="number" value={form.price} onChange={e => setForm(p => ({...p, price: e.target.value}))} className="input-field" required min="0" step="0.01" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Compare Price</label>
                    <input type="number" value={form.comparePrice} onChange={e => setForm(p => ({...p, comparePrice: e.target.value}))} className="input-field" min="0" step="0.01" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <input value={form.category} onChange={e => setForm(p => ({...p, category: e.target.value}))} className="input-field" placeholder="e.g. Electronics" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Stock</label>
                    <input type="number" value={form.stock} onChange={e => setForm(p => ({...p, stock: e.target.value}))} className="input-field" min="0" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Image URL</label>
                  <input value={form.images[0] || ''} onChange={e => setForm(p => ({...p, images: [e.target.value]}))} className="input-field" placeholder="https://..." />
                </div>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.isActive} onChange={e => setForm(p => ({...p, isActive: e.target.checked}))} className="w-4 h-4 rounded accent-primary-500" />
                    <span className="text-sm">Active</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.isFeatured} onChange={e => setForm(p => ({...p, isFeatured: e.target.checked}))} className="w-4 h-4 rounded accent-primary-500" />
                    <span className="text-sm">Featured</span>
                  </label>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                  <button type="submit" className="btn-primary flex-1">{editing ? 'Update' : 'Create'}</button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Products;
