import styled, { keyframes } from 'styled-components';

/* =============================================
   KEYFRAMES — CINEMATIC ERROR REVEAL
   ============================================= */

const foxGlitchReveal = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.7) rotate(-2deg);
    filter: blur(12px);
  }
  40% {
    opacity: 0.6;
    transform: scale(1.04) rotate(0.5deg);
    filter: blur(2px);
  }
  60% {
    opacity: 0.4;
    transform: scale(0.98) rotate(-0.3deg) skewX(2deg);
    filter: blur(0px);
  }
  80% {
    opacity: 0.9;
    transform: scale(1.01) rotate(0deg) skewX(0deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
    filter: blur(0px);
  }
`;

const glitchFlicker = keyframes`
  0%, 100% {
    opacity: 1;
    transform: translate(0, 0);
  }
  7% {
    opacity: 0.8;
    transform: translate(-2px, 1px);
  }
  10% {
    opacity: 1;
    transform: translate(0, 0);
  }
  27% {
    opacity: 0.6;
    transform: translate(1px, -1px) skewX(0.5deg);
  }
  30% {
    opacity: 1;
    transform: translate(0, 0) skewX(0deg);
  }
  55% {
    opacity: 0.85;
    transform: translate(-1px, 0);
  }
  58% {
    opacity: 1;
    transform: translate(0, 0);
  }
  87% {
    opacity: 0.7;
    transform: translate(2px, 1px) skewX(-0.3deg);
  }
  90% {
    opacity: 1;
    transform: translate(0, 0) skewX(0deg);
  }
`;

const scanlineScroll = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100dvh); }
`;

const errorPulse = keyframes`
  0%, 100% {
    filter: drop-shadow(0 0 8px rgba(255, 85, 0, 0.08));
  }
  50% {
    filter: drop-shadow(0 0 28px rgba(255, 85, 0, 0.2));
  }
`;

const fadeSlideUp = keyframes`
  0% {
    opacity: 0;
    transform: translateY(18px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const noiseShift = keyframes`
  0% { background-position: 0 0; }
  25% { background-position: 100% 50%; }
  50% { background-position: 50% 100%; }
  75% { background-position: 25% 75%; }
  100% { background-position: 0 0; }
`;

const gradientRotate = keyframes`
  0% { transform: translate(-50%, -55%) rotate(0deg); }
  100% { transform: translate(-50%, -55%) rotate(360deg); }
`;

const corruptedOrbit = keyframes`
  0% { transform: rotate(0deg); }
  33% { transform: rotate(125deg); }
  34% { transform: rotate(122deg); }
  66% { transform: rotate(248deg); }
  67% { transform: rotate(245deg); }
  100% { transform: rotate(360deg); }
`;

const lineGlitch = keyframes`
  0%, 94%, 100% {
    transform: scaleX(1);
    opacity: 0.15;
  }
  95% {
    transform: scaleX(1.4);
    opacity: 0.5;
  }
  97% {
    transform: scaleX(0.7);
    opacity: 0.08;
  }
`;

/* =============================================
   CONTAINER — FULL VIEWPORT ERROR STATE
   ============================================= */

export const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 80px);
  min-height: calc(100dvh - 80px);
  padding: clamp(2.5rem, 5vw, 3.75rem) clamp(1rem, 2.5vw, 1.5rem) clamp(2rem, 3vw, 3rem);
  background: #030303;
  position: relative;
  overflow: hidden;
  font-family: var(--font-body, 'Satoshi', 'Inter', system-ui, sans-serif);

  /* Ambient gradient orb */
  &::before {
    content: '';
    position: absolute;
    width: 500px;
    height: 500px;
    border-radius: 50%;
    background: conic-gradient(
      from 0deg,
      rgba(255, 85, 0, 0.04) 0deg,
      rgba(239, 68, 68, 0.06) 90deg,
      rgba(255, 85, 0, 0.02) 180deg,
      rgba(239, 68, 68, 0.04) 270deg,
      rgba(255, 85, 0, 0.04) 360deg
    );
    top: 50%;
    left: 50%;
    animation: ${gradientRotate} 20s linear infinite;
    filter: blur(80px);
    pointer-events: none;
    opacity: 0.8;
  }

  /* Scanline overlay */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(255, 255, 255, 0.008) 2px,
      rgba(255, 255, 255, 0.008) 4px
    );
    pointer-events: none;
    z-index: 1;
  }
`;

/* Scanning light beam */
export const ScanBeam = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 2;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 85, 0, 0.08) 20%,
      rgba(255, 85, 0, 0.15) 50%,
      rgba(255, 85, 0, 0.08) 80%,
      transparent 100%
    );
    animation: ${scanlineScroll} 6s linear infinite;
    opacity: 0.6;
  }
