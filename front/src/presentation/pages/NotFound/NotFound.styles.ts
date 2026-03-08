import styled, { keyframes } from 'styled-components';

/* =============================================
   KEYFRAMES
   ============================================= */

const reveal = keyframes`
  0% {
    opacity: 0;
    transform: translateY(20px);
    filter: blur(4px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
`;

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

const detailReveal = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

const gentlePulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

/* =============================================
   CONTAINER
   ============================================= */

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  min-height: 100dvh;
  padding: 48px 24px;
  background: #030303;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    width: 500px;
    height: 500px;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(255, 85, 0, 0.04) 0%,
      rgba(255, 85, 0, 0.015) 40%,
      transparent 70%
    );
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }
`;

/* =============================================
   FOX LOGO — WITH ORBIT RINGS
   ============================================= */

export const FoxWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 36px;
  z-index: 2;
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

export const FoxDetail = styled.path<{ $delay?: number }>`
  opacity: 0;
  animation: ${detailReveal} 0.4s ease ${({ $delay }) => 0.3 + ($delay ?? 0)}s forwards;
`;

/* =============================================
   404 CODE
   ============================================= */

export const CodeBlock = styled.div`
  position: relative;
  z-index: 2;
  margin-bottom: 28px;
  opacity: 0;
  animation: ${reveal} 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.25s forwards;
`;

export const Code = styled.span`
  font-family: var(--font-display, 'Clash Display', system-ui, sans-serif);
  font-size: clamp(3.5rem, 10vw, 5.5rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.15) 0%,
    rgba(255, 255, 255, 0.06) 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  user-select: none;
`;

/* =============================================
   CONTENT
   ============================================= */

export const Content = styled.div`
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: clamp(280px, 85vw, 420px);
  width: 100%;
`;

export const Title = styled.h2`
  font-family: var(--font-display, 'Clash Display', system-ui, sans-serif);
  font-size: clamp(1.3rem, 3.5vw, 1.65rem);
  font-weight: 600;
  color: #ffffff;
  letter-spacing: -0.02em;
  line-height: 1.3;
  margin-bottom: 10px;
  opacity: 0;
  animation: ${reveal} 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards;
`;

export const Message = styled.p`
  font-family: var(--font-body, 'Satoshi', system-ui, sans-serif);
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.32);
  line-height: 1.7;
  margin-bottom: 28px;
  opacity: 0;
  animation: ${reveal} 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s forwards;
`;

export const PathChip = styled.code`
  display: inline-block;
  padding: 6px 16px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  font-family: var(--font-mono, 'Fira Code', monospace);
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.2);
  margin-bottom: 32px;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  opacity: 0;
  animation: ${reveal} 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.6s forwards;
`;

export const StatusDot = styled.span`
  display: inline-block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #FF5500;
  box-shadow: 0 0 8px rgba(255, 85, 0, 0.5);
  margin-right: 8px;
  vertical-align: middle;
  animation: ${gentlePulse} 2.5s ease-in-out infinite;
`;

/* =============================================
   CTA
   ============================================= */

export const Cta = styled.button`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 40px;
  background: #FF5500;
  color: #ffffff;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  font-family: var(--font-body, 'Satoshi', system-ui, sans-serif);
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.005em;
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 4px 24px rgba(255, 85, 0, 0.2);
  opacity: 0;
  animation: ${reveal} 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.7s forwards;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.12) 50%,
      transparent 100%
    );
    background-size: 200% 100%;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(255, 85, 0, 0.3);

    &::before {
      opacity: 1;
      animation: ${shimmer} 1.2s ease infinite;
    }
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 12px rgba(255, 85, 0, 0.25);
  }

  svg {
    width: 16px;
    height: 16px;
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }

  &:hover svg {
    transform: translateX(-3px);
  }
`;

/* =============================================
   FOOTER
   ============================================= */

export const Footer = styled.span`
  position: absolute;
  bottom: 24px;
  font-family: var(--font-mono, 'Fira Code', monospace);
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.08);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  z-index: 2;
  opacity: 0;
  animation: ${reveal} 0.6s ease 1.2s forwards;
`;
