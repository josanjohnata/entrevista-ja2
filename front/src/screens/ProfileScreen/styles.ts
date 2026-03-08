import styled, { keyframes, css } from 'styled-components';

/* =============================================
   KEYFRAMES
   ============================================= */

const shine = keyframes`
  0% { left: -100%; }
  100% { left: 200%; }
`;

const clearPulse = keyframes`
  0% { opacity: 1; }
  30% { opacity: 0.4; transform: scale(0.995); }
  100% { opacity: 1; transform: scale(1); }
`;

const tabFadeIn = keyframes`
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const floatUp = keyframes`
  0% { opacity: 0; transform: translateY(18px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const avatarOrbitSpin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const avatarBreathe = keyframes`
  0%, 100% {
    box-shadow: 0 0 0 3px rgba(255, 85, 0, 0.05);
  }
  50% {
    box-shadow: 0 0 0 3px rgba(255, 85, 0, 0.1);
  }
`;

const badgePulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
  50% { box-shadow: 0 0 0 4px rgba(16, 185, 129, 0); }
`;

/* =============================================
   PAGE LAYOUT — two-column grid
   ============================================= */

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 80px);
  min-height: calc(100dvh - 80px);
  padding: clamp(1.5rem, 2.5vw, 2rem) 0 clamp(2rem, 3vw, 3rem);
  box-sizing: border-box;
`;

/* Two-column page grid: left (profile + referral) | right (form) */
export const PageGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  align-items: start;
  gap: clamp(14px, 1.5vw, 24px);
  padding: 0 clamp(12px, 2vw, 24px);
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;

  @media (min-width: 1024px) {
    grid-template-columns: clamp(340px, 30vw, 420px) 1fr;
  }

  @media (min-width: 2560px) {
    max-width: 1800px;
  }
`;

/* Left column: stacks ProfileHero + ReferralPanel */
export const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;

  @media (max-width: 1024px) {
    height: auto;
  }
`;

/* Referral panel — fills remaining left-column height */
export const ReferralPanel = styled.div`
  flex: 0 1 auto;
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: ${floatUp} 0.5s var(--ease-out-expo) 0.15s forwards;
  opacity: 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 20%;
    right: 20%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 85, 0, 0.2), transparent);
    z-index: 1;
  }

  @media (max-width: 1024px) {
    flex: none;
  }
`;

/* Tab bar inside the referral panel (replaces the header title) */
export const ReferralTabBar = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e5e5e5;
  background: #fafafa;
  flex-shrink: 0;
  padding: 0 12px;
`;

export const ReferralTab = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 12px 8px;
  border: none;
  background: transparent;
  font-family: var(--font-body);
  font-size: 0.8rem;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  color: ${({ $active }) => ($active ? '#171717' : '#737373')};
  cursor: pointer;
  transition: all 0.3s var(--ease-out-expo);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  position: relative;
  white-space: nowrap;

  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 8px;
    right: 8px;
    height: 2px;
    border-radius: 2px 2px 0 0;
    background: ${({ $active }) => ($active ? 'var(--fox-primary)' : 'transparent')};
    transition: all 0.3s var(--ease-out-expo);
    box-shadow: ${({ $active }) => ($active ? '0 0 8px rgba(255, 85, 0, 0.2)' : 'none')};
  }

  svg {
    width: 13px;
    height: 13px;
    opacity: ${({ $active }) => ($active ? 1 : 0.5)};
    color: ${({ $active }) => ($active ? 'var(--fox-primary)' : 'inherit')};
    flex-shrink: 0;
    transition: all 0.3s var(--ease-out-expo);
  }

  &:hover {
    color: #171717;
    svg { opacity: 0.8; }
  }
`;

/* Scrollable content area inside referral panel */
export const ReferralTabContent = styled.div`
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #d4d4d4 transparent;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: #d4d4d4; border-radius: 2px; }
  &::-webkit-scrollbar-thumb:hover { background: rgba(255, 85, 0, 0.4); }
`;

/* =============================================
   PROFILE SIDEBAR
   ============================================= */

export const ProfileHero = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: clamp(16px, 2vw, 24px) clamp(16px, 1.5vw, 20px) clamp(16px, 1.5vw, 20px);
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 20px;
  transition: border-color 0.4s var(--ease-out-expo), box-shadow 0.4s var(--ease-out-expo);
  animation: ${floatUp} 0.5s var(--ease-out-expo) 0.1s forwards;
  opacity: 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 20%;
    right: 20%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 85, 0, 0.25), transparent);
  }

  &:hover {
    border-color: rgba(255, 85, 0, 0.2);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06), 0 0 24px rgba(255, 85, 0, 0.04);
  }

  @media (max-width: 1024px) {
    position: static;
    flex-direction: row;
    align-items: center;
    gap: 16px;
    align-self: auto;

    &::before { left: 10%; right: 10%; }
  }

  @media (max-width: 640px) {
    flex-direction: column;
    text-align: center;
  }
