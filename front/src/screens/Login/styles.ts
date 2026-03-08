import styled from 'styled-components';
import { Link } from 'react-router-dom';
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
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: ${darkBg};
  color: ${lightText};
  padding: 4rem 2rem 2rem;
  background-image: 
    linear-gradient(rgba(255, 107, 53, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 107, 53, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
`;

export const MainTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  text-align: center;
  position: relative;
  padding-bottom: 0.75rem;
  color: ${lightText};
  text-shadow: 0 0 10px rgba(255, 107, 53, 0.3);

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

export const ContentGrid = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 500px;
  margin-top: 2rem;
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${darkCard};
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid ${darkBorder};
  backdrop-filter: blur(12px);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

export const Subheading = styled.h2`
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  position: relative;
  padding-left: 0.5rem;
  color: ${lightText};

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 70%;
    background: linear-gradient(180deg, ${neonOrange}, ${neonCyan});
    box-shadow: 0 0 8px rgba(255, 107, 53, 0.5);
  }
`;

export const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;
`;

export const PasswordInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;

  input {
    width: 100%;
    padding-right: 45px;
  }
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

export const Label = styled.label`
  font-size: 1rem;
  color: ${lightText};
`;

export const Input = styled.input<{ hasError?: boolean }>`
  background-color: ${darkInput};
  border: 1px solid ${({ hasError }) => hasError ? '#dc3545' : darkBorder};
  color: ${lightText};
  padding: 0.875rem 1rem;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.3s;

  &::placeholder {
    color: ${mutedText};
  }

  &:focus {
    outline: none;
    border-color: ${({ hasError }) => hasError ? '#dc3545' : neonOrange};
    box-shadow: ${({ hasError }) => hasError ? '0 0 0 0.2rem rgba(220, 53, 69, 0.25)' : `0 0 0 3px rgba(255, 107, 53, 0.2)`};
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

export const OptionsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.875rem;
  flex-wrap: wrap;
`;

export const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: ${lightText};
  
  input[type="checkbox"] {
    accent-color: ${neonOrange};
  }
`;

export const ForgotPasswordLink = styled.a`
  color: ${neonCyan};
  text-decoration: none;
  transition: all 0.2s;
  
  &:hover {
    text-decoration: underline;
    color: ${neonOrange};
    text-shadow: 0 0 5px rgba(0, 212, 255, 0.5);
  }
`;

export const ActionButton = styled.button`
  background: linear-gradient(135deg, ${neonOrange}, #ff8c5a);
  color: ${darkBg};
  border: none;
  padding: 0.875rem;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;
  text-decoration: none;
  box-shadow: 0 0 20px rgba(255, 107, 53, 0.3);
  width: 100%;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #ff8c5a, ${neonOrange});
    box-shadow: 0 0 30px rgba(255, 107, 53, 0.5), 0 4px 12px rgba(255, 107, 53, 0.3);
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const CreateAccountButton = styled(Link)`
  background: transparent;
  color: ${neonCyan};
  border: 2px solid ${neonCyan};
  padding: 0.875rem;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;
  text-decoration: none;
  display: block;
  width: 100%;
  margin-top: 1rem;

  &:hover {
    background: ${neonCyan};
    color: ${darkBg};
    box-shadow: 0 0 30px rgba(0, 212, 255, 0.5), 0 4px 12px rgba(0, 212, 255, 0.3);
    transform: translateY(-2px);
  }
`;

export const DescriptionText = styled.p`
  color: ${mutedText};
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
  font-size: 1.2rem;
`;

export const WarningBox = styled.div`
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: rgba(255, 193, 7, 0.1);
  color: #ffc107;
  border: 1px solid rgba(255, 193, 7, 0.3);
  border-radius: 6px;
  font-size: 0.9rem;
  backdrop-filter: blur(8px);
`;

export const ErrorMessage = styled.div`
  color: #ff6b6b;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  padding: 0.75rem 1rem;
  background-color: rgba(220, 53, 69, 0.1);
  border: 1px solid rgba(220, 53, 69, 0.3);
  border-radius: 6px;
  backdrop-filter: blur(8px);
  text-shadow: 0 0 5px rgba(255, 107, 107, 0.3);
`;

export const FieldErrorMessage = styled.span`
  color: #ff6b6b;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
  text-shadow: 0 0 5px rgba(255, 107, 107, 0.3);
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export const ModalContent = styled.div`
  background-color: ${darkCard};
  border: 1px solid ${darkBorder};
  border-radius: 12px;
  padding: 2rem;
  width: 100%;
  max-width: 420px;
  position: relative;
  animation: slideUp 0.3s ease-out;
  backdrop-filter: blur(12px);
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

export const ModalTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${lightText};
  margin: 0;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: ${mutedText};
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.6;
  transition: all 0.2s;

  &:hover {
    opacity: 1;
    color: ${neonOrange};
  }
`;

export const ModalDescription = styled.p`
  color: ${mutedText};
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

export const SuccessMessage = styled.div`
  color: #10b981;
  background-color: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;
  font-size: 0.95rem;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  backdrop-filter: blur(8px);
`;
