/**
 * Responsive Design Utilities
 * Mobile-first media query helpers for styled-components
 */

export const media = {
  sm: '@media (min-width: 640px)',
  md: '@media (min-width: 768px)',
  lg: '@media (min-width: 1024px)',
  xl: '@media (min-width: 1280px)',
  '2xl': '@media (min-width: 1536px)',
  '3xl': '@media (min-width: 1920px)',
  '4k': '@media (min-width: 2560px)',

  maxSm: '@media (max-width: 639px)',
  maxMd: '@media (max-width: 767px)',
  maxLg: '@media (max-width: 1023px)',

  touch: '@media (hover: none) and (pointer: coarse)',
  hover: '@media (hover: hover) and (pointer: fine)',
  reducedMotion: '@media (prefers-reduced-motion: reduce)',
} as const;

/**
 * Generates a CSS clamp() value for fluid scaling between two viewport widths.
 * @param minPx - Minimum size in pixels
 * @param maxPx - Maximum size in pixels
 * @param minVw - Minimum viewport width (default 320)
 * @param maxVw - Maximum viewport width (default 1536)
 */
export const fluid = (
  minPx: number,
  maxPx: number,
  minVw: number = 320,
  maxVw: number = 1536,
): string => {
  const minRem = minPx / 16;
  const maxRem = maxPx / 16;
  const slope = (maxRem - minRem) / ((maxVw - minVw) / 100);
  const intercept = minRem - slope * (minVw / 100);
  return `clamp(${minRem}rem, ${intercept.toFixed(4)}rem + ${(slope * 100).toFixed(4)}vw, ${maxRem}rem)`;
};