`;

export const ProfileHeroLeft = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
  width: 100%;

  @media (max-width: 1024px) {
    flex-direction: row;
    text-align: left;
    gap: 14px;
    flex: 1;
    min-width: 0;
    width: auto;
  }

  @media (max-width: 640px) {
    flex-direction: column;
    text-align: center;
  }
`;

export const AvatarWrapper = styled.div`
  position: relative;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  &::after {
    content: '';
    position: absolute;
    width: 88px;
    height: 88px;
    border-radius: 50%;
    border: 1px solid transparent;
    border-top-color: rgba(255, 85, 0, 0.18);
    border-right-color: rgba(255, 85, 0, 0.05);
    animation: ${avatarOrbitSpin} 4s linear infinite;
    pointer-events: none;
  }

  @media (max-width: 1024px) {
    &::after {
      width: 72px;
      height: 72px;
    }
  }
`;

export const Avatar = styled.img`
  width: 68px;
  height: 68px;
  border-radius: 50%;
  border: 2px solid rgba(255, 85, 0, 0.25);
  object-fit: cover;
  transition: border-color 0.4s ease;
  animation: ${avatarBreathe} 3.5s ease-in-out infinite;
  position: relative;
  z-index: 1;

  @media (max-width: 1024px) {
    width: 54px;
    height: 54px;
  }
`;

export const AvatarBadge = styled.div`
  position: absolute;
  bottom: 1px;
  right: 1px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #10b981;
  border: 2px solid #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;

  svg {
    width: 9px;
    height: 9px;
    color: #fff;
    stroke-width: 3;
  }
`;

export const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
  align-items: center;
  width: 100%;

  @media (max-width: 1024px) {
    align-items: flex-start;
    width: auto;
  }

  @media (max-width: 640px) {
    align-items: center;
  }
`;

export const UserName = styled.h2`
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 700;
  color: #171717;
  letter-spacing: -0.025em;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
`;

export const UserMeta = styled.p`
  font-family: var(--font-body);
  font-size: 0.78rem;
  color: #737373;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
  line-height: 1.4;

  @media (max-width: 1024px) {
    font-size: 0.8rem;
  }
`;

export const SocialLinks = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 6px;

  @media (max-width: 1024px) {
    justify-content: flex-start;
    margin-top: 4px;
  }

  @media (max-width: 640px) {
    justify-content: center;
  }
`;

export const SocialLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: #fafafa;
  border: 1px solid #e5e5e5;
  color: #525252;
  transition: all 0.3s var(--ease-out-expo);
  text-decoration: none;

  svg {
    width: 14px;
    height: 14px;
  }

  &:hover {
    color: var(--fox-primary);
    background: rgba(255, 85, 0, 0.08);
    border-color: rgba(255, 85, 0, 0.2);
    transform: translateY(-1px);
  }
