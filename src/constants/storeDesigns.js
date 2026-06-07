export const DEFAULT_DESIGN = {
  heroStyle: 'gradient',
  cardStyle: 'rounded',
  headerStyle: 'standard',
  buttonStyle: 'rounded',
  footerStyle: 'standard',
  darkMode: false,
};

export const HERO_STYLES = [
  { id: 'gradient', name: 'Gradient Banner', description: 'Full-width colorful gradient hero' },
  { id: 'wave', name: 'Wave', description: 'Gradient with a soft wave overlay' },
  { id: 'minimal', name: 'Minimal', description: 'Clean light hero with accent border' },
  { id: 'dark', name: 'Dark Spotlight', description: 'Dark dramatic hero section' },
];

export const CARD_STYLES = [
  { id: 'rounded', name: 'Rounded', description: 'Classic rounded product cards' },
  { id: 'soft', name: 'Soft', description: 'Extra rounded, friendly feel' },
  { id: 'sharp', name: 'Sharp', description: 'Crisp corners, modern look' },
  { id: 'bold', name: 'Bold', description: 'Bordered cards with accent outline' },
];

export const HEADER_STYLES = [
  { id: 'standard', name: 'Standard', description: 'Logo left, navigation on the right' },
  { id: 'centered', name: 'Centered', description: 'Logo and links centered together' },
  { id: 'minimal', name: 'Minimal', description: 'Flat bar with a simple bottom border' },
];

export const BUTTON_STYLES = [
  { id: 'rounded', name: 'Rounded', description: 'Smooth rounded corners' },
  { id: 'pill', name: 'Pill', description: 'Fully rounded pill-shaped buttons' },
  { id: 'sharp', name: 'Sharp', description: 'Square corners for a bold look' },
];

export const FOOTER_STYLES = [
  { id: 'standard', name: 'Standard', description: 'Classic dark footer with logo' },
  { id: 'minimal', name: 'Minimal', description: 'Compact single-line footer' },
  { id: 'branded', name: 'Branded', description: 'Gradient footer using your brand colors' },
];

export const resolveStoreDesign = (theme = {}) => {
  const cardCandidate = theme.cardStyle || theme.layoutStyle;

  return {
    heroStyle: HERO_STYLES.some((s) => s.id === theme.heroStyle)
      ? theme.heroStyle
      : DEFAULT_DESIGN.heroStyle,
    cardStyle: CARD_STYLES.some((s) => s.id === cardCandidate)
      ? cardCandidate
      : DEFAULT_DESIGN.cardStyle,
    headerStyle: HEADER_STYLES.some((s) => s.id === theme.headerStyle)
      ? theme.headerStyle
      : DEFAULT_DESIGN.headerStyle,
    buttonStyle: BUTTON_STYLES.some((s) => s.id === theme.buttonStyle)
      ? theme.buttonStyle
      : DEFAULT_DESIGN.buttonStyle,
    footerStyle: FOOTER_STYLES.some((s) => s.id === theme.footerStyle)
      ? theme.footerStyle
      : DEFAULT_DESIGN.footerStyle,
    darkMode: theme.darkMode ?? DEFAULT_DESIGN.darkMode,
  };
};

export const getStoreThemeClassName = (theme) =>
  [
    'store-theme',
    theme.templateId ? `store-theme-${theme.templateId}` : '',
    `store-hero-${theme.heroStyle}`,
    `store-layout-${theme.cardStyle}`,
    `store-header-${theme.headerStyle}`,
    `store-btn-${theme.buttonStyle}`,
    `store-footer-${theme.footerStyle}`,
    theme.darkMode ? 'store-theme-dark' : '',
  ]
    .filter(Boolean)
    .join(' ');
