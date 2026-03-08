import styled from 'styled-components';
import { theme } from '../../GlobalStyles';

const { colors } = theme;

// Color scheme (Entrevista Já landing)
const neonOrange = '#ff6b35';
const neonCyan = '#00d4ff';
const darkBg = '#0a0a0f';
const darkSurface = '#1a1a24';
const darkCard = '#1f1f2e';
const darkBorder = '#3a3a4a';
const darkInput = '#2a2a35';
const lightText = '#f2f2f2';
const mutedText = '#a0a0a0';

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
  margin-bottom: 2rem;
  position: relative;
  padding-bottom: 0.75rem;
  color: ${lightText};
  text-shadow: 0 0 10px rgba(255, 107, 53, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.75rem;
    margin-bottom: 1rem;
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

export const PCDBanner = styled.div`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 20px rgba(16, 185, 129, 0.3);
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    padding: 1.25rem;
  }
`;

export const PCDBannerIcon = styled.div`
  font-size: 2rem;
  color: white;
  flex-shrink: 0;
  
  svg {
    width: 32px;
    height: 32px;
  }
`;

export const PCDBannerContent = styled.div`
  flex: 1;
`;

export const PCDBannerTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  margin: 0 0 0.5rem 0;
  
  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`;

export const PCDBannerText = styled.p`
  font-size: 0.9375rem;
  color: rgba(255, 255, 255, 0.95);
  margin: 0;
  line-height: 1.6;
  
  @media (max-width: 480px) {
    font-size: 0.875rem;
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

export const Input = styled.input<{ $hasError?: boolean }>`
  background-color: ${darkInput};
  border: 1px solid ${({ $hasError }) => $hasError ? '#dc2626' : darkBorder};
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
    border-color: ${({ $hasError }) => $hasError ? '#dc2626' : neonOrange};
    box-shadow: 0 0 0 3px ${({ $hasError }) => $hasError ? 'rgba(220, 38, 38, 0.2)' : 'rgba(255, 107, 53, 0.2)'};
  }

  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px ${darkInput} inset !important;
    -webkit-text-fill-color: ${lightText} !important;
    background-color: ${darkInput} !important;
    color: ${lightText} !important;
  }

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
  margin-bottom: 1rem;
  color: ${lightText};
  background: linear-gradient(135deg, ${neonOrange}, ${neonCyan});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 1.75rem;
    margin-bottom: 0.75rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

export const FreeTrialBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  
  svg {
    width: 20px;
    height: 20px;
  }
  
  @media (max-width: 480px) {
    font-size: 0.875rem;
    padding: 0.625rem 1rem;
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

export const FileUploadWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const FileUploadInput = styled.input`
  position: absolute;
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  z-index: -1;
`;

export const FileUploadLabel = styled.label<{ $hasError?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem;
  background-color: ${darkInput};
  border: 2px dashed ${({ $hasError }) => $hasError ? '#dc2626' : darkBorder};
  border-radius: 8px;
  color: ${lightText};
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9375rem;
  font-weight: 500;

  &:hover {
    border-color: ${({ $hasError }) => $hasError ? '#dc2626' : neonOrange};
    background-color: ${darkSurface};
  }

  svg {
    width: 20px;
    height: 20px;
    color: ${neonOrange};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const FileUploadHint = styled.p`
  font-size: 0.75rem;
  color: ${mutedText};
  margin: 0;
  line-height: 1.4;
`;

export const FilePreview = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background-color: ${darkInput};
  border: 1px solid ${darkBorder};
  border-radius: 8px;
`;

export const FilePreviewIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: ${darkSurface};
  border-radius: 6px;
  color: ${neonOrange};
  flex-shrink: 0;

  svg {
    width: 24px;
    height: 24px;
  }
`;

export const FilePreviewInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const FilePreviewName = styled.div`
  font-size: 0.9375rem;
  font-weight: 500;
  color: ${lightText};
  margin-bottom: 0.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const FilePreviewSize = styled.div`
  font-size: 0.75rem;
  color: ${mutedText};
`;

export const FileRemoveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: none;
  border: 1px solid ${darkBorder};
  border-radius: 6px;
  color: ${mutedText};
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;

  &:hover:not(:disabled) {
    border-color: '#dc2626';
    color: '#dc2626';
    background-color: rgba(220, 38, 38, 0.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

