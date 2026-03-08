import styled, { keyframes, css } from 'styled-components';

const shine = keyframes`
  0% { left: -100%; }
  100% { left: 200%; }
`;

const clearPulse = keyframes`
  0% { opacity: 1; }
  30% { opacity: 0.4; transform: scale(0.995); }
  100% { opacity: 1; transform: scale(1); }
`;

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

const panelReveal = keyframes`
  0% { opacity: 0; transform: scale(0.97) translateY(8px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
`;

/* =============================================
   PAGE LAYOUT
   ============================================= */

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 80px);
  min-height: calc(100dvh - 80px);
  padding-bottom: clamp(2rem, 3vw, 3rem);
  background: #f5f5f5;
  color: #171717;
`;

export const PageHeader = styled.div`
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
  padding: clamp(1.5rem, 2.5vw, 2rem) 0 clamp(1rem, 2vw, 1.5rem);
  animation: fadeUp 0.9s var(--ease-out-expo) 0.2s forwards;
  opacity: 0;
  transform: translateY(20px);
  flex-shrink: 0;
`;

export const PageTitle = styled.h1`
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 1.1rem + 2vw, 2.75rem);
  font-weight: 600;
  letter-spacing: 0.01em;
  line-height: 1.08;
  margin-bottom: 12px;
  color: #171717;
`;

export const PageSubtitle = styled.p`
  margin: 0 auto;
  font-size: clamp(0.82rem, 0.78rem + 0.25vw, 0.92rem);
  line-height: 1.5;
  color: #525252;
  max-width: 460px;
`;

export const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 clamp(1rem, 2.5vw, 1.5rem);
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;

  @media (min-width: 2560px) {
    max-width: 1800px;
  }
`;

export const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(1rem, 1.5vw, 1.25rem);
  align-items: start;
  flex: 1;
  min-height: 0;

  @media (min-width: 1024px) {
    grid-template-columns: 280px minmax(0, 1fr);
    gap: 20px;
  }

  @media (min-width: 1536px) {
    grid-template-columns: 320px minmax(0, 1fr);
    gap: 28px;
  }

  @media (min-width: 2560px) {
    grid-template-columns: 360px minmax(0, 1fr);
    gap: 36px;
  }
`;

export const MainColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 0;
`;

/* =============================================
   FORM PANEL
   ============================================= */

export const FormPanel = styled.div`
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 20px;
  overflow: hidden;
  animation: fadeUp 0.8s var(--ease-out-expo) 0.5s forwards;
  opacity: 0;
  transform: translateY(20px);
  position: relative;
  display: flex;
  flex-direction: column;
  align-self: stretch;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
`;

export const FormPanelHeader = styled.div`
  padding: clamp(10px, 1.2vw, 14px) clamp(16px, 2vw, 24px);
  border-bottom: 1px solid #e5e5e5;
  display: flex;
  align-items: center;
  gap: clamp(10px, 1.2vw, 14px);
  background: #fafafa;
`;

export const FormPanelIcon = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 11px;
  background: linear-gradient(135deg, rgba(255, 85, 0, 0.1) 0%, rgba(255, 85, 0, 0.03) 100%);
  border: 1px solid rgba(255, 85, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--fox-primary);
  transition: all 0.4s var(--ease-out-expo);
`;

export const FormPanelTitleGroup = styled.div`
  flex: 1;

  h2 {
    font-family: var(--font-display);
    font-size: 1.05rem;
    font-weight: 600;
    color: #171717;
    letter-spacing: -0.01em;
  }

  p {
    font-size: 0.78rem;
    color: #737373;
    margin-top: 2px;
  }
`;

/* =============================================
   TAB SWITCHER
   ============================================= */

export const TabRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  padding: 0 24px;
  border-bottom: 1px solid #e5e5e5;
`;

export const TabButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 12px 16px;
  border: none;
  border-radius: 0;
  font-family: var(--font-body);
  font-size: 0.84rem;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  color: ${({ $active }) => ($active ? '#171717' : '#737373')};
  background: transparent;
  cursor: pointer;
  transition: all 0.25s var(--ease-out-expo);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 16px;
    right: 16px;
    height: 2px;
    border-radius: 2px 2px 0 0;
    background: ${({ $active }) => ($active ? 'var(--fox-primary)' : 'transparent')};
    transition: all 0.25s var(--ease-out-expo);
  }

  svg {
    opacity: ${({ $active }) => ($active ? 1 : 0.35)};
    color: ${({ $active }) => ($active ? 'var(--fox-primary)' : 'inherit')};
    transition: all 0.25s var(--ease-out-expo);
  }

  &:hover {
    color: #171717;

    svg {
      opacity: 0.7;
    }

    &::after {
      background: ${({ $active }) => ($active ? 'var(--fox-primary)' : 'rgba(255, 85, 0, 0.2)')};
    }
  }