`;

/* Noise texture overlay */
export const NoiseOverlay = styled.div`
  position: absolute;
  inset: -50%;
  width: 200%;
  height: 200%;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
  background-size: 256px 256px;
  animation: ${noiseShift} 8s steps(5) infinite;
  pointer-events: none;
  z-index: 1;
  opacity: 0.5;
`;

/* =============================================
   FOX LOGO — CORRUPTED ERROR STATE
   ============================================= */

export const FoxLogoSection = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;
  z-index: 5;
  animation: ${foxGlitchReveal} 1s cubic-bezier(0.16, 1, 0.3, 1) forwards,
             ${errorPulse} 4s ease-in-out 1.5s infinite;
  opacity: 0;
`;

export const CorruptedOrbitRing = styled.div`
  position: absolute;
  width: 140px;
  height: 140px;
  border-radius: 50%;
  border: 1px solid transparent;
  border-top-color: rgba(239, 68, 68, 0.15);
  border-right-color: rgba(255, 85, 0, 0.06);
  animation: ${corruptedOrbit} 4s linear infinite;
`;

export const CorruptedOrbitRingInner = styled.div`
  position: absolute;
  width: 116px;
  height: 116px;
  border-radius: 50%;
  border: 1px solid transparent;
  border-bottom-color: rgba(255, 85, 0, 0.08);
  border-left-color: rgba(239, 68, 68, 0.04);
  animation: ${corruptedOrbit} 6s linear reverse infinite;
`;

/* Glitch RGB split effect on the SVG */
export const FoxSvgWrapper = styled.div`
  position: relative;
  animation: ${glitchFlicker} 8s ease-in-out infinite;
  animation-delay: 2s;

  /* Red channel ghost */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: inherit;
    mix-blend-mode: screen;
    opacity: 0;
    animation: none;
  }
`;

export const FoxErrorSlash = styled.line`
  stroke: rgba(239, 68, 68, 0.7);
  stroke-width: 2.5;
  stroke-linecap: round;
  opacity: 0;
  animation: ${fadeSlideUp} 0.5s ease 0.6s forwards;
`;

/* =============================================
   CONTENT AREA
   ============================================= */

export const ContentWrapper = styled.div`
  position: relative;
  z-index: 5;
  max-width: clamp(300px, 85vw, 520px);
  width: 100%;
  text-align: center;
`;

/* Error code badge */
export const ErrorBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 9999px;
  background: rgba(239, 68, 68, 0.06);
  border: 1px solid rgba(239, 68, 68, 0.12);
  font-family: var(--font-mono, 'Fira Code', monospace);
  font-size: 0.7rem;
  font-weight: 500;
  color: rgba(239, 68, 68, 0.8);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 24px;
  opacity: 0;
  animation: ${fadeSlideUp} 0.7s ease 0.3s forwards;

  &::before {
    content: '';
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #ef4444;
    box-shadow: 0 0 8px rgba(239, 68, 68, 0.5);
    animation: ${errorPulse} 2s ease-in-out infinite;
  }
`;

export const ErrorTitle = styled.h1`
  font-family: var(--font-display, 'Clash Display', 'Space Grotesk', system-ui, sans-serif);
  font-size: clamp(1.5rem, 1.2rem + 1.5vw, 2.4rem);
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.03em;
  line-height: 1.2;
  margin-bottom: 14px;
  opacity: 0;
  animation: ${fadeSlideUp} 0.7s ease 0.45s forwards;
`;

export const ErrorSubtitle = styled.p`
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.4);
  line-height: 1.7;
  margin-bottom: 36px;
  opacity: 0;
  animation: ${fadeSlideUp} 0.7s ease 0.55s forwards;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
`;

/* Horizontal glitch line divider */
export const GlitchDivider = styled.div`
  width: 60px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 85, 0, 0.4), transparent);
  margin: 0 auto 32px;
  opacity: 0;
  animation: ${fadeSlideUp} 0.5s ease 0.65s forwards,
             ${lineGlitch} 6s ease-in-out 2s infinite;
