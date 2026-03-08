import styled, { keyframes } from 'styled-components';

/* =============================================
   FOX LOADING — GEOMETRIC LOGO MARK
   ============================================= */

const foxReveal = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.82);
    filter: blur(6px) drop-shadow(0 0 0 transparent);
  }
  100% {
    opacity: 1;
    transform: scale(1);
    filter: blur(0px) drop-shadow(0 0 8px rgba(255, 85, 0, 0.15));
  }
`;

const detailReveal = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

const breathe = keyframes`
  0%, 100% {
    filter: drop-shadow(0 0 6px rgba(255, 85, 0, 0.1));
    transform: scale(1);
  }
  50% {
    filter: drop-shadow(0 0 22px rgba(255, 85, 0, 0.3));
    transform: scale(1.02);
  }
`;

const orbitSpin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const progressShine = keyframes`
  0% { left: -40%; }
  100% { left: 140%; }
`;

const fadeInUp = keyframes`
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const dotsMove = keyframes`
  0%, 20% { opacity: 0.15; }
  50% { opacity: 0.8; }
  80%, 100% { opacity: 0.15; }
`;

/* =============================================
   LAYOUT
   ============================================= */

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  gap: 36px;
  background: #08080a;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    width: 320px;
    height: 320px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255, 85, 0, 0.04) 0%, transparent 70%);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -62%);
    pointer-events: none;
  }
`;

/* =============================================
   FOX LOGO WRAPPER
   ============================================= */

export const FoxLogoWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  animation: ${foxReveal} 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards,
             ${breathe} 3.5s ease-in-out 1.2s infinite;
`;

export const OrbitRing = styled.div`
  position: absolute;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 1px solid transparent;
  border-top-color: rgba(255, 85, 0, 0.12);
  border-right-color: rgba(255, 85, 0, 0.04);
  opacity: 0;
  animation: ${orbitSpin} 3s linear infinite, ${detailReveal} 0.6s ease 0.8s forwards;
`;

export const OrbitRingInner = styled.div`
  position: absolute;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 1px solid transparent;
  border-bottom-color: rgba(255, 85, 0, 0.08);
  border-left-color: rgba(255, 85, 0, 0.03);
  opacity: 0;
  animation: ${orbitSpin} 5s linear reverse infinite, ${detailReveal} 0.6s ease 1s forwards;
`;

/* =============================================
   SVG ELEMENTS
   ============================================= */

export const FoxOutline = styled.path``;

export const FoxMask = styled.path`
  opacity: 0;
  animation: ${detailReveal} 0.5s ease 0.4s forwards;
`;

export const FoxDetail = styled.path<{ $delay?: number }>`
  opacity: 0;
  animation: ${detailReveal} 0.4s ease ${({ $delay }) => 0.3 + ($delay ?? 0)}s forwards;
`;

/* =============================================
   PROGRESS BAR
   ============================================= */

export const LoadingBarTrack = styled.div`
  width: 120px;
  height: 2px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.04);
  overflow: hidden;
  position: relative;
  animation: ${fadeInUp} 0.8s ease 0.6s both;
`;

export const LoadingBarShine = styled.div`
  position: absolute;
  top: 0;
  left: -40%;
  width: 40%;
  height: 100%;
  border-radius: 2px;
  background: linear-gradient(90deg, transparent, rgba(255, 85, 0, 0.7), transparent);
  animation: ${progressShine} 1.8s ease-in-out infinite;
`;

/* =============================================
   TEXT
   ============================================= */

export const LoadingText = styled.div`
  font-family: var(--font-body, 'Satoshi', sans-serif);
  font-size: 0.75rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.22);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  animation: ${fadeInUp} 0.8s ease 0.8s both;
  display: flex;
  align-items: center;
  gap: 1px;
`;

export const Dot = styled.span<{ $delay: number }>`
  animation: ${dotsMove} 1.4s ease-in-out infinite;
  animation-delay: ${({ $delay }) => $delay}s;
`;

/* =============================================
   ACCESS DENIED
   ============================================= */

export const AccessDeniedContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  min-height: 60vh;
  text-align: center;
  color: rgba(255, 255, 255, 0.7);

  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #ffffff;
    margin-bottom: 12px;
  }

  p {
    font-size: 0.95rem;
    color: rgba(255, 255, 255, 0.45);
    margin-bottom: 8px;
    line-height: 1.6;

    strong {
      color: var(--fox-primary, #FF5500);
    }
  }
`;