`;

export const ProfileHeroActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  padding-top: 12px;
  border-top: 1px solid #e5e5e5;

  @media (max-width: 1024px) {
    flex-direction: row;
    width: auto;
    padding-top: 0;
    border-top: none;
    flex-shrink: 0;
  }

  @media (max-width: 640px) {
    flex-direction: column;
    width: 100%;
  }
`;

export const ActionBtn = styled.button`
  padding: 8px 14px;
  background: #fafafa;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  color: #525252;
  font-family: var(--font-body);
  font-size: 0.78rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s var(--ease-out-expo);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  white-space: nowrap;

  svg {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
    opacity: 0.6;
    transition: all 0.3s ease;
  }

  &:hover:not(:disabled) {
    color: #171717;
    background: #f5f5f5;
    border-color: #d4d4d4;
    svg { opacity: 1; color: var(--fox-primary); }
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`;

export const CancelActionBtn = styled(ActionBtn)`
  border-color: rgba(239, 68, 68, 0.25);
  color: #dc2626;

  svg { color: rgba(239, 68, 68, 0.6); }

  &:hover:not(:disabled) {
    color: #ef4444;
    background: rgba(239, 68, 68, 0.06);
    border-color: rgba(239, 68, 68, 0.35);
    svg { color: #ef4444; opacity: 1; }
  }
`;

/* =============================================
   FORM PANEL
   ============================================= */

export const FormPanel = styled.div`
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 20px;
  overflow: hidden;
  animation: ${floatUp} 0.6s var(--ease-out-expo) 0.18s forwards;
  opacity: 0;
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 15%;
    right: 15%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 85, 0, 0.2), transparent);
    z-index: 1;
  }
`;

export const FormPanelHeader = styled.div`
  padding: clamp(14px, 1.5vw, 18px) clamp(14px, 2vw, 24px);
  border-bottom: 1px solid #e5e5e5;
  display: flex;
  align-items: center;
  gap: 12px;
  background: #fafafa;
  flex-shrink: 0;
`;

export const FormPanelIcon = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(255, 85, 0, 0.12) 0%, rgba(255, 85, 0, 0.04) 100%);
  border: 1px solid rgba(255, 85, 0, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--fox-primary);
  flex-shrink: 0;
`;

export const FormPanelTitleGroup = styled.div`
  flex: 1;

  h2 {
    font-family: var(--font-display);
    font-size: 1.08rem;
    font-weight: 650;
    color: #171717;
    letter-spacing: -0.015em;
  }

  p {
    font-family: var(--font-body);
    font-size: 0.78rem;
    color: #737373;
    margin-top: 2px;
  }
`;

/* =============================================
   TAB ROW
   ============================================= */

export const TabRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  padding: 0 clamp(10px, 1.5vw, 16px);
  border-bottom: 1px solid #e5e5e5;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  background: #fafafa;
  flex-shrink: 0;

  &::-webkit-scrollbar { display: none; }
`;

export const TabButtonText = styled.span`
  @media (max-width: 768px) {
    display: none;
  }
`;

export const TabButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 11px 8px;
  border: none;
  border-radius: 0;
  font-family: var(--font-body);
  font-size: 0.8rem;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  color: ${({ $active }) => ($active ? '#171717' : '#737373')};
  background: transparent;
  cursor: pointer;
  transition: all 0.3s var(--ease-out-expo);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  position: relative;
  white-space: nowrap;

  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 8px;
    right: 8px;
    height: 2px;
    border-radius: 2px 2px 0 0;
    background: ${({ $active }) => ($active ? 'var(--fox-primary)' : 'transparent')};
    transition: all 0.3s var(--ease-out-expo);
    box-shadow: ${({ $active }) => ($active ? '0 0 8px rgba(255, 85, 0, 0.2)' : 'none')};
  }

  svg {
    width: 15px;
    height: 15px;
    opacity: ${({ $active }) => ($active ? 1 : 0.5)};
    color: ${({ $active }) => ($active ? 'var(--fox-primary)' : 'inherit')};
    transition: all 0.3s var(--ease-out-expo);
    flex-shrink: 0;
  }

  &:hover {
    color: #171717;
    svg { opacity: 0.8; }
    &::after {
      background: ${({ $active }) => ($active ? 'var(--fox-primary)' : '#e5e5e5')};
    }
  }

  @media (max-width: 768px) {
    padding: 14px 12px;
    min-width: 44px;
  }
