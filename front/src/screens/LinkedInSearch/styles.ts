import styled, { keyframes, css } from 'styled-components';

const shine = keyframes`
  0% { left: -100%; }
  100% { left: 200%; }
`;

const inputGlow = keyframes`
  0%, 100% { box-shadow: 0 0 0 3px rgba(255, 85, 0, 0.05); }
  50% { box-shadow: 0 0 0 4px rgba(255, 85, 0, 0.1); }
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
  letter-spacing: -0.02em;
  line-height: 1;
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

/* =============================================
   FORM PANEL
   ============================================= */

export const FormPanel = styled.div`
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  overflow: visible;
  animation: fadeUp 0.8s var(--ease-out-expo) 0.5s forwards;
  opacity: 0;
  transform: translateY(20px);
  position: relative;
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

  &[type="number"] {
    -moz-appearance: textfield;
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
`;

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

/* =============================================
   SELECT COMPONENTS
   ============================================= */

export const SelectWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const SelectButton = styled.button<{ $isOpen?: boolean }>`
  width: 100%;
  padding: 12px 16px;
  padding-right: 42px;
  background: ${({ $isOpen }) => ($isOpen ? '#f5f5f5' : '#fafafa')};
  border: 1px solid ${({ $isOpen }) => ($isOpen ? '#0a0a0a' : '#e5e5e5')};
  border-radius: 12px;
  color: #171717;
  font-family: var(--font-body);
  font-size: 0.86rem;
  cursor: pointer;
  transition: all 0.25s var(--ease-out-expo);
  box-sizing: border-box;
  text-align: left;
  display: flex;
  align-items: center;

  ${({ $isOpen }) => $isOpen && `
    box-shadow: 0 0 0 3px rgba(10, 10, 10, 0.06);
  `}

  &:focus {
    outline: none;
    border-color: #0a0a0a;
    box-shadow: 0 0 0 3px rgba(10, 10, 10, 0.06);
  }

  &:hover:not(:focus) {
    border-color: #d4d4d4;
    background: #f5f5f5;
  }
`;

export const SelectIcon = styled.span<{ $isOpen?: boolean }>`
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%) ${({ $isOpen }) => ($isOpen ? 'rotate(180deg)' : 'rotate(0)')};
  transition: transform 0.3s var(--ease-out-expo);
  color: #737373;
  pointer-events: none;
  display: flex;
  align-items: center;
`;

export const SelectDropdown = styled.div<{ $isOpen?: boolean }>`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 14px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  z-index: 1000;
  overflow: hidden;
  max-height: min(300px, 60vh);
  overflow-y: auto;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
  transform: ${({ $isOpen }) => ($isOpen ? 'translateY(0) scale(1)' : 'translateY(-8px) scale(0.98)')};
  transition: all 0.25s var(--ease-out-expo);
  padding: 4px;
`;

export const SelectOption = styled.button<{ $isSelected?: boolean }>`
  width: 100%;
  padding: 10px 14px;
  border: none;
  background: ${({ $isSelected }) => ($isSelected ? 'rgba(255, 85, 0, 0.08)' : 'transparent')};
  color: ${({ $isSelected }) => ($isSelected ? '#171717' : '#525252')};
  font-family: var(--font-body);
  font-size: 0.84rem;
  font-weight: ${({ $isSelected }) => ($isSelected ? 600 : 400)};
  text-align: left;
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 10px;

  svg {
    color: var(--fox-primary);
    flex-shrink: 0;
  }

  &:hover {
    background: #f5f5f5;
    color: #171717;
  }
`;

/* =============================================
   MULTI-SELECT
   ============================================= */

export const MultiSelectButton = styled.button<{ $isOpen?: boolean }>`
  width: 100%;
  min-height: 46px;
  padding: 8px 42px 8px 16px;
  background: ${({ $isOpen }) => ($isOpen ? '#f5f5f5' : '#fafafa')};
  border: 1px solid ${({ $isOpen }) => ($isOpen ? '#0a0a0a' : '#e5e5e5')};
  border-radius: 12px;
  color: #171717;
  font-family: var(--font-body);
  font-size: 0.86rem;
  cursor: pointer;
  transition: all 0.25s var(--ease-out-expo);
  box-sizing: border-box;
  text-align: left;
  position: relative;

  ${({ $isOpen }) => $isOpen && `
    box-shadow: 0 0 0 3px rgba(10, 10, 10, 0.06);
  `}

  &:focus {
    outline: none;
    border-color: #0a0a0a;
    box-shadow: 0 0 0 3px rgba(10, 10, 10, 0.06);
  }

  &:hover:not(:focus) {
    border-color: #d4d4d4;
    background: #f5f5f5;
  }
