import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Save, Store, Palette, Check, RotateCcw, LayoutTemplate } from 'lucide-react';
import { STORE_THEMES, THEME_LIST, DEFAULT_THEME_ID, DEFAULT_DESIGN } from '../../constants/storeThemes';
import {
  HERO_STYLES,
  CARD_STYLES,
  HEADER_STYLES,
  BUTTON_STYLES,
  FOOTER_STYLES,
} from '../../constants/storeDesigns';
import ThemePreview from '../../components/settings/ThemePreview';
import DesignSelector from '../../components/settings/DesignSelector';

const defaultThemeState = () => {
  const preset = STORE_THEMES[DEFAULT_THEME_ID];
  return {
    templateId: DEFAULT_THEME_ID,
    primaryColor: preset.primaryColor,
    secondaryColor: preset.secondaryColor,
    accentColor: preset.accentColor,
    ...DEFAULT_DESIGN,
  };
};

const Settings = () => {
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/business/profile');
        const biz = res.data.data.business;
        setBusiness({
          ...biz,
          theme: {
            ...defaultThemeState(),
            ...biz.theme,
          },
        });
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

  const selectColorTheme = (themeId) => {
    const preset = STORE_THEMES[themeId];
    if (!preset) return;

    setBusiness(prev => ({
      ...prev,
      theme: {
        ...prev.theme,
        templateId: themeId,
        primaryColor: preset.primaryColor,
        secondaryColor: preset.secondaryColor,
        accentColor: preset.accentColor,
      },
    }));
  };

  const resetColors = () => {
    const preset = STORE_THEMES[DEFAULT_THEME_ID];
    setBusiness(prev => ({
      ...prev,
      theme: {
        ...prev.theme,
        templateId: DEFAULT_THEME_ID,
        primaryColor: preset.primaryColor,
        secondaryColor: preset.secondaryColor,
        accentColor: preset.accentColor,
      },
    }));
  };

  const resetDesign = () => {
    setBusiness(prev => ({
      ...prev,
      theme: {
        ...prev.theme,
        ...DEFAULT_DESIGN,
      },
    }));
  };

  const selectedThemeId = business?.theme?.templateId || DEFAULT_THEME_ID;

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

      {/* Live preview — shared by color + design sections */}
      <div className="glass-card p-6 space-y-3">
        <h3 className="font-bold text-lg">Store Preview</h3>
        <p className="text-sm text-surface-500">See how your color and design choices look together before saving.</p>
        <ThemePreview themeConfig={business?.theme} businessName={business?.name || 'Your Store'} />
      </div>

      {/* Color theme */}
      <div className="glass-card p-6 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Palette className="w-5 h-5" /> Color Theme
            </h3>
            <p className="text-sm text-surface-500 mt-1">
              Pick a color palette for your storefront. Design layout is customized separately below.
            </p>
          </div>
          <button type="button" onClick={resetColors} className="btn-ghost flex items-center gap-1.5 text-sm shrink-0">
            <RotateCcw className="w-4 h-4" /> Reset colors
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {THEME_LIST.map((preset) => {
            const isSelected = selectedThemeId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => selectColorTheme(preset.id)}
                className={`relative text-left p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md ${
                  isSelected
                    ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-950/20 shadow-sm'
                    : 'border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600'
                }`}
              >
                {isSelected && (
                  <span className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary-500 text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                )}
                <div className="flex gap-2 mb-3">
                  {[preset.primaryColor, preset.secondaryColor, preset.accentColor].map((color) => (
                    <span
                      key={color}
                      className="w-8 h-8 rounded-lg border border-white/20 shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <p className="font-semibold text-sm">{preset.name}</p>
                <p className="text-xs text-surface-500 mt-0.5">{preset.description}</p>
              </button>
            );
          })}
        </div>

        <div className="pt-2 border-t border-surface-100 dark:border-surface-800">
          <p className="text-sm font-medium mb-3">Fine-tune colors (optional)</p>
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

      {/* Store design */}
      <div className="glass-card p-6 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-bold text-lg flex items-center gap-2">
              <LayoutTemplate className="w-5 h-5" /> Store Design
            </h3>
            <p className="text-sm text-surface-500 mt-1">
              Customize the layout and structure of your storefront independently from colors.
            </p>
          </div>
          <button type="button" onClick={resetDesign} className="btn-ghost flex items-center gap-1.5 text-sm shrink-0">
            <RotateCcw className="w-4 h-4" /> Reset design
          </button>
        </div>

        <DesignSelector
          label="Hero Section"
          description="How your homepage banner looks"
          options={HERO_STYLES}
          value={business?.theme?.heroStyle || DEFAULT_DESIGN.heroStyle}
          onChange={(id) => update('theme.heroStyle', id)}
        />

        <DesignSelector
          label="Product Cards"
          description="Shape and style of product cards"
          options={CARD_STYLES}
          value={business?.theme?.cardStyle || DEFAULT_DESIGN.cardStyle}
          onChange={(id) => update('theme.cardStyle', id)}
        />

        <DesignSelector
          label="Header / Navigation"
          description="Top navigation bar layout"
          options={HEADER_STYLES}
          value={business?.theme?.headerStyle || DEFAULT_DESIGN.headerStyle}
          onChange={(id) => update('theme.headerStyle', id)}
        />

        <DesignSelector
          label="Buttons"
          description="Button shape across your store"
          options={BUTTON_STYLES}
          value={business?.theme?.buttonStyle || DEFAULT_DESIGN.buttonStyle}
          onChange={(id) => update('theme.buttonStyle', id)}
        />

        <DesignSelector
          label="Footer"
          description="Bottom section of your store pages"
          options={FOOTER_STYLES}
          value={business?.theme?.footerStyle || DEFAULT_DESIGN.footerStyle}
          onChange={(id) => update('theme.footerStyle', id)}
        />

        <div className="pt-2 border-t border-surface-100 dark:border-surface-800">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={business?.theme?.darkMode ?? false}
              onChange={(e) => update('theme.darkMode', e.target.checked)}
              className="w-4 h-4 accent-primary-500"
            />
            <div>
              <p className="text-sm font-medium">Dark storefront mode</p>
              <p className="text-xs text-surface-500">Use a dark background across your entire store</p>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Settings;
