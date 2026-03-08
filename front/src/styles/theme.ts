export const theme = {
  colors: {
    primary: {
      main: '#0a0a0a',
      light: '#818cf8',
      dark: '#4f46e5',
      contrast: '#ffffff',
    },
    secondary: {
      main: '#8b5cf6',
      light: '#a78bfa',
      dark: '#7c3aed',
      contrast: '#ffffff',
    },
    success: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
      contrast: '#ffffff',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
      contrast: '#ffffff',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
      contrast: '#ffffff',
    },
    neutral: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
      950: '#0a0a0a',
    },
    background: {
      primary: '#030303',
      secondary: '#0c0c0d',
      tertiary: '#111113',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.55)',
      tertiary: 'rgba(255, 255, 255, 0.4)',
      inverse: '#060608',
    },
    border: {
      light: 'rgba(255, 255, 255, 0.06)',
      main: 'rgba(255, 255, 255, 0.07)',
      dark: 'rgba(255, 255, 255, 0.12)',
    },
  },
  
  gradients: {
    hero: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    card: 'linear-gradient(to bottom right, rgba(255,255,255,0.04), rgba(255,255,255,0.015))',
    button: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  },

  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.3)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
    card: '0 4px 16px rgba(0, 0, 0, 0.3)',
    button: '0 4px 14px rgba(99, 102, 241, 0.4)',
  },
  
  typography: {
    fontFamily: {
      primary: '"Satoshi", "Inter", system-ui, sans-serif',
      display: '"Clash Display", "Space Grotesk", system-ui, sans-serif',
      mono: '"Fira Code", monospace',
    },
    fontSize: {
      xs: 'clamp(0.7rem, 0.65rem + 0.25vw, 0.75rem)',        // 11.2px → 12px
      sm: 'clamp(0.8rem, 0.75rem + 0.25vw, 0.875rem)',       // 12.8px → 14px
      base: 'clamp(0.875rem, 0.825rem + 0.25vw, 1rem)',      // 14px → 16px
      lg: 'clamp(1rem, 0.925rem + 0.375vw, 1.125rem)',       // 16px → 18px
      xl: 'clamp(1.125rem, 1rem + 0.625vw, 1.25rem)',        // 18px → 20px
      '2xl': 'clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)',      // 20px → 24px
      '3xl': 'clamp(1.5rem, 1.25rem + 1.25vw, 1.875rem)',    // 24px → 30px
      '4xl': 'clamp(1.75rem, 1.4rem + 1.75vw, 2.25rem)',     // 28px → 36px
      '5xl': 'clamp(2rem, 1.5rem + 2.5vw, 3rem)',            // 32px → 48px
      '6xl': 'clamp(2.5rem, 1.75rem + 3.75vw, 3.75rem)',     // 40px → 60px
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
    '3xl': '4rem',    // 64px
    '4xl': '6rem',    // 96px
  },
  
  borderRadius: {
    sm: '0.25rem',    // 4px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    '2xl': '1.5rem',  // 24px
    full: '9999px',
  },
  
  breakpoints: {
    xs: '320px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
    '3xl': '1920px',
    '4k': '2560px',
  },

  layout: {
    contentMaxWidth: '1400px',
    wideMaxWidth: '1800px',
    sidebarWidth: '280px',
    headerHeight: '80px',
  },
  
  transitions: {
    fast: '150ms',
    normal: '250ms',
    slow: '350ms',
    ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
} as const;

export type Theme = typeof theme;

