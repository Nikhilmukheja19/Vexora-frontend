import { createContext, useContext, useMemo } from 'react';
import { resolveStoreTheme, getThemeCssVars, getStoreThemeClassName } from '../constants/storeThemes';

const StoreThemeContext = createContext(null);

export const useStoreTheme = () => {
  const context = useContext(StoreThemeContext);
  return context ?? { theme: resolveStoreTheme(), themeClassName: 'store-theme' };
};

export const StoreThemeProvider = ({ business, children }) => {
  const theme = useMemo(() => resolveStoreTheme(business?.theme), [business?.theme]);
  const themeClassName = useMemo(() => getStoreThemeClassName(theme), [theme]);

  const value = useMemo(
    () => ({ theme, themeClassName }),
    [theme, themeClassName]
  );

  return (
    <StoreThemeContext.Provider value={value}>
      <div className={themeClassName} style={getThemeCssVars(theme)} data-store-theme={theme.templateId}>
        {children}
      </div>
    </StoreThemeContext.Provider>
  );
};
