import { createGlobalStyle, type DefaultTheme } from 'styled-components';

export const theme: DefaultTheme = {
  colors: {
    primary: {
      main: '#0a0a0a',
      light: '#6b6c6e',
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
      mono: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
    },
    fontSize: {
      xs: 'clamp(0.7rem, 0.65rem + 0.25vw, 0.75rem)',
      sm: 'clamp(0.8rem, 0.75rem + 0.25vw, 0.875rem)',
      base: 'clamp(0.875rem, 0.825rem + 0.25vw, 1rem)',
      lg: 'clamp(1rem, 0.925rem + 0.375vw, 1.125rem)',
      xl: 'clamp(1.125rem, 1rem + 0.625vw, 1.25rem)',
      '2xl': 'clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)',
      '3xl': 'clamp(1.5rem, 1.25rem + 1.25vw, 1.875rem)',
      '4xl': 'clamp(1.75rem, 1.4rem + 1.75vw, 2.25rem)',
      '5xl': 'clamp(2rem, 1.5rem + 2.5vw, 3rem)',
      '6xl': 'clamp(2.5rem, 1.75rem + 3.75vw, 3.75rem)',
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
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
    '4xl': '6rem',
  },
  
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
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
};

export const GlobalStyle = createGlobalStyle`
  :root {
    /* Responsive viewport height */
    --vh-full: 100vh;
    --vh-full: 100dvh;

    /* Fox Premium Design Tokens */
    --fox-primary: #FF5500;
    --fox-secondary: #FF7733;
    --fox-glow: rgba(255, 85, 0, 0.15);
    --fox-surface: rgba(255, 85, 0, 0.04);

    --success-color: #10B981;
    --success-surface: rgba(16, 185, 129, 0.1);

    --bg-body: #030303;
    --surface-1: rgba(12, 12, 13, 0.7);
    --surface-2: rgba(255, 255, 255, 0.02);
    --surface-hover: rgba(255, 255, 255, 0.05);

    --border-light: rgba(255, 255, 255, 0.06);
    --border-highlight: rgba(255, 255, 255, 0.12);
    --border-fox: rgba(255, 85, 0, 0.4);

    --text-main: #F4F4F5;
    --text-muted: #8A8A93;

    --font-display: 'Clash Display', sans-serif;
    --font-body: 'Satoshi', sans-serif;

    --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
    --transition-fast: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s cubic-bezier(0.16, 1, 0.3, 1), color 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s cubic-bezier(0.16, 1, 0.3, 1), filter 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    --transition-med: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.5s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.5s cubic-bezier(0.16, 1, 0.3, 1), color 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s cubic-bezier(0.16, 1, 0.3, 1), filter 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
    overflow-x: hidden;
    font-size: 16px;

    @media (min-width: 1920px) {
      font-size: 17px;
    }

    @media (min-width: 2560px) {
      font-size: 18px;
    }
  }

  body {
    font-family: var(--font-body);
    background-color: #f5f5f5;
    color: var(--text-main);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    min-height: 100vh;
    min-height: 100dvh;
    overflow-x: hidden;
  }

  body::before {
    content: '';
    position: fixed;
    top: -30%;
    right: -20%;
    width: 120vw;
    height: 120vw;
    background: radial-gradient(circle, rgba(255, 85, 0, 0.06) 0%, transparent 45%);
    border-radius: 50%;
    z-index: -2;
    pointer-events: none;
    opacity: 0.7;
    transform: translateZ(0);
  }

  body::after {
    content: '';
    position: fixed;
    inset: 0;
    z-index: -1;
    opacity: 0.03;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
    pointer-events: none;
    transform: translateZ(0);
  }

  /* Scrollbar invisível com animação suave */
  ::-webkit-scrollbar {
    width: 0px;
    height: 0px;
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: transparent;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  /* Firefox */
  * {
    scrollbar-width: none;
    scrollbar-color: transparent transparent;
  }

  /* IE e Edge */
  body {
    -ms-overflow-style: none;
  }

  h1, h2, h3, h4 {
    color: #ffffff;
    font-weight: 700;
  }

  h1 { font-size: clamp(1.75rem, 1.4rem + 1.75vw, 2.25rem); }
  h2 { font-size: clamp(1.5rem, 1.25rem + 1.25vw, 1.875rem); }
  h3 { font-size: clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem); }
  h4 { font-size: clamp(1.125rem, 1rem + 0.625vw, 1.25rem); }

  a {
    text-decoration: none;
    color: inherit;
  }

  /* Fox Premium Animations */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-30px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes cardReveal {
    0% { opacity: 0; transform: translateY(20px) scale(0.97); }
    60% { opacity: 0.8; }
    100% { opacity: 1; transform: translateY(0) scale(1); }
  }

  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  @keyframes listItemIn {
    from { opacity: 0; transform: translateX(-6px); }
    to { opacity: 1; transform: translateX(0); }
  }

  @keyframes modalOverlayIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes modalOverlayOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }

  @keyframes modalContentIn {
    from { opacity: 0; transform: scale(0.95) translateY(10px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }

  @keyframes modalContentOut {
    from { opacity: 1; transform: scale(1) translateY(0); }
    to { opacity: 0; transform: scale(0.95) translateY(10px); }
  }

  @keyframes fadeRight {
    from { opacity: 0; transform: translateX(-30px); }
    to { opacity: 1; transform: translateX(0); }
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .Toastify__toast-theme--dark {
    background: rgba(12, 12, 13, 0.9) !important;
    backdrop-filter: blur(20px);
    border: 1px solid var(--border-light) !important;
    border-radius: 12px !important;
  }
`;
