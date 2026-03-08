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

/* =============================================
   PAGE LAYOUT
   ============================================= */

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 80px);
  min-height: calc(100dvh - 80px);
  padding-bottom: clamp(2rem, 3vw, 3rem);
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
  background: linear-gradient(180deg, #ffffff 0%, #8a8a93 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

export const PageSubtitle = styled.p`
  margin: 0 auto;
  font-size: clamp(0.82rem, 0.78rem + 0.25vw, 0.92rem);
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.5);
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
  align-items: stretch;
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
  background: rgba(12, 12, 13, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 20px;
  overflow: hidden;
  animation: fadeUp 0.8s var(--ease-out-expo) 0.5s forwards;
  opacity: 0;
  transform: translateY(20px);
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
`;

export const FormPanelHeader = styled.div`
  padding: clamp(10px, 1.2vw, 14px) clamp(16px, 2vw, 24px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  gap: clamp(10px, 1.2vw, 14px);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.02) 0%, transparent 100%);
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
`;

export const FormPanelTitleGroup = styled.div`
  flex: 1;

  h2 {
    font-family: var(--font-display);
    font-size: 1.05rem;
    font-weight: 600;
    color: var(--text-main);
    letter-spacing: -0.01em;
  }

  p {
    font-size: 0.78rem;
    color: rgba(255, 255, 255, 0.4);
    margin-top: 2px;
  }
`;

export const LoadProfileBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 9px;
  color: rgba(255, 255, 255, 0.5);
  font-family: var(--font-body);
  font-size: 0.76rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s var(--ease-out-expo);
  flex-shrink: 0;
  white-space: nowrap;

  svg {
    width: 13px;
    height: 13px;
    transition: transform 0.4s var(--ease-out-expo);
  }

  &:hover:not(:disabled) {
    color: #fff;
    background: rgba(255, 255, 255, 0.07);
    border-color: rgba(255, 255, 255, 0.15);

    svg {
      transform: rotate(-180deg);
    }
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
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
  min-height: 0;

  ${({ $cleared }) => $cleared && css`
    animation: ${clearPulse} 0.5s ease forwards;
  `}
`;

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
  flex: 1;
  min-height: 0;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
  min-height: 0;
  flex: 1;
`;

export const FormLabel = styled.label`
  font-family: var(--font-body);
  font-size: 0.82rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 0.01em;
  display: flex;
  align-items: center;
  gap: 6px;

  svg {
    width: 14px;
    height: 14px;
    color: var(--fox-primary);
    opacity: 0.7;
  }
`;

export const TextareaWrapper = styled.div`
  position: relative;
  flex: 1;
  min-height: 160px;
  display: flex;
`;

export const FormTextarea = styled.textarea`
  width: 100%;
  padding: 14px 16px;
  padding-right: 22px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 12px;
  color: var(--text-main);
  font-family: var(--font-body);
  font-size: 0.86rem;
  line-height: 1.6;
  outline: none;
  transition: border-color 0.25s var(--ease-out-expo),
              background 0.25s var(--ease-out-expo),
              box-shadow 0.25s var(--ease-out-expo);
  box-sizing: border-box;
  resize: none;
  overflow-y: scroll;
  flex: 1;
  min-height: 0;

  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.32);
  }

  &:hover:not(:focus) {
    border-color: rgba(255, 255, 255, 0.12);
    background: rgba(255, 255, 255, 0.035);
  }

  &:focus {
    border-color: rgba(255, 255, 255, 0.18);
    background: rgba(255, 255, 255, 0.04);
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.04);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
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
  background: rgba(255, 255, 255, 0.12);
  transition: background 0.2s ease;
  pointer-events: auto;
  cursor: grab;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  &:active {
    background: rgba(255, 255, 255, 0.28);
    cursor: grabbing;
  }
`;

/* =============================================
   ANALYSIS STATUS
   ============================================= */

export const AnalysisStatusBar = styled.div`
  padding: 8px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: var(--font-body);
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);

  svg {
    width: 14px;
    height: 14px;
  }
`;

export const AnalysisStatusHighlight = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--fox-primary);
  font-weight: 500;
`;

/* =============================================
   FORM FOOTER (BUTTONS)
   ============================================= */

export const FormFooter = styled.div`
  padding: clamp(10px, 1.2vw, 14px) clamp(16px, 2vw, 24px);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;

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
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.5);
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
    color: #fff;
    background: rgba(255, 255, 255, 0.04);
    border-color: rgba(255, 255, 255, 0.14);
  }

  @media (max-width: 640px) {
    width: 100%;
  }
`;

/* =============================================
   SPINNER / LOADING
   ============================================= */

export const Spinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.15);
  border-top-color: currentColor;
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