`;

/* =============================================
   FORM BODY
   ============================================= */

export const FormBody = styled.div<{ $cleared?: boolean }>`
  padding: clamp(12px, 1.5vw, 16px) clamp(16px, 2vw, 24px);
  display: flex;
  flex-direction: column;
  gap: clamp(10px, 1.2vw, 14px);
  flex: 1;

  ${({ $cleared }) => $cleared && css`
    animation: ${clearPulse} 0.5s ease forwards;
  `}
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
`;

export const FormLabel = styled.label`
  font-family: var(--font-body);
  font-size: 0.82rem;
  font-weight: 500;
  color: #525252;
  letter-spacing: 0.01em;
`;

export const FormInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  background: #fafafa;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  color: #171717;
  font-family: var(--font-body);
  font-size: 0.86rem;
  outline: none;
  transition: all 0.25s var(--ease-out-expo);
  box-sizing: border-box;

  &::placeholder {
    color: #a3a3a3;
  }

  &:hover:not(:focus) {
    border-color: #d4d4d4;
    background: #f5f5f5;
  }

  &:focus {
    border-color: #0a0a0a;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(10, 10, 10, 0.06);
  }
`;

export const FormTextarea = styled.textarea`
  width: 100%;
  padding: 14px 16px;
  background: #fafafa;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  color: #171717;
  font-family: var(--font-body);
  font-size: 0.86rem;
  line-height: 1.6;
  outline: none;
  transition: border-color 0.25s var(--ease-out-expo),
              background 0.25s var(--ease-out-expo),
              box-shadow 0.25s var(--ease-out-expo);
  box-sizing: border-box;
  resize: none;
  min-height: 200px;

  &::placeholder {
    color: #a3a3a3;
  }

  &:hover:not(:focus) {
    border-color: #d4d4d4;
    background: #f5f5f5;
  }

  &:focus {
    border-color: #0a0a0a;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(10, 10, 10, 0.06);
  }
`;

export const HelpText = styled.p`
  font-size: 0.74rem;
  color: #737373;
  margin: 0;
`;

/* =============================================
   FORM FOOTER (BUTTONS)
   ============================================= */

export const FormFooter = styled.div`
  padding: clamp(10px, 1.2vw, 14px) clamp(16px, 2vw, 24px);
  border-top: 1px solid #e5e5e5;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;

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

  @media (max-width: 640px) {
    width: 100%;
  }
`;

export const BtnOutline = styled.button`
  flex: 1;
  padding: 13px 24px;
  background: transparent;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
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

  svg {
    transition: transform 0.4s var(--ease-out-expo);
  }

  &:hover {
    color: #171717;
    background: #f5f5f5;
    border-color: #d4d4d4;

    svg {
      transform: rotate(-180deg);
    }
  }

  @media (max-width: 640px) {
    width: 100%;
  }
`;

/* =============================================
   INLINE RESULT VIEW (inside FormPanel)
   ============================================= */

export const ResultBody = styled.div`
  animation: ${panelReveal} 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  transform-origin: top center;
`;

/* --- Score Hero (editorial) --- */

export const ScoreHero = styled.div`
  padding: 16px 24px 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const ScoreDisplay = styled.div`
  font-family: var(--font-display);
  font-size: 2.2rem;
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 1;
  color: #171717;
  animation: ${scoreGlow} 0.6s var(--ease-out-expo) 0.2s forwards;
  opacity: 0;
`;

export const ScoreMax = styled.span`
  font-size: 1.1rem;
  font-weight: 500;
  color: #737373;
  letter-spacing: -0.01em;
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
  height: 4px;
  border-radius: 4px;
  background: #e5e5e5;
  overflow: hidden;
`;

export const ProgressBarFill = styled.div<{ $color: string }>`
  height: 100%;
  border-radius: 4px;
  background: ${({ $color }) => $color};
  transition: width 1.2s cubic-bezier(0.4, 0, 0.2, 1) 0.3s;
  box-shadow: 0 0 10px ${({ $color }) => $color}30;
`;

export const ScoreStatusBadge = styled.span<{ $color: string }>`
  padding: 2px 10px;
  border-radius: 100px;
  font-size: 0.65rem;
  font-weight: 600;
  color: ${({ $color }) => $color};
  background: ${({ $color }) => $color}12;
  border: 1px solid ${({ $color }) => $color}20;
  white-space: nowrap;
  flex-shrink: 0;
`;

export const ProfileRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  animation: ${resultReveal} 0.4s var(--ease-out-expo) 0.4s forwards;
  opacity: 0;
`;

export const AvatarImage = styled.img`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e5e5e5;
  flex-shrink: 0;
`;

export const AvatarPlaceholder = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #f5f5f5;
  border: 2px solid #e5e5e5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #737373;
  flex-shrink: 0;
`;

export const ProfileName = styled.span`
  font-family: var(--font-display);
  font-size: 0.88rem;
  font-weight: 600;
  color: #171717;
  letter-spacing: -0.01em;
