import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  0% { opacity: 0; transform: translateY(8px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const travelBorder = keyframes`
  0%, 100% { top: 0; left: 0; }
  45% { top: 0; left: 100%; }
  50% { top: 100%; left: 100%; }
  95% { top: 100%; left: 0; }
`;

const travelBorderReverse = keyframes`
  0%, 100% { top: 0; left: 100%; }
  45% { top: 0; left: 0; }
  50% { top: 100%; left: 0; }
  95% { top: 100%; left: 100%; }
`;

/* =============================================
   SINGLE-VIEW CONTAINER (used in new tab layout)
   ============================================= */

/* Fills the ReferralTabContent and makes the card inside stretch to height */
export const ReferralViewContainer = styled.div`
  padding: 14px;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;

  > * {
    flex: 1;
  }
`;

/* =============================================
   OUTER BLOCK — container that holds 3 cards
   ============================================= */

export const ReferralContainer = styled.div`
  width: 100%;
`;

export const ReferralBlock = styled.div`
  background: transparent;
  border: none;
  border-radius: 18px;
  padding: clamp(0.5rem, 1.5vw, 0.75rem);
  position: relative;

  @media (max-width: 640px) {
    border-radius: 14px;
  }
`;

export const ReferralGrid = styled.div<{ $columns?: number }>`
  display: grid;
  grid-template-columns: ${({ $columns }) =>
    $columns === 2 ? '1.2fr 1fr' : '1.2fr 1fr 0.9fr'};
  gap: 10px;
  width: 100%;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 10px;
  }
`;

/* =============================================
   INDIVIDUAL CARDS — real cards inside the block
   ============================================= */

const cardBase = `
  background: #fafafa;
  border: 1px solid #e5e5e5;
  border-radius: 14px;
  padding: clamp(0.875rem, 2vw, 1.125rem) clamp(0.875rem, 2.5vw, 1.25rem);
  display: flex;
  flex-direction: column;
  gap: clamp(0.5rem, 1vw, 0.625rem);
  box-sizing: border-box;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    border-color: #d4d4d4;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  }
`;

export const ReferralCard = styled.div`
  ${cardBase}
  animation: ${fadeIn} 0.45s ease forwards;
`;

export const MetricsCard = styled.div`
  ${cardBase}
  justify-content: center;
  animation: ${fadeIn} 0.45s ease 0.08s forwards;
  opacity: 0;
`;

export const PixCard = styled.div`
  ${cardBase}
  justify-content: center;
  animation: ${fadeIn} 0.45s ease 0.14s forwards;
  opacity: 0;
`;

/* =============================================
   CARD HEADER (title + icon)
   ============================================= */

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 2px;
`;

export const CardIconBox = styled.div<{ $color?: string }>`
  width: 30px;
  height: 30px;
  border-radius: 9px;
  background: ${({ $color }) =>
    $color
      ? `rgba(${$color}, 0.1)`
      : 'linear-gradient(135deg, rgba(255, 85, 0, 0.12) 0%, rgba(255, 85, 0, 0.04) 100%)'};
  border: 1px solid ${({ $color }) =>
    $color ? `rgba(${$color}, 0.18)` : 'rgba(255, 85, 0, 0.15)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $color }) => ($color ? `rgb(${$color})` : 'var(--fox-primary)')};
  flex-shrink: 0;

  svg {
    width: 14px;
    height: 14px;
  }
`;

export const CardTitle = styled.h3`
  font-family: var(--font-display);
  font-size: 0.92rem;
  font-weight: 650;
  color: #171717;
  letter-spacing: -0.01em;
  margin: 0;
`;

/* =============================================
   REFERRAL TITLE (legacy, kept for loading state)
   ============================================= */

export const ReferralTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #171717;
  letter-spacing: -0.01em;

  svg {
    color: var(--fox-primary);
  }
`;

export const ReferralMessage = styled.p`
  font-family: var(--font-body);
  color: #525252;
  font-size: 0.82rem;
  text-align: center;
  margin: 0;
  padding: 12px 0;
`;

/* =============================================
   CARD 1 — Indique e Ganhe
   ============================================= */

export const ReferralDescription = styled.p`
  color: #525252;
  font-family: var(--font-body);
  font-size: 0.78rem;
  line-height: 1.5;
  margin: -2px 0 0 0;
`;

export const ReferralSection = styled.div`
  margin-bottom: 0;
`;

export const ReferralLabel = styled.label`
  display: block;
  font-family: var(--font-display);
  font-size: 0.7rem;
  font-weight: 600;
  color: #525252;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

export const ReferralCodeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fafafa;
  border: 1px solid #e5e5e5;
  border-radius: 9px;
  padding: 8px 12px;
  position: relative;
  overflow: hidden;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;

  &:hover {
    border-color: rgba(255, 85, 0, 0.25);
    box-shadow: 0 0 0 1px rgba(255, 85, 0, 0.08);
  }
`;

export const ReferralCode = styled.span`
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.85rem;
  font-weight: 600;
  color: #ea580c;
  flex: 1;
  letter-spacing: 1.5px;
`;

export const ReferralLinkContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fafafa;
  border: 1px solid #e5e5e5;
  border-radius: 9px;
  padding: 8px 12px;
  position: relative;
  overflow: hidden;
  transition: border-color 0.25s ease;

  &:hover {
    border-color: #d4d4d4;
  }
`;

export const ReferralLink = styled.span`
  font-family: var(--font-body);
  font-size: 0.76rem;
  color: #171717;
  flex: 1;
  word-break: break-all;
  line-height: 1.45;
`;

export const CopyButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 85, 0, 0.08);
  color: var(--fox-primary);
  border: 1px solid rgba(255, 85, 0, 0.15);
  border-radius: 7px;
  padding: 5px;
  cursor: pointer;
  transition: all 0.25s var(--ease-out-expo);
  min-width: 26px;
  height: 26px;
  flex-shrink: 0;

  &:hover {
    background: rgba(255, 85, 0, 0.16);
    border-color: rgba(255, 85, 0, 0.3);
    transform: scale(1.06);
  }

  &:active {
    transform: scale(0.94);
  }
`;

export const ReferralBalance = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(16, 185, 129, 0.08);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 9px;
  padding: 8px 12px;
  margin-top: auto;
`;

export const BalanceIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  background: rgba(16, 185, 129, 0.15);
  border-radius: 7px;
  color: #10b981;
  flex-shrink: 0;
`;

export const BalanceLabel = styled.span`
  font-family: var(--font-body);
  font-size: 0.72rem;
  font-weight: 500;
  color: #525252;
  flex: 1;
`;

export const BalanceAmount = styled.span`
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 700;
  color: #059669;
  letter-spacing: -0.02em;
`;

export const ReferralInfo = styled.p`
  font-family: var(--font-body);
  font-size: 0.74rem;
  color: #737373;
  line-height: 1.55;
  margin: auto 0 0 0;
  padding-top: 10px;
  border-top: 1px solid #e5e5e5;
  letter-spacing: 0.01em;
`;

/* =============================================
   CARD 2 — Metrics
   ============================================= */

export const ReferralMetrics = styled.div``;

export const MetricsTitle = styled.h3`
  font-family: var(--font-display);
  font-size: 0.88rem;
  font-weight: 600;
  color: #171717;
  margin: 0 0 10px 0;
  letter-spacing: -0.01em;
`;

export const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  flex: 1;
`;

export const MetricCard = styled.div`
  background: #fff;
  border-radius: 10px;
  padding: 14px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  border: 1px solid #e5e5e5;
  transition: border-color 0.25s ease;

  &:hover {
    border-color: #d4d4d4;
  }
`;

export const MetricIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: rgba(255, 85, 0, 0.08);
  border-radius: 7px;
  color: var(--fox-primary);
  flex-shrink: 0;
  margin-bottom: 1px;
`;

export const MetricValue = styled.span`
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 700;
  color: #171717;
  letter-spacing: -0.02em;
`;

export const MetricLabel = styled.span`
  font-family: var(--font-body);
  font-size: 0.68rem;
  color: #737373;
  text-align: center;
  line-height: 1.35;
`;

export const MetricsEmpty = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 12px;
  color: #737373;
  font-family: var(--font-body);
  font-size: 0.76rem;
  text-align: center;
  gap: 8px;
  flex: 1;

  svg {
    opacity: 0.5;
  }
`;

/* =============================================
   CARD 3 — PIX + Balance
   ============================================= */

export const PixSection = styled.div``;

export const PixKeyDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fafafa;
  border-radius: 9px;
  padding: 8px 12px;
  border: 1px solid #e5e5e5;
`;

export const PixDivider = styled.div`
  height: 1px;
  background: #e5e5e5;
  margin: 2px 0;
`;

export const PixInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e5e5e5;
  border-radius: 9px;
  font-family: var(--font-body);
  font-size: 0.76rem;
  background: #fafafa;
  color: #171717;
  outline: none;
  transition: all 0.25s var(--ease-out-expo);
  box-sizing: border-box;

  &::placeholder {
    color: #a3a3a3;
  }

  &:focus {
    border-color: rgba(255, 85, 0, 0.4);
    background: #fff;
    box-shadow: 0 0 0 2px rgba(255, 85, 0, 0.08);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

export const PixButtonRow = styled.div`
  display: flex;
  gap: 6px;
`;

export const PixButton = styled.button`
  width: 100%;
  padding: 8px 12px;
  background: ${props => props.disabled ? '#f5f5f5' : 'linear-gradient(135deg, #FF6A1A 0%, #FF4800 100%)'};
  color: ${props => props.disabled ? '#a3a3a3' : '#fff'};
  border: ${props => props.disabled ? '1px solid #e5e5e5' : 'none'};
  border-radius: 9px;
  font-family: var(--font-body);
  font-size: 0.76rem;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.25s var(--ease-out-expo);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 3px 12px rgba(255, 72, 0, 0.25);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

export const PixCancelButton = styled.button`
  width: 100%;
  padding: 8px 12px;
  background: #fafafa;
  color: #525252;
  border: 1px solid #e5e5e5;
  border-radius: 9px;
  font-family: var(--font-body);
  font-size: 0.76rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s var(--ease-out-expo);

  &:hover:not(:disabled) {
    background: #f5f5f5;
    border-color: #d4d4d4;
    color: #171717;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

export const PixInfo = styled.p`
  font-family: var(--font-body);
  font-size: 0.7rem;
  color: #737373;
  margin: 0;
  line-height: 1.5;
`;

export const PixError = styled.p`
  font-family: var(--font-body);
  font-size: 0.7rem;
  color: #ef4444;
  margin: 0;
`;

export const PixSuccess = styled.p`
  font-family: var(--font-body);
  font-size: 0.7rem;
  color: #10b981;
  margin: 0;
`;
