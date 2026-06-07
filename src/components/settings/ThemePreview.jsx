import { resolveStoreTheme, getThemeCssVars, getStoreThemeClassName } from '../../constants/storeThemes';
import { Zap, ShoppingBag } from 'lucide-react';

const ThemePreview = ({ themeConfig, businessName = 'Your Store' }) => {
  const theme = resolveStoreTheme(themeConfig);
  const themeClassName = getStoreThemeClassName(theme);

  return (
    <div
      className={`${themeClassName} rounded-2xl overflow-hidden border border-surface-200 dark:border-surface-700 shadow-lg`}
      style={getThemeCssVars(theme)}
    >
      <header className="store-header glass px-4 py-2 border-b border-surface-100 dark:border-surface-800">
        <div className="store-header-inner flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md gradient-primary flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <span className="text-xs font-bold truncate max-w-[120px]">{businessName}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-[10px] font-medium store-text-primary">Shop</span>
            <span className="text-[10px] font-medium text-surface-400">Cart</span>
          </div>
        </div>
      </header>

      <div className="store-hero px-4 py-8 text-center">
        <h4 className="text-sm font-extrabold store-hero-title mb-1">{businessName}</h4>
        <p className="text-[10px] store-hero-subtitle mb-3">Live preview of your storefront</p>
        <button type="button" className="btn-primary !px-3 !py-1.5 !text-xs">
          Shop Now
        </button>
      </div>

      <div className="px-4 py-3 bg-surface-50 dark:bg-surface-950/50">
        <div className="store-product-card glass-card p-2 flex gap-2 items-center">
          <div className="w-10 h-10 rounded-lg bg-surface-200 dark:bg-surface-800 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-4 h-4 text-surface-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold truncate">Sample Product</p>
            <p className="text-xs font-bold store-text-primary">₹999</p>
          </div>
          <button type="button" className="btn-primary !px-2 !py-1 !text-[10px] shrink-0">
            Add
          </button>
        </div>
      </div>

      <footer className="store-footer px-4 py-3 text-center">
        <p className="text-[10px] text-surface-400">© {new Date().getFullYear()} {businessName}</p>
      </footer>
    </div>
  );
};

export default ThemePreview;
