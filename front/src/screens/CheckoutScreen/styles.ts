import styled from 'styled-components';

/* Padrão de cores do app: tema claro */
const pageBg = '#f5f5f5';
const cardBg = '#fff';
const borderColor = '#e5e5e5';
const inputBg = '#fafafa';
const textMain = '#171717';
const textMuted = '#525252';
const textSecondary = '#737373';
const accent = 'var(--fox-primary, #FF5500)';

export const PageWrapper = styled.div`
  background-color: ${pageBg};
  color: ${textMain};
  padding: 5rem 2rem 3rem;
  min-height: 100vh;
  
  @media (max-width: 768px) {
    padding: 4rem 1rem 2rem;
  }
  
  @media (max-width: 480px) {
    padding: 3rem 0.75rem 1.5rem;
  }
`;

export const MainContainer = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

export const MainTitle = styled.h1`
  text-align: center;
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 3rem;
  position: relative;
  padding-bottom: 0.75rem;
  color: ${textMain};

  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.75rem;
    margin-bottom: 1.5rem;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: ${accent};
    border-radius: 2px;
  }
`;

export const CheckoutGrid = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 3rem;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  @media (max-width: 768px) {
    gap: 1.5rem;
  }
`;

export const FormColumn = styled.div`
  background-color: ${cardBg};
  color: ${textMain};
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid ${borderColor};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

export const SummaryColumn = styled.div``;

export const FormSection = styled.div`
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    margin-bottom: 1rem;
  }
`;

export const SectionHeader = styled.h2`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${textMain};
  
  svg {
    color: ${accent};
  }
  
  @media (max-width: 768px) {
    font-size: 1.25rem;
    margin-bottom: 0.75rem;
  }
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-bottom: 0.5rem;
  
  label {
    color: ${textMuted};
    font-size: 0.9375rem;
    font-weight: 500;
  }
  
  @media (max-width: 768px) {
    margin-bottom: 0.4rem;
    gap: 0.25rem;
  }
`;

export const Input = styled.input<{ hasError?: boolean }>`
  background-color: ${inputBg};
  border: 1px solid ${({ hasError }) => hasError ? '#dc2626' : borderColor};
  color: ${textMain};
  padding: 0.65rem 0.875rem;
  border-radius: 6px;
  font-size: 1rem;
  width: 100%;
  transition: all 0.2s;
  
  @media (max-width: 768px) {
    padding: 0.5rem 0.75rem;
  }
  
  &::placeholder {
    color: #a3a3a3;
  }
  
  &:focus { 
    outline: none;
    border-color: ${({ hasError }) => hasError ? '#dc2626' : accent};
    box-shadow: 0 0 0 3px ${({ hasError }) => hasError ? 'rgba(220, 38, 38, 0.1)' : 'rgba(255, 85, 0, 0.08)'};
  }

  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px ${inputBg} inset !important;
    -webkit-text-fill-color: ${textMain} !important;
    background-color: ${inputBg} !important;
    color: ${textMain} !important;
  }

  &:-moz-autofill {
    background-color: ${inputBg} !important;
    color: ${textMain} !important;
  }
`;

export const FieldErrorMessage = styled.span`
  color: #dc2626;
  font-size: 0.75rem;
  margin-top: 0.125rem;
`;

export const PaymentOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const RadioWrapper = styled.label`
  display: flex;
  align-items: center;
  background-color: ${inputBg};
  padding: 1rem;
  border-radius: 6px;
  border: 2px solid ${borderColor};
  cursor: pointer;
  transition: all 0.2s;
  min-height: fit-content;
  overflow: hidden;
  color: ${textMain};

  @media (max-width: 768px) {
    padding: 0.875rem;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem;
    font-size: 0.9rem;
  }

  &.selected {
    border-color: ${accent};
    box-shadow: 0 0 0 1px ${accent};
  }

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: #f5f5f5;
    
    input[type="radio"] {
      cursor: not-allowed;
    }
    
    span, .details, .icon {
      color: ${textSecondary} !important;
    }
  }

  input[type="radio"] {
    margin-right: 1rem;
    flex-shrink: 0;
    
    @media (max-width: 480px) {
      margin-right: 0.5rem;
    }
  }

  span:first-of-type {
    flex: 1;
    min-width: 0;
    word-wrap: break-word;
  }

  .details {
    margin-left: 1rem;
    margin-right: 1rem;
    font-size: 0.875rem;
    color: ${textSecondary};
    white-space: nowrap;
    
    @media (max-width: 768px) {
      margin-left: 0.5rem;
      margin-right: 0.5rem;
      font-size: 0.8rem;
    }
    
    @media (max-width: 480px) {
      white-space: normal;
      word-break: break-word;
    }
  }

  .icon {
    margin-left: 1rem;
    margin-right: 1rem;
    font-size: 1.2rem;
    color: ${textSecondary};
    flex-shrink: 0;
    
    @media (max-width: 768px) {
      margin-left: 0.5rem;
      margin-right: 0.5rem;
      font-size: 1.1rem;
    }
  }
`;

export const SummaryCard = styled.div`
  background-color: ${cardBg};
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid ${borderColor};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

export const PlanTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: ${textMain};
  
  @media (max-width: 768px) {
    font-size: 1.75rem;
    margin-bottom: 1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

export const FeatureItem = styled.div`
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .title {
    color: ${textMain};
    font-weight: 600;
  }

  .details {
    color: ${textSecondary};
    margin-top: 0.5rem;
    padding-right: 2rem;
    line-height: 1.5;
  }
`;

export const PriceBox = styled.div`
  background-color: #fafafa;
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  margin-top: 2rem;
  border: 1px solid ${borderColor};
  
  .installments {
    font-size: 1.5rem;
    color: ${textMain};
    span { 
      font-weight: bold; 
      font-size: 2rem; 
      color: ${accent};
    }
  }

  .full-price {
    font-size: 0.875rem;
    color: ${textSecondary};
    margin-top: 0.5rem;
  }
`;

export const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem;
  font-size: 1.125rem;
  font-weight: 600;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  margin-top: 1rem;
  background: linear-gradient(135deg, #FF6A1A, #FF4800);
  color: #fff;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(255, 72, 0, 0.2);
  
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(255, 72, 0, 0.3);
    background: linear-gradient(135deg, #FF7A2E, #FF5500);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const TermsLink = styled.span`
  color: ${accent};
  text-decoration: underline;
  cursor: pointer;
  transition: color 0.2s;
  
  &:hover {
    color: #ea580c;
  }
`;

export const FreeNotice = styled.p`
  color: ${textSecondary};
  font-style: italic;
  margin-top: 1rem;
  text-align: center;
`;

export const TermsLabel = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: ${textMuted};
  line-height: 1.5;
  
  input[type="checkbox"] {
    margin-top: 0.2rem;
    flex-shrink: 0;
    accent-color: ${accent};
  }
`;

export const PasswordInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
`;

export const TogglePasswordButton = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${textSecondary};
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.8;
  transition: color 0.2s;

  &:hover {
    color: ${accent};
  }

  &:focus {
    outline: none;
    color: ${accent};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;
