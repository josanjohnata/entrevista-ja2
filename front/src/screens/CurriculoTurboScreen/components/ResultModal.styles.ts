import styled, { keyframes, css } from 'styled-components';

const resultReveal = keyframes`
  0% { opacity: 0; transform: translateY(12px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const scoreGlow = keyframes`
  0% { opacity: 0; transform: scale(0.8); }
  60% { transform: scale(1.04); }
  100% { opacity: 1; transform: scale(1); }
`;

const itemSlideIn = keyframes`
  0% { opacity: 0; transform: translateX(-8px); }
  100% { opacity: 1; transform: translateX(0); }
`;

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

/* =============================================
   OVERLAY
   ============================================= */

export const Overlay = styled.div<{ $closing?: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(0, 0, 0, 0.65);
  animation: ${({ $closing }) => ($closing ? 'modalOverlayOut' : 'modalOverlayIn')} 0.3s ease forwards;
`;

/* =============================================
   PANEL
   ============================================= */

export const Panel = styled.div<{ $closing?: boolean }>`
  width: 100%;
  max-width: 640px;
  max-height: 85vh;
  background: rgba(12, 12, 13, 0.97);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow:
    0 40px 80px rgba(0, 0, 0, 0.5),
    0 0 60px rgba(255, 85, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
  animation: ${({ $closing }) => ($closing ? 'modalContentOut' : 'modalContentIn')} 0.3s ease forwards;
`;

/* =============================================
   PANEL HEADER
   ============================================= */

export const PanelHeader = styled.div`
  padding: 16px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.02) 0%, transparent 100%);
`;

export const PanelTitle = styled.h2`
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--text-main);
  letter-spacing: -0.01em;
`;

export const CloseButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s var(--ease-out-expo);

  &:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.07);
    border-color: rgba(255, 255, 255, 0.15);
  }
`;

/* =============================================
   SCORE HERO
   ============================================= */

export const ScoreHero = styled.div`
  padding: 20px 28px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ScoreDisplay = styled.div`
  font-family: var(--font-display);
  font-size: 3rem;
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 1;
  color: #fff;
  display: flex;
  align-items: baseline;
  gap: 2px;
  font-variant-numeric: tabular-nums;
`;

export const ScorePercent = styled.span`
  font-size: 1.5rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.45);
  letter-spacing: -0.01em;
  margin-left: 3px;
`;

export const ProgressBarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  animation: ${resultReveal} 0.4s var(--ease-out-expo) 0.3s forwards;
  opacity: 0;
`;

export const ProgressBarTrack = styled.div`
  flex: 1;
  height: 6px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.06);
  overflow: hidden;
`;

export const ProgressBarFill = styled.div<{ $color: string }>`
  height: 100%;
  border-radius: 6px;
  background: ${({ $color }) => $color};
  transition: width 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.2s;
  box-shadow: 0 0 16px ${({ $color }) => $color}30;
`;

export const CompatibilityBadge = styled.span<{ $variant: 'low' | 'medium' | 'high' }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 100px;
  font-family: var(--font-body);
  font-size: 0.72rem;
  font-weight: 600;
  white-space: nowrap;
  animation: ${resultReveal} 0.4s var(--ease-out-expo) 0.45s forwards;
  opacity: 0;
  align-self: flex-start;

  ${({ $variant }) => {
    if ($variant === 'high') return css`
      color: #10b981;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.2);
    `;
    if ($variant === 'medium') return css`
      color: #f59e0b;
      background: rgba(245, 158, 11, 0.1);
      border: 1px solid rgba(245, 158, 11, 0.2);
    `;
    return css`
      color: #ef4444;
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.2);
    `;
  }}

  svg {
    width: 12px;
    height: 12px;
  }
`;

/* =============================================
   TAB ROW
   ============================================= */

export const TabRow = styled.div`
  display: flex;
  align-items: center;
  padding: 0 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
`;

