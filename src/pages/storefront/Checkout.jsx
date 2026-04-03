import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { MapPin, CreditCard, ShoppingBag, ArrowRight, CheckCircle } from 'lucide-react';

const Checkout = () => {
  const { slug } = useParams();
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: user?.name || '', phone: '', street: '', city: '', state: '', zip: '', country: 'India',
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [notes, setNotes] = useState('');
  const businessSlug = slug || window.location.pathname.split('/')[2];

  const handleOrder = async () => {
    if (!items.length) return toast.error('Cart is empty');
    setLoading(true);
    try {
      const res = await api.post('/orders', {
        businessSlug,
        items: items.map(i => ({ product: i.product._id, quantity: i.quantity })),
        shippingAddress: form,
        paymentMethod,
        notes,
      });
      clearCart();
      navigate(`/store/${businessSlug}/order-success`, { state: { order: res.data.data.order } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed');
    } finally { setLoading(false); }
  };

  if (!items.length) return (
    <div className="max-w-xl mx-auto px-6 py-20 text-center">
      <ShoppingBag className="w-16 h-16 mx-auto text-surface-300 mb-4" />
      <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
      <p className="text-surface-500 mb-6">Add some products before checking out.</p>
      <button onClick={() => navigate(-1)} className="btn-primary">Continue Shopping</button>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {/* Steps */}
      <div className="flex gap-4 mb-8">
        {['Shipping', 'Payment', 'Review'].map((s, i) => (
          <div key={i} className={`flex items-center gap-2 ${i < 2 ? 'flex-1' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step > i + 1 ? 'bg-emerald-500 text-white' : step === i + 1 ? 'bg-primary-500 text-white' : 'bg-surface-200 dark:bg-surface-700 text-surface-500'}`}>
              {step > i + 1 ? <CheckCircle className="w-4 h-4" /> : i + 1}
            </div>
            <span className={`text-sm font-medium ${step === i + 1 ? 'text-primary-600' : 'text-surface-500'}`}>{s}</span>
            {i < 2 && <div className="flex-1 h-0.5 bg-surface-200 dark:bg-surface-700 mx-2" />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          {step === 1 && (
            <div className="glass-card p-6 space-y-4">
              <h2 className="font-bold text-lg flex items-center gap-2"><MapPin className="w-5 h-5" /> Shipping Address</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2"><label className="block text-sm font-medium mb-1">Full Name</label><input value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} className="input-field" /></div>
                <div className="col-span-2"><label className="block text-sm font-medium mb-1">Phone</label><input value={form.phone} onChange={e => setForm(p => ({...p, phone: e.target.value}))} className="input-field" /></div>
                <div className="col-span-2"><label className="block text-sm font-medium mb-1">Street Address</label><input value={form.street} onChange={e => setForm(p => ({...p, street: e.target.value}))} className="input-field" /></div>
                <div><label className="block text-sm font-medium mb-1">City</label><input value={form.city} onChange={e => setForm(p => ({...p, city: e.target.value}))} className="input-field" /></div>
                <div><label className="block text-sm font-medium mb-1">State</label><input value={form.state} onChange={e => setForm(p => ({...p, state: e.target.value}))} className="input-field" /></div>
                <div><label className="block text-sm font-medium mb-1">ZIP Code</label><input value={form.zip} onChange={e => setForm(p => ({...p, zip: e.target.value}))} className="input-field" /></div>
              </div>
              <button onClick={() => setStep(2)} className="btn-primary w-full">Continue to Payment</button>
            </div>
          )}

          {step === 2 && (
            <div className="glass-card p-6 space-y-4">
              <h2 className="font-bold text-lg flex items-center gap-2"><CreditCard className="w-5 h-5" /> Payment Method</h2>
              {[
                { value: 'cod', label: 'Cash on Delivery', icon: '💵' },
                { value: 'upi', label: 'UPI Payment', icon: '📱' },
                { value: 'card', label: 'Credit/Debit Card', icon: '💳' },
              ].map(pm => (
                <label key={pm.value} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === pm.value ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/30' : 'border-surface-200 dark:border-surface-700'}`}>
                  <input type="radio" value={pm.value} checked={paymentMethod === pm.value} onChange={e => setPaymentMethod(e.target.value)} className="accent-primary-500" />
                  <span className="text-2xl">{pm.icon}</span>
                  <span className="font-medium">{pm.label}</span>
                </label>
              ))}
              <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Order notes (optional)..." className="input-field" rows={2} />
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="btn-secondary flex-1">Back</button>
                <button onClick={() => setStep(3)} className="btn-primary flex-1">Review Order</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="glass-card p-6 space-y-4">
              <h2 className="font-bold text-lg">Review Your Order</h2>
              <div className="space-y-3">
                {items.map(item => (
                  <div key={item.product._id} className="flex items-center gap-4 p-3 bg-surface-50 dark:bg-surface-800 rounded-xl">
                    <div className="w-14 h-14 rounded-lg bg-surface-200 dark:bg-surface-700 overflow-hidden flex-shrink-0">
                      {item.product.images?.[0] && <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-surface-500">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-bold">₹{(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-surface-50 dark:bg-surface-800 rounded-xl space-y-2 text-sm">
                <div className="flex justify-between"><span>Ship to</span><span className="font-medium">{form.city}, {form.state}</span></div>
                <div className="flex justify-between"><span>Payment</span><span className="font-medium capitalize">{paymentMethod}</span></div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="btn-secondary flex-1">Back</button>
                <button onClick={handleOrder} disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Place Order <ArrowRight className="w-4 h-4" /></>}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="glass-card p-6 h-fit space-y-4">
          <h3 className="font-bold text-lg">Order Summary</h3>
          {items.map(item => (
            <div key={item.product._id} className="flex justify-between text-sm">
              <span className="truncate pr-2">{item.product.name} × {item.quantity}</span>
              <span className="font-medium whitespace-nowrap">₹{(item.product.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t border-surface-200 dark:border-surface-700 pt-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