`;

/* =============================================
   DETAILS PANEL — GLASSMORPHIC TERMINAL
   ============================================= */

export const DetailsPanel = styled.details`
  width: 100%;
  margin-bottom: 32px;
  opacity: 0;
  animation: ${fadeSlideUp} 0.7s ease 0.7s forwards;
`;

export const DetailsSummary = styled.summary`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.35);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 10px 16px;
  border-radius: 10px;
  transition: all 0.25s ease;
  user-select: none;

  &:hover {
    color: rgba(255, 255, 255, 0.55);
    background: rgba(255, 255, 255, 0.03);
  }

  &::marker,
  &::-webkit-details-marker {
    display: none;
  }

  /* Chevron icon */
  &::after {
    content: '';
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 5px solid currentColor;
    transition: transform 0.25s ease;
  }

  ${DetailsPanel}[open] & {
    margin-bottom: 12px;

    &::after {
      transform: rotate(180deg);
    }
  }
`;

export const DetailsContent = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 14px;
  padding: 20px;
  text-align: left;
  backdrop-filter: blur(12px);
  overflow: hidden;

  /* Terminal header dots */
  &::before {
    content: '';
    display: flex;
    gap: 6px;
    margin-bottom: 16px;
    width: 44px;
    height: 8px;
    background:
      radial-gradient(circle at 4px 4px, rgba(239, 68, 68, 0.5) 3px, transparent 3px),
      radial-gradient(circle at 18px 4px, rgba(255, 170, 0, 0.3) 3px, transparent 3px),
      radial-gradient(circle at 32px 4px, rgba(255, 255, 255, 0.1) 3px, transparent 3px);
  }
`;

export const ErrorMessageBox = styled.div`
  padding: 14px 16px;
  background: rgba(239, 68, 68, 0.04);
  border: 1px solid rgba(239, 68, 68, 0.1);
  border-left: 3px solid rgba(239, 68, 68, 0.5);
  border-radius: 8px;
  margin-bottom: 16px;
  font-family: var(--font-mono, 'Fira Code', monospace);
  font-size: 0.78rem;
  line-height: 1.7;
  color: rgba(239, 68, 68, 0.85);
  word-break: break-word;
  white-space: pre-wrap;

  /* Error prefix */
  &::before {
    content: 'ERROR';
    display: block;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    color: rgba(239, 68, 68, 0.5);
    margin-bottom: 8px;
  }
`;

export const StackTrace = styled.pre`
  font-family: var(--font-mono, 'Fira Code', monospace);
  font-size: 0.68rem;
  line-height: 1.9;
  color: rgba(255, 255, 255, 0.22);
  word-break: break-all;
  white-space: pre-wrap;
  margin: 0;
  padding: 14px 16px;
  background: rgba(255, 255, 255, 0.015);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.03);
  max-height: 240px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.08);
    border-radius: 4px;
  }

  & + & {
    margin-top: 10px;
  }
`;

export const StackLabel = styled.span`
  display: block;
  font-family: var(--font-mono, 'Fira Code', monospace);
  font-size: 0.6rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.15);
  margin-bottom: 6px;
  margin-top: 14px;

  &:first-child {
    margin-top: 0;
  }
`;

/* =============================================
   RELOAD BUTTON
   ============================================= */

export const ReloadButton = styled.button`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 36px;
  background: linear-gradient(135deg, #FF5500 0%, #e64d00 100%);
  color: #ffffff;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 4px 20px rgba(255, 85, 0, 0.25),
              0 0 0 1px rgba(255, 85, 0, 0.1);
  opacity: 0;
  animation: ${fadeSlideUp} 0.7s ease 0.8s forwards;
  overflow: hidden;

  /* Shine sweep */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.15),
      transparent
    );
    transition: left 0.5s ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(255, 85, 0, 0.35),
                0 0 0 1px rgba(255, 85, 0, 0.2);

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 12px rgba(255, 85, 0, 0.3),
                0 0 0 1px rgba(255, 85, 0, 0.1);
  }

  /* Reload icon */
  svg {
    width: 16px;
    height: 16px;
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: rotate(180deg);
  }
`;

/* =============================================
   FOOTER HINT
   ============================================= */

export const FooterHint = styled.p`
  position: absolute;
  bottom: 28px;
  font-size: 0.68rem;
  color: rgba(255, 255, 255, 0.12);
  letter-spacing: 0.06em;
  z-index: 5;
  opacity: 0;
  animation: ${fadeSlideUp} 0.6s ease 1.2s forwards;
`;