`;

/* =============================================
   FORM BODY / ELEMENTS
   ============================================= */

export const FormBody = styled.div<{ $cleared?: boolean }>`
  padding: clamp(16px, 2vw, 28px) clamp(14px, 2vw, 24px) clamp(18px, 2.5vw, 32px);
  display: flex;
  flex-direction: column;
  gap: 20px;
  animation: ${tabFadeIn} 0.35s var(--ease-out-expo) forwards;

  ${({ $cleared }) => $cleared && css`
    animation: ${clearPulse} 0.5s ease forwards;
  `}
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const FormLabel = styled.label`
  font-family: var(--font-body);
  font-size: 0.8rem;
  font-weight: 500;
  color: #525252;
  letter-spacing: 0.01em;
  display: flex;
  align-items: center;
  gap: 6px;

  svg {
    width: 13px;
    height: 13px;
    opacity: 0.6;
  }
`;

export const RequiredDot = styled.span`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--fox-primary);
  flex-shrink: 0;
  opacity: 0.8;
`;

export const FormInput = styled.input<{ $error?: boolean }>`
  width: 100%;
  padding: 12px 16px;
  background: #fafafa;
  border: 1px solid ${({ $error }) => $error ? 'rgba(239, 68, 68, 0.5)' : '#e5e5e5'};
  border-radius: 12px;
  color: #171717;
  font-family: var(--font-body);
  font-size: max(16px, clamp(0.82rem, 0.78rem + 0.25vw, 0.86rem));
  outline: none;
  transition: all 0.3s var(--ease-out-expo);
  box-sizing: border-box;

  &::placeholder { color: #a3a3a3; }

  &:hover:not(:focus):not(:disabled) {
    border-color: #d4d4d4;
    background: #f5f5f5;
  }

  &:focus {
    border-color: rgba(255, 85, 0, 0.5);
    background: #fff;
    box-shadow: 0 0 0 3px rgba(255, 85, 0, 0.08);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const TextareaWrapper = styled.div`
  position: relative;
  display: flex;
  min-height: 200px;