export const Tab = styled.button<{ $active: boolean; $variant: 'analysis' | 'suggestions' | 'recommendation' }>`
  flex: 1;
  padding: 12px 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: all 0.25s var(--ease-out-expo);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  position: relative;
  font-family: var(--font-body);
  font-size: 0.8rem;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  color: ${({ $active }) => ($active ? '#fff' : 'rgba(255, 255, 255, 0.4)')};

  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 12px;
    right: 12px;
    height: 2px;
    border-radius: 2px 2px 0 0;
    background: ${({ $active, $variant }) => {
      if (!$active) return 'transparent';
      if ($variant === 'analysis') return '#10b981';
      if ($variant === 'suggestions') return '#f59e0b';
      return 'var(--fox-primary)';
    }};
    transition: all 0.25s var(--ease-out-expo);
  }

  svg {
    width: 14px;
    height: 14px;
    opacity: ${({ $active }) => ($active ? 1 : 0.35)};
    color: ${({ $active, $variant }) => {
      if (!$active) return 'inherit';
      if ($variant === 'analysis') return '#10b981';
      if ($variant === 'suggestions') return '#f59e0b';
      return 'var(--fox-primary)';
    }};
    transition: all 0.25s var(--ease-out-expo);
  }

  &:hover {
    color: rgba(255, 255, 255, 0.7);
    svg { opacity: 0.7; }
    &::after {
      background: ${({ $active, $variant }) => {
        if ($active) {
          if ($variant === 'analysis') return '#10b981';
          if ($variant === 'suggestions') return '#f59e0b';
          return 'var(--fox-primary)';
        }
        return 'rgba(255, 255, 255, 0.06)';
      }};
    }
  }
`;

export const TabBadge = styled.span<{ $variant: 'analysis' | 'suggestions' | 'recommendation' }>`
  padding: 1px 6px;
  border-radius: 100px;
  font-size: 0.65rem;
  font-weight: 600;
  background: ${({ $variant }) => {
    if ($variant === 'analysis') return 'rgba(16, 185, 129, 0.1)';
    if ($variant === 'suggestions') return 'rgba(245, 158, 11, 0.1)';
    return 'rgba(255, 85, 0, 0.08)';
  }};
  color: ${({ $variant }) => {
    if ($variant === 'analysis') return '#10b981';
    if ($variant === 'suggestions') return '#f59e0b';
    return 'var(--fox-primary)';
  }};
`;

/* =============================================
   TAB CONTENT
   ============================================= */

export const TabContentWrapper = styled.div`
  overflow: hidden;
  transition: height 0.4s cubic-bezier(0.16, 1, 0.3, 1);
`;

export const TabContent = styled.div`
  padding: 14px 24px 16px;
  animation: ${resultReveal} 0.3s var(--ease-out-expo) forwards;
`;

export const AnalysisText = styled.p<{ $warning?: boolean }>`
  font-family: var(--font-body);
  font-size: 0.86rem;
  line-height: 1.7;
  color: ${({ $warning }) => ($warning ? 'rgba(239, 68, 68, 0.85)' : 'rgba(255, 255, 255, 0.75)')};
  margin: 0;
  white-space: pre-wrap;
`;

export const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export const SuggestionItem = styled.div<{ $index?: number }>`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 10px;
  background: rgba(245, 158, 11, 0.04);
  transition: background 0.2s ease;
  animation: ${itemSlideIn} 0.35s var(--ease-out-expo) forwards;
  animation-delay: ${({ $index }) => (($index ?? 0) * 0.04)}s;
  opacity: 0;

  &:hover {
    background: rgba(245, 158, 11, 0.07);
  }
`;

export const SuggestionNumber = styled.span`
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  border-radius: 6px;
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
  font-family: var(--font-display);
  font-size: 0.7rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1px;
`;

export const SuggestionText = styled.p`
  font-size: 0.84rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.55;
  margin: 0;
`;

/* =============================================
   FOOTER
   ============================================= */

export const Footer = styled.div`
  padding: 14px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

export const BtnPrimary = styled.button<{ $disabled?: boolean }>`
  flex: 1;
  padding: 12px 20px;
  background: linear-gradient(135deg, #FF6A1A 0%, #FF4800 100%);
  border: none;
  border-radius: 12px;
  color: #fff;
  font-family: var(--font-body);
  font-size: 0.84rem;
  font-weight: 600;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.3s var(--ease-out-expo);
  opacity: ${({ $disabled }) => ($disabled ? 0.3 : 1)};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(
    135deg,
    #FF5500 0%,
    #FF6A1A 30%,
    #FF8A3D 50%,
    #FF6A1A 70%,
    #FF5500 100%
  );
  background-size: 250% 100%;
  animation: ${gradientShift} 5s ease infinite;
  box-shadow: 0 2px 12px rgba(255, 72, 0, 0.2);

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(255, 72, 0, 0.3);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  @media (max-width: 640px) {
    width: 100%;
  }
`;

export const BtnOutline = styled.button`
  flex: 1;
  padding: 12px 20px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.5);
  font-family: var(--font-body);
  font-size: 0.84rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.35s var(--ease-out-expo);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.04);
    border-color: rgba(255, 255, 255, 0.14);
  }

  @media (max-width: 640px) {
    width: 100%;
  }
`;
