import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: {
        main: string;
        light: string;
        dark: string;
        contrast: string;
      };
      secondary: {
        main: string;
        light: string;
        dark: string;
        contrast: string;
      };
      success: {
        main: string;
        light: string;
        dark: string;
        contrast: string;
      };
      warning: {
        main: string;
        light: string;
        dark: string;
        contrast: string;
      };
      error: {
        main: string;
        light: string;
        dark: string;
        contrast: string;
      };
      neutral: {
        50: string;
        100: string;
        200: string;
        300: string;
        400: string;
        500: string;
        600: string;
        700: string;
        800: string;
        900: string;
        950: string;
      };
      background: {
        primary: string;
        secondary: string;
        tertiary: string;
      };
      text: {
        primary: string;
        secondary: string;
        tertiary: string;
        inverse: string;
      };
      border: {
        light: string;
        main: string;
        dark: string;
      };
    };
    
    gradients: {
      hero: string;
      card: string;
      button: string;
    };
    
    shadows: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
      '2xl': string;
      card: string;
      button: string;
    };
    
    typography: {
      fontFamily: {
        primary: string;
        display: string;
        mono: string;
      };
      fontSize: {
        xs: string;
        sm: string;
        base: string;
        lg: string;
        xl: string;
        '2xl': string;
        '3xl': string;
        '4xl': string;
        '5xl': string;
        '6xl': string;
      };
      fontWeight: {
        light: number;
        normal: number;
        medium: number;
        semibold: number;
        bold: number;
        extrabold: number;
      };
      lineHeight: {
        tight: number;
        normal: number;
        relaxed: number;
      };
    };
    
    spacing: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
    };
    
    borderRadius: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
      '2xl': string;
      full: string;
    };
    
    breakpoints: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      '2xl': string;
    };
    
    transitions: {
      fast: string;
      normal: string;
      slow: string;
      ease: string;
    };
    
    zIndex: {
      dropdown: number;
      sticky: number;
      fixed: number;
      modalBackdrop: number;
      modal: number;
      popover: number;
      tooltip: number;
    };
  }
}