`;

export const FormTextarea = styled.textarea<{ $error?: boolean; $minHeight?: string }>`
  width: 100%;
  padding: 14px 16px;
  padding-right: 22px;
  background: #fafafa;
  border: 1px solid ${({ $error }) => $error ? 'rgba(239, 68, 68, 0.5)' : '#e5e5e5'};
  border-radius: 12px;
  color: #171717;
  font-family: var(--font-body);
  font-size: max(16px, clamp(0.82rem, 0.78rem + 0.25vw, 0.86rem));
  line-height: 1.65;
  outline: none;
  transition: border-color 0.3s var(--ease-out-expo), background 0.3s var(--ease-out-expo), box-shadow 0.3s var(--ease-out-expo);
  box-sizing: border-box;
  resize: none;
  min-height: ${({ $minHeight }) => $minHeight || '200px'};
  flex: 1;
  overflow-y: scroll;

  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar { display: none; }

  &::placeholder { color: #a3a3a3; }

  &:hover:not(:focus):not(:disabled) {
    border-color: #d4d4d4;
    background: #f5f5f5;
  }

  &:focus {
    border-color: rgba(255, 85, 0, 0.5);
    background: #fff;
    box-shadow: 0 0 0 3px rgba(255, 85, 0, 0.08);
  }

  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

export const ScrollTrack = styled.div`
  position: absolute;
  top: 10px;
  right: 5px;
  bottom: 10px;
  width: 4px;
  border-radius: 100px;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;

  ${TextareaWrapper}:hover & {
    opacity: 1;
  }
`;

export const ScrollThumb = styled.div<{ $top: number; $height: number }>`
  position: absolute;
  top: ${({ $top }) => $top}%;
  height: ${({ $height }) => $height}%;
  width: 100%;
  min-height: 24px;
  border-radius: 100px;
  background: #d4d4d4;
  transition: background 0.2s ease;
  pointer-events: auto;
  cursor: grab;

  &:hover { background: #a3a3a3; }
  &:active { background: #737373; cursor: grabbing; }
`;

export const FormSelect = styled.select<{ $error?: boolean }>`
  width: 100%;
  padding: 12px 16px;
  background: #fafafa;
  border: 1px solid ${({ $error }) => $error ? 'rgba(239, 68, 68, 0.5)' : '#e5e5e5'};
  border-radius: 12px;
  color: #171717;
  font-family: var(--font-body);
  font-size: max(16px, clamp(0.82rem, 0.78rem + 0.25vw, 0.86rem));
  outline: none;
  transition: all 0.3s var(--ease-out-expo);
  box-sizing: border-box;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23525252' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10l-5 5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  padding-right: 36px;

  option { background: #fff; color: #171717; }

  &:hover:not(:focus):not(:disabled) {
    border-color: #d4d4d4;
    background-color: #f5f5f5;
  }

  &:focus {
    border-color: rgba(255, 85, 0, 0.5);
    background-color: #fff;
    box-shadow: 0 0 0 3px rgba(255, 85, 0, 0.08);
  }

  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

/* =============================================
   REPEATABLE ITEMS
   ============================================= */

export const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ItemCard = styled.div<{ $index?: number }>`
  background: #fafafa;
  border: 1px solid #e5e5e5;
  border-radius: 16px;
  padding: clamp(14px, 1.5vw, 20px);
  display: flex;
  flex-direction: column;
  gap: 14px;
  transition: all 0.3s var(--ease-out-expo);
  animation: ${tabFadeIn} 0.4s var(--ease-out-expo) forwards;
  animation-delay: ${({ $index }) => (($index ?? 0) * 0.06)}s;
  opacity: 0;

  &:hover { border-color: #d4d4d4; }
`;

export const ItemHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 10px;
  border-bottom: 1px solid #e5e5e5;
  gap: 12px;
`;

export const ItemTitle = styled.span`
  font-family: var(--font-display);
  font-size: 0.9rem;
  font-weight: 600;
  color: #171717;
  letter-spacing: -0.01em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
`;

export const RemoveButton = styled.button`
  padding: 5px 10px;
  background: transparent;
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  color: #dc2626;
  font-family: var(--font-body);
  font-size: 0.72rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s var(--ease-out-expo);
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;

  svg { width: 12px; height: 12px; }

  &:hover {
    background: rgba(239, 68, 68, 0.08);
    border-color: rgba(239, 68, 68, 0.5);
    color: #ef4444;
  }
`;

export const AddItemButton = styled.button`
  width: 100%;
  padding: 14px;
  background: rgba(255, 85, 0, 0.04);
  border: 1px dashed rgba(255, 85, 0, 0.3);
  border-radius: 14px;
  color: #ea580c;
  font-family: var(--font-body);
  font-size: 0.82rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s var(--ease-out-expo);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  svg { width: 15px; height: 15px; }

  &:hover:not(:disabled) {
    background: rgba(255, 85, 0, 0.08);
    border-color: rgba(255, 85, 0, 0.5);
    color: var(--fox-primary);
    transform: translateY(-1px);
  }

  &:disabled { opacity: 0.3; cursor: not-allowed; }
`;

/* =============================================
   TAGS
   ============================================= */

export const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const TagItem = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: #fafafa;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  font-family: var(--font-body);
  font-size: 0.78rem;
  font-weight: 500;
  color: #525252;
  letter-spacing: 0.01em;
  transition: all 0.25s var(--ease-out-expo);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 8px;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: var(--fox-primary);
    opacity: 0.6;
    transition: opacity 0.25s ease;
  }

  padding-left: 20px;

  &:hover {
    background: rgba(255, 85, 0, 0.06);
    border-color: rgba(255, 85, 0, 0.25);
    color: #171717;
    &::before { opacity: 1; }
  }
`;

export const TagRemoveBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #e5e5e5;
  border: none;
  color: #737373;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;

  svg { width: 10px; height: 10px; }

  &:hover { background: rgba(239, 68, 68, 0.2); color: #fff; }
`;

export const TagInputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
`;

export const TagInput = styled.input`
  flex: 1;
  padding: 9px 16px;
  background: #fafafa;
  border: 1px solid #e5e5e5;
  border-radius: 100px;
  color: #171717;
  font-family: var(--font-body);
  font-size: 0.82rem;
  outline: none;
  transition: all 0.3s var(--ease-out-expo);
  max-width: 280px;

  &::placeholder { color: #a3a3a3; }

  &:focus {
    border-color: rgba(255, 85, 0, 0.4);
    background: #fff;
    box-shadow: 0 0 0 3px rgba(255, 85, 0, 0.08);
  }

  &:disabled { opacity: 0.4; cursor: not-allowed; }
`;

export const TagAddBtn = styled.button`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: rgba(255, 85, 0, 0.08);
  border: 1px solid rgba(255, 85, 0, 0.25);
  color: var(--fox-primary);
  cursor: pointer;
  transition: all 0.3s var(--ease-out-expo);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg { width: 14px; height: 14px; }

  &:hover:not(:disabled) {
    background: rgba(255, 85, 0, 0.15);
    border-color: rgba(255, 85, 0, 0.4);
    transform: rotate(90deg) scale(1.05);
  }

  &:disabled { opacity: 0.3; cursor: not-allowed; }
`;

/* =============================================
   CHECKBOX
   ============================================= */

export const CheckboxRow = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-family: var(--font-body);
  font-size: 0.82rem;
  color: #525252;
  user-select: none;
  padding: 2px 0;

  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: var(--fox-primary);
    cursor: pointer;
  }
`;

/* =============================================
   SECTION DIVIDER
   ============================================= */

export const SectionDivider = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 10px 0;

  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e5e5e5;
  }
`;

export const SectionLabel = styled.span`
  font-family: var(--font-display);
  font-size: clamp(0.78rem, 0.74rem + 0.2vw, 0.82rem);
  font-weight: 600;
  color: #737373;
  white-space: nowrap;
`;

/* =============================================
   FORM FOOTER
   ============================================= */

export const FormFooter = styled.div`
  padding: clamp(14px, 1.5vw, 16px) clamp(14px, 2vw, 24px) clamp(16px, 1.5vw, 18px);
  border-top: 1px solid #e5e5e5;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

export const BtnPrimary = styled.button<{ $disabled?: boolean }>`
  flex: 1;
  padding: 13px 24px;
  background: linear-gradient(135deg, #FF6A1A 0%, #FF4800 100%);
  border: none;
  border-radius: 12px;
  color: #fff;
  font-family: var(--font-body);
  font-size: 0.86rem;
  font-weight: 600;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.3s var(--ease-out-expo);
  opacity: ${({ $disabled }) => ($disabled ? 0.3 : 1)};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(255, 72, 0, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.12);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 50%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: none;
  }

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    background: linear-gradient(135deg, #FF7A2E 0%, #FF5500 100%);
    box-shadow: 0 8px 24px rgba(255, 72, 0, 0.3),
                0 2px 8px rgba(255, 72, 0, 0.15),
                inset 0 1px 0 rgba(255, 255, 255, 0.15);
  }

  &:hover:not(:disabled)::before {
    animation: ${shine} 0.8s ease forwards;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 4px 16px rgba(255, 72, 0, 0.25);
  }

  @media (max-width: 640px) { width: 100%; }
`;

export const BtnOutline = styled.button`
  flex: 1;
  padding: 11px 20px;
  background: transparent;
  border: 1px solid #e5e5e5;
  border-radius: 13px;
  color: #525252;
  font-family: var(--font-body);
  font-size: 0.86rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.35s var(--ease-out-expo);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover:not(:disabled) {
    color: #171717;
    background: #f5f5f5;
    border-color: #d4d4d4;
  }

  &:disabled { opacity: 0.35; cursor: not-allowed; }

  @media (max-width: 640px) { width: 100%; }
`;

export const Spinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid #e5e5e5;
  border-top-color: var(--fox-primary);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  @keyframes spin { to { transform: rotate(360deg); } }
`;

export const LoadingContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

/* =============================================
   LINKEDIN IMPORT MODAL
   ============================================= */

export const ModalOverlay = styled.div<{ $closing?: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(16px, 3vw, 24px);
  background: rgba(0, 0, 0, 0.65);
  animation: ${({ $closing }) => ($closing ? 'modalOverlayOut' : 'modalOverlayIn')} 0.3s ease forwards;
`;

export const ModalPanel = styled.div<{ $closing?: boolean }>`
  width: 100%;
  max-width: clamp(320px, 85vw, 500px);
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 22px;
  overflow: hidden;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.12), 0 0 24px rgba(255, 85, 0, 0.04);
  animation: ${({ $closing }) => ($closing ? 'modalContentOut' : 'modalContentIn')} 0.3s ease forwards;
`;

export const ModalHeader = styled.div`
  padding: 18px 24px;
  border-bottom: 1px solid #e5e5e5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fafafa;

  h3 {
    font-family: var(--font-display);
    font-size: 1.05rem;
    font-weight: 600;
    color: #171717;
    margin: 0;
  }
`;

export const ModalCloseButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 10px;
  border: 1px solid #e5e5e5;
  background: #fafafa;
  color: #525252;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s var(--ease-out-expo);

  &:hover { color: #171717; background: #f5f5f5; border-color: #d4d4d4; }
`;

export const ModalBody = styled.div`
  padding: clamp(16px, 3vw, 24px);

  p {
    font-family: var(--font-body);
    font-size: 0.86rem;
    color: #525252;
    margin: 0 0 16px 0;
    line-height: 1.5;
  }
`;

export const ModalFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 24px;
  border-top: 1px solid #e5e5e5;
`;

/* =============================================
   ALERT / BANNERS
   ============================================= */

export const AlertBanner = styled.div<{ $type?: 'success' | 'error' }>`
  padding: 14px 20px;
  border-radius: 16px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-family: var(--font-body);
  font-size: 0.84rem;
  line-height: 1.5;
  animation: ${tabFadeIn} 0.35s var(--ease-out-expo) forwards;

  ${({ $type }) => $type === 'success' ? css`
    background: rgba(16, 185, 129, 0.06);
    border: 1px solid rgba(16, 185, 129, 0.12);
    color: rgba(16, 185, 129, 0.9);
  ` : css`
    background: rgba(239, 68, 68, 0.06);
    border: 1px solid rgba(239, 68, 68, 0.12);
    color: rgba(239, 68, 68, 0.9);
  `}

  svg { width: 16px; height: 16px; flex-shrink: 0; margin-top: 2px; }
`;

export const AlertContent = styled.div`
  flex: 1;
`;

export const AlertCloseBtn = styled.button`
  background: none;
  border: none;
  color: inherit;
  opacity: 0.4;
  cursor: pointer;
  padding: 2px;
  transition: opacity 0.2s;
  &:hover { opacity: 1; }
  svg { width: 14px; height: 14px; }
`;

export const FirstAccessBanner = styled.div`
  background: linear-gradient(135deg, rgba(255, 85, 0, 0.08) 0%, rgba(255, 85, 0, 0.03) 100%);
  border: 1px solid rgba(255, 85, 0, 0.2);
  border-radius: 18px;
  padding: 24px;
  animation: ${tabFadeIn} 0.4s var(--ease-out-expo) forwards;

  h3 {
    font-family: var(--font-display);
    font-size: 1.1rem;
    font-weight: 650;
    color: #171717;
    margin: 0 0 6px 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  p {
    font-family: var(--font-body);
    font-size: 0.84rem;
    color: #525252;
    margin: 0;
    line-height: 1.5;
  }
`;

export const FirstAccessActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 14px;
`;

export const AnalysisInfoCard = styled.div`
  background: rgba(16, 185, 129, 0.06);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 16px;
  padding: 20px;
  position: relative;
  animation: ${tabFadeIn} 0.35s var(--ease-out-expo) forwards;

  h4 {
    font-family: var(--font-display);
    font-size: 0.95rem;
    font-weight: 600;
    color: #059669;
    margin: 0 0 12px 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .auto-applied {
    padding: 14px;
    background: #fafafa;
    border-radius: 12px;
    margin-bottom: 12px;
    border: 1px solid #e5e5e5;
  }

  .keywords {
    margin-bottom: 12px;
    strong { display: flex; align-items: center; gap: 6px; font-size: 0.84rem; color: #525252; margin-bottom: 8px; }
    .keyword-list { display: flex; flex-wrap: wrap; gap: 6px; }
    .keyword-tag { padding: 3px 10px; border-radius: 100px; background: rgba(255, 85, 0, 0.08); border: 1px solid rgba(255, 85, 0, 0.2); font-size: 0.78rem; color: #525252; }
  }

  .suggestions {
    strong { display: flex; align-items: center; gap: 6px; font-size: 0.84rem; color: #525252; margin-bottom: 8px; }
    ul { margin: 0; padding-left: 16px; li { font-size: 0.82rem; color: #737373; margin-bottom: 4px; line-height: 1.5; } }
  }

  .close-btn {
    position: absolute; top: 12px; right: 12px; background: none; border: none; color: #737373; cursor: pointer; padding: 4px; transition: color 0.2s;
    &:hover { color: #171717; }
  }
`;

/* =============================================
   EMPTY STATE
   ============================================= */

const emptyFloat = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
`;

const emptyPulseRing = keyframes`
  0% { transform: scale(0.8); opacity: 0.5; }
  50% { transform: scale(1.15); opacity: 0; }
  100% { transform: scale(0.8); opacity: 0; }
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 20px;
  font-family: var(--font-body);
  animation: ${tabFadeIn} 0.5s var(--ease-out-expo) forwards;

  .empty-icon-wrapper {
    position: relative;
    width: 64px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
    animation: ${emptyFloat} 3.5s ease-in-out infinite;

    &::before {
      content: '';
      position: absolute;
      inset: -4px;
      border-radius: 18px;
      background: linear-gradient(135deg, rgba(255, 85, 0, 0.08) 0%, rgba(255, 85, 0, 0.02) 100%);
      border: 1px solid rgba(255, 85, 0, 0.08);
    }

    &::after {
      content: '';
      position: absolute;
      inset: -12px;
      border-radius: 22px;
      border: 1px solid rgba(255, 85, 0, 0.06);
      animation: ${emptyPulseRing} 3s ease-in-out infinite;
    }
  }

  svg {
    width: 28px;
    height: 28px;
    color: var(--fox-primary);
    opacity: 0.5;
    position: relative;
    z-index: 1;
  }

  p {
    margin: 0;
    font-size: 0.84rem;
    color: #737373;
    letter-spacing: 0.01em;
  }
`;

/* =============================================
   UTILITY
   ============================================= */

export const CenteredMessage = styled.div`
  text-align: center;
  padding: 80px 20px;
  color: #737373;
  font-family: var(--font-body);
  font-size: 0.9rem;
`;

export const ErrorText = styled.span`
  font-family: var(--font-body);
  font-size: 0.74rem;
  color: #ef4444;
`;
