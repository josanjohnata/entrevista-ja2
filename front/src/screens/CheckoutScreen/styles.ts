import styled from 'styled-components';
import { theme } from '../../GlobalStyles';

const { colors } = theme;

// Cyber Neon Tech color scheme from foxapply-landing
const neonOrange = '#ff6b35'; // oklch(0.72 0.19 45)
const neonCyan = '#00d4ff'; // oklch(0.82 0.15 195)
const darkBg = '#0a0a0f'; // oklch(0.08 0.01 260)
const darkSurface = '#1a1a24'; // oklch(0.12 0.015 260)
const darkCard = '#1f1f2e'; // oklch(0.16 0.015 260)
const darkBorder = '#3a3a4a'; // oklch(0.25 0.02 260)
const darkInput = '#2a2a35'; // oklch(0.2 0.015 260)
const lightText = '#f2f2f2'; // oklch(0.95 0.01 260)
const mutedText = '#a0a0a0'; // oklch(0.65 0.02 260)

export const PageWrapper = styled.div`
  background-color: ${darkBg};
  color: ${lightText};
  padding: 5rem 2rem 3rem;
  min-height: 100vh;
  background-image: 
    linear-gradient(rgba(255, 107, 53, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 107, 53, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  
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
  color: ${lightText};
  text-shadow: 0 0 10px rgba(255, 107, 53, 0.3);

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
    background: linear-gradient(90deg, ${neonOrange}, ${neonCyan});
    box-shadow: 0 0 10px rgba(255, 107, 53, 0.5);
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
  background-color: ${darkCard};
  color: ${lightText};
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid ${darkBorder};
  backdrop-filter: blur(12px);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

export const SummaryColumn = styled.div``;

export const FormSection = styled.div`
  margin-bottom: 2.5rem;
`;

export const SectionHeader = styled.h2`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: ${lightText};
  
  svg {
    color: ${neonOrange};
  }
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
  
  label {
    color: ${lightText};
    font-size: 0.9375rem;
    font-weight: 500;
  }
`;

export const Input = styled.input<{ hasError?: boolean }>`
  background-color: ${darkInput};
  border: 1px solid ${({ hasError }) => hasError ? '#dc2626' : darkBorder};
  color: ${lightText};
  padding: 0.875rem;
  border-radius: 6px;
  font-size: 1rem;
  width: 100%;
  transition: all 0.2s;
  
  &::placeholder {
    color: ${mutedText};
  }
  
  &:focus { 
    outline: none;
    border-color: ${({ hasError }) => hasError ? '#dc2626' : neonOrange};
    box-shadow: 0 0 0 3px ${({ hasError }) => hasError ? 'rgba(220, 38, 38, 0.2)' : 'rgba(255, 107, 53, 0.2)'};
  }

  /* Override browser autocomplete styles */
  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px ${darkInput} inset !important;
    -webkit-text-fill-color: ${lightText} !important;
    background-color: ${darkInput} !important;
    color: ${lightText} !important;
  }

  /* For Firefox */
  &:-moz-autofill {
    background-color: ${darkInput} !important;
    color: ${lightText} !important;
  }
`;

export const FieldErrorMessage = styled.span`
  color: #ff6b6b;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  text-shadow: 0 0 5px rgba(255, 107, 107, 0.3);
`;

export const PaymentOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const RadioWrapper = styled.label`
  display: flex;
  align-items: center;
  background-color: ${darkInput};
  padding: 1rem;
  border-radius: 6px;
  border: 2px solid ${darkBorder};
  cursor: pointer;
  transition: all 0.2s;
  min-height: fit-content;
  overflow: hidden;
  color: ${lightText};

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
    border-color: ${neonOrange};
    box-shadow: 0 0 15px rgba(255, 107, 53, 0.3);
  }

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: ${darkSurface};
    
    input[type="radio"] {
      cursor: not-allowed;
    }
    
    span, .details, .icon {
      color: ${mutedText} !important;
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
    color: ${mutedText};
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
    color: ${mutedText};
    flex-shrink: 0;
    
    @media (max-width: 768px) {
      margin-left: 0.5rem;
      margin-right: 0.5rem;
      font-size: 1.1rem;
    }
  }
`;

export const SummaryCard = styled.div`
  background-color: ${darkCard};
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid ${darkBorder};
  backdrop-filter: blur(12px);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  
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
  color: ${lightText};
  background: linear-gradient(135deg, ${neonOrange}, ${neonCyan});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
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
    color: ${neonOrange};
    font-weight: 600;
  }

  .details {
    color: ${mutedText};
    margin-top: 0.5rem;
    padding-right: 2rem;
    line-height: 1.5;
  }
`;

export const PriceBox = styled.div`
  background-color: ${darkCard};
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  margin-top: 2rem;
  border: 1px solid ${darkBorder};
  backdrop-filter: blur(12px);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  
  .installments {
    font-size: 1.5rem;
    color: ${lightText};
    span { 
      font-weight: bold; 
      font-size: 2rem; 
      color: ${neonOrange};
      text-shadow: 0 0 10px rgba(255, 107, 53, 0.5);
    }
  }

  .full-price {
    font-size: 0.875rem;
    color: ${mutedText};
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
  margin-top: 1.5rem;
  background: linear-gradient(135deg, ${neonOrange}, #ff8c5a);
  color: ${darkBg};
  transition: all 0.3s;
  box-shadow: 0 0 20px rgba(255, 107, 53, 0.3);
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 0 30px rgba(255, 107, 53, 0.5), 0 4px 12px rgba(255, 107, 53, 0.3);
    background: linear-gradient(135deg, #ff8c5a, ${neonOrange});
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const TermsLink = styled.span`
  color: ${neonCyan};
  text-decoration: underline;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    color: ${neonOrange};
    text-shadow: 0 0 5px rgba(0, 212, 255, 0.5);
  }
`;

export const FreeNotice = styled.p`
  color: #6b7280;
  font-style: italic;
  margin-top: 1rem;
  text-align: center;
`;

export const TermsLabel = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: ${mutedText};
  line-height: 1.5;
  
  input[type="checkbox"] {
    margin-top: 0.2rem;
    flex-shrink: 0;
    accent-color: ${neonOrange};
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
  color: ${mutedText};
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.6;
  transition: all 0.2s;

  &:hover {
    opacity: 1;
    color: ${neonCyan};
  }

  &:focus {
    outline: none;
    opacity: 1;
    color: ${neonCyan};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;