`;

export const ProfileSubtitle = styled.span`
  font-size: 0.72rem;
  color: #737373;
`;

/* --- Result Tabs --- */

export const ResultTabRow = styled.div`
  display: flex;
  align-items: center;
  padding: 0 24px;
  border-top: 1px solid #e5e5e5;
  border-bottom: 1px solid #e5e5e5;
`;

export const ResultTab = styled.button<{ $active: boolean; $variant: 'success' | 'warning' | 'tip' }>`
  flex: 1;
  padding: 11px 8px;
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
  color: ${({ $active }) => ($active ? '#171717' : '#737373')};

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
      if ($variant === 'success') return '#10b981';
      if ($variant === 'warning') return '#f59e0b';
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
      if ($variant === 'success') return '#10b981';
      if ($variant === 'warning') return '#f59e0b';
      return 'var(--fox-primary)';
    }};
    transition: all 0.25s var(--ease-out-expo);
  }

  &:hover {
    color: #171717;
    svg { opacity: 0.7; }
    &::after {
      background: ${({ $active, $variant }) => {
        if ($active) {
          if ($variant === 'success') return '#10b981';
          if ($variant === 'warning') return '#f59e0b';
          return 'var(--fox-primary)';
        }
        return '#e5e5e5';
      }};
    }
  }
`;

export const ResultTabBadge = styled.span<{ $variant: 'success' | 'warning' | 'tip' }>`
  padding: 1px 6px;
  border-radius: 100px;
  font-size: 0.65rem;
  font-weight: 600;
  background: ${({ $variant }) => {
    if ($variant === 'success') return 'rgba(16, 185, 129, 0.1)';
    if ($variant === 'warning') return 'rgba(245, 158, 11, 0.1)';
    return 'rgba(255, 85, 0, 0.08)';
  }};
  color: ${({ $variant }) => {
    if ($variant === 'success') return '#10b981';
    if ($variant === 'warning') return '#f59e0b';
    return 'var(--fox-primary)';
  }};
`;

/* --- Result Tab Content --- */

export const TabContentWrapper = styled.div`
  overflow: hidden;
  transition: height 0.4s cubic-bezier(0.16, 1, 0.3, 1);
`;

export const ResultTabContent = styled.div`
  padding: 10px 24px 12px;
  animation: ${resultReveal} 0.3s var(--ease-out-expo) forwards;
`;

export const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

/* =============================================
   TIP ITEMS
   ============================================= */

export const TipItemRow = styled.div<{ $type: 'positive' | 'improvement' | 'tip'; $index?: number }>`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 7px 12px;
  border-radius: 10px;
  background: ${({ $type }) => {
    if ($type === 'positive') return 'rgba(16, 185, 129, 0.04)';
    if ($type === 'improvement') return 'rgba(245, 158, 11, 0.04)';
    return 'rgba(255, 85, 0, 0.03)';
  }};
  transition: background 0.2s ease;
  animation: ${itemSlideIn} 0.35s var(--ease-out-expo) forwards;
  animation-delay: ${({ $index }) => (($index ?? 0) * 0.04)}s;
  opacity: 0;

  &:hover {
    background: ${({ $type }) => {
      if ($type === 'positive') return 'rgba(16, 185, 129, 0.07)';
      if ($type === 'improvement') return 'rgba(245, 158, 11, 0.07)';
      return 'rgba(255, 85, 0, 0.06)';
    }};
  }
`;

export const TipIconWrap = styled.div<{ $type: 'positive' | 'improvement' | 'tip' }>`
  flex-shrink: 0;
  margin-top: 2px;
  color: ${({ $type }) => {
    if ($type === 'positive') return '#10b981';
    if ($type === 'improvement') return '#f59e0b';
    return 'var(--fox-primary)';
  }};

  svg {
    width: 15px;
    height: 15px;
  }
`;

export const TipText = styled.p`
  font-size: 0.84rem;
  color: #404040;
  line-height: 1.55;
  margin: 0;
`;

/* =============================================
   CTA BANNER
   ============================================= */

export const CTABanner = styled.div`
  margin: 0 20px 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(255, 85, 0, 0.04);
  border: 1px solid rgba(255, 85, 0, 0.08);
  border-radius: 10px;
  color: var(--fox-primary);
  font-family: var(--font-body);
  font-size: 0.8rem;
  font-weight: 500;
  animation: ${resultReveal} 0.45s var(--ease-out-expo) 0.5s forwards;
  opacity: 0;

  svg {
    flex-shrink: 0;
    width: 14px;
    height: 14px;
  }
`;

export const EmptyMessage = styled.p`
  font-size: 0.8rem;
  color: #737373;
  margin: 0;
  padding: 4px 0;
`;

/* =============================================
   SPINNER / LOADING
   ============================================= */

export const Spinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid #e5e5e5;
  border-top-color: var(--fox-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  flex-shrink: 0;
`;

export const LoadingContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;