`;

export const MultiSelectContent = styled.div`
  display: flex;
  align-items: center;
  min-height: 26px;
`;

export const MultiSelectPlaceholder = styled.span`
  color: #a3a3a3;
`;

export const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

export const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  background: rgba(255, 85, 0, 0.1);
  border: 1px solid rgba(255, 85, 0, 0.18);
  color: var(--fox-primary);
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.01em;
`;

export const TagRemove = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 1px;
  border: none;
  background: transparent;
  color: var(--fox-primary);
  cursor: pointer;
  border-radius: 4px;
  transition: var(--transition-fast);
  opacity: 0.6;

  &:hover {
    opacity: 1;
    background: rgba(255, 85, 0, 0.15);
  }
`;

export const MultiSelectOption = styled.button<{ $isSelected?: boolean }>`
  width: 100%;
  padding: 10px 14px;
  border: none;
  background: ${({ $isSelected }) => ($isSelected ? 'rgba(255, 85, 0, 0.08)' : 'transparent')};
  color: ${({ $isSelected }) => ($isSelected ? '#171717' : '#525252')};
  font-family: var(--font-body);
  font-size: 0.84rem;
  text-align: left;
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 10px;

  &:hover {
    background: #f5f5f5;
    color: #171717;
  }
`;

export const Checkbox = styled.span<{ $isChecked?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border: 1.5px solid ${({ $isChecked }) => ($isChecked ? 'var(--fox-primary)' : '#d4d4d4')};
  border-radius: 6px;
  background: ${({ $isChecked }) => ($isChecked ? 'var(--fox-primary)' : 'transparent')};
  color: #fff;
  transition: all 0.2s var(--ease-out-expo);
  flex-shrink: 0;

  ${({ $isChecked }) => $isChecked && `
    box-shadow: 0 2px 8px rgba(255, 85, 0, 0.25);
  `}
`;

/* =============================================
   FORM FOOTER (BUTTONS)
   ============================================= */

export const FormFooter = styled.div`
  padding: clamp(10px, 1.2vw, 14px) clamp(16px, 2vw, 24px);
  border-top: 1px solid #e5e5e5;
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
  background: var(--fox-primary);
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
    background: var(--fox-secondary);
    box-shadow: 0 6px 16px rgba(255, 85, 0, 0.15);
  }

  &:hover:not(:disabled)::before {
    animation: ${shine} 0.8s ease forwards;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 4px 12px rgba(255, 85, 0, 0.2);
  }

  @media (max-width: 640px) {
    width: 100%;
  }
`;

export const BtnOutline = styled.button<{ $disabled?: boolean }>`
  flex: 1;
  padding: 13px 24px;
  background: transparent;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  color: #525252;
  font-family: var(--font-body);
  font-size: 0.86rem;
  font-weight: 500;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.3 : 1)};
  transition: all 0.35s var(--ease-out-expo);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
  overflow: hidden;

  svg {
    transition: transform 0.4s var(--ease-out-expo);
  }

  &:hover:not(:disabled) {
    color: #171717;
    background: #f5f5f5;
    border-color: #d4d4d4;

    svg {
      transform: rotate(-180deg);
    }
  }

  &:active:not(:disabled) {
    transform: scale(0.97);
  }

  @media (max-width: 640px) {
    width: 100%;
  }
`;

/* =============================================
   KEYBOARD HINTS
   ============================================= */

export const KeyboardHints = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 12px 24px;
  border-top: 1px solid #e5e5e5;

  @media (max-width: 640px) {
    display: none;
  }
`;

export const KbdHint = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.74rem;
  color: #737373;
  letter-spacing: 0.02em;
`;

export const Kbd = styled.kbd`
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 500;
  padding: 3px 8px;
  background: #f5f5f5;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  color: #525252;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
`;

/* =============================================
   DEPRECATED (keeping to avoid import errors)
   ============================================= */

export const ButtonGroup = styled.div`
  display: none;
`;

export const Select = styled.select`
  display: none;
`;

export const FormHeader = styled.div`
  display: none;
`;
