import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Save, Store } from 'lucide-react';

const Settings = () => {
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/business/profile');
        setBusiness(res.data.data.business);
      } catch {} finally { setLoading(false); }
    };
    fetch();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/business/profile', business);
      toast.success('Settings saved');
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  const update = (path, value) => {
    setBusiness(prev => {
      const copy = { ...prev };
      const keys = path.split('.');
      let obj = copy;
      for (let i = 0; i < keys.length - 1; i++) {
        obj[keys[i]] = { ...obj[keys[i]] };
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return copy;
    });
  };

  if (loading) return <div className="h-96 rounded-2xl bg-surface-200 dark:bg-surface-800 animate-pulse" />;

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="text-surface-500 mt-1">Configure your business</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
          <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="glass-card p-6 space-y-5">
        <h3 className="font-bold text-lg flex items-center gap-2"><Store className="w-5 h-5" /> Business Info</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Business Name</label>
            <input value={business?.name || ''} onChange={e => update('name', e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select value={business?.category || ''} onChange={e => update('category', e.target.value)} className="input-field">
              {['general','restaurant','retail','services','healthcare','education','technology','other'].map(c => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea value={business?.description || ''} onChange={e => update('description', e.target.value)} className="input-field" rows={3} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Contact Email</label>
            <input value={business?.contactEmail || ''} onChange={e => update('contactEmail', e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Contact Phone</label>
            <input value={business?.contactPhone || ''} onChange={e => update('contactPhone', e.target.value)} className="input-field" />
          </div>
        </div>
      </div>

      <div className="glass-card p-6 space-y-5">
        <h3 className="font-bold text-lg">Store Settings</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Currency</label>
            <input value={business?.settings?.currency || 'INR'} onChange={e => update('settings.currency', e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tax Rate (%)</label>
            <input type="number" value={business?.settings?.taxRate || 0} onChange={e => update('settings.taxRate', Number(e.target.value))} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Shipping Fee (₹)</label>
            <input type="number" value={business?.settings?.shippingFee || 0} onChange={e => update('settings.shippingFee', Number(e.target.value))} className="input-field" />
          </div>
        </div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={business?.settings?.enableChat} onChange={e => update('settings.enableChat', e.target.checked)} className="w-4 h-4 accent-primary-500" />
            <span className="text-sm">Enable AI Chat</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={business?.settings?.enableOrders} onChange={e => update('settings.enableOrders', e.target.checked)} className="w-4 h-4 accent-primary-500" />
            <span className="text-sm">Enable Orders</span>
          </label>
        </div>
      </div>

      <div className="glass-card p-6 space-y-5">
        <h3 className="font-bold text-lg">Theme</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Primary Color</label>
            <input type="color" value={business?.theme?.primaryColor || '#6366f1'} onChange={e => update('theme.primaryColor', e.target.value)} className="w-full h-10 rounded-lg cursor-pointer" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Secondary Color</label>
            <input type="color" value={business?.theme?.secondaryColor || '#8b5cf6'} onChange={e => update('theme.secondaryColor', e.target.value)} className="w-full h-10 rounded-lg cursor-pointer" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Accent Color</label>
            <input type="color" value={business?.theme?.accentColor || '#06b6d4'} onChange={e => update('theme.accentColor', e.target.value)} className="w-full h-10 rounded-lg cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
