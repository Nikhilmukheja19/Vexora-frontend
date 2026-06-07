import { DEFAULT_DESIGN, resolveStoreDesign, getStoreThemeClassName } from './storeDesigns';

export const STORE_THEMES = {
  classic: {
    id: 'classic',
    name: 'Classic Indigo',
    description: 'Bold indigo and purple tones',
    primaryColor: '#6366f1',
    secondaryColor: '#8b5cf6',
    accentColor: '#06b6d4',
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean Breeze',
    description: 'Calm blues and teals',
    primaryColor: '#0ea5e9',
    secondaryColor: '#0284c7',
    accentColor: '#14b8a6',
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset Glow',
    description: 'Warm oranges and pinks',
    primaryColor: '#f97316',
    secondaryColor: '#ec4899',
    accentColor: '#fbbf24',
  },
  forest: {
    id: 'forest',
    name: 'Forest Green',
    description: 'Natural greens and earth tones',
    primaryColor: '#059669',
    secondaryColor: '#047857',
    accentColor: '#84cc16',
  },
  midnight: {
    id: 'midnight',
    name: 'Midnight',
    description: 'Elegant purple and navy palette',
    primaryColor: '#818cf8',
    secondaryColor: '#6366f1',
    accentColor: '#a78bfa',
  },
  rose: {
    id: 'rose',
    name: 'Rose Gold',
    description: 'Soft pinks and rose tones',
    primaryColor: '#f43f5e',
    secondaryColor: '#fb7185',
    accentColor: '#fda4af',
  },
};

export const DEFAULT_THEME_ID = 'classic';

export const THEME_LIST = Object.values(STORE_THEMES);

export const resolveStoreTheme = (theme = {}) => {
  const templateId = theme.templateId && STORE_THEMES[theme.templateId]
    ? theme.templateId
    : DEFAULT_THEME_ID;
  const preset = STORE_THEMES[templateId];
  const design = resolveStoreDesign(theme);

  return {
    templateId,
    primaryColor: theme.primaryColor || preset.primaryColor,
    secondaryColor: theme.secondaryColor || preset.secondaryColor,
    accentColor: theme.accentColor || preset.accentColor,
    ...design,
  };
};

export { getStoreThemeClassName, DEFAULT_DESIGN };

export const getThemeCssVars = (theme) => ({
  '--color-primary': theme.primaryColor,
  '--color-secondary': theme.secondaryColor,
  '--color-accent': theme.accentColor,
});
