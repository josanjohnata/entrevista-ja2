import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;
  color: #171717;
  padding: 0 2rem 2rem;
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 0.5rem;
  color: #525252;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  align-self: flex-start;

  &:hover {
    background: #fafafa;
    color: #171717;
    border-color: #0a0a0a;
  }
`;

export const MainTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  text-align: center;
  position: relative;
  padding-bottom: 0.75rem;
  color: #171717;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: #0a0a0a;
  }
`;

export const ContentGrid = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 500px;
  margin: 2rem auto 3rem;
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fff;
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid #e5e5e5;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  width: 100%;
  
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
  color: #171717;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 70%;
    background: #0a0a0a;
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
  color: #737373;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.8;
  transition: all 0.2s;

  &:hover {
    opacity: 1;
    color: #0a0a0a;
  }

  &:focus {
    outline: none;
    color: #0a0a0a;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

export const Label = styled.label`
  font-size: 1rem;
  color: #171717;
`;

export const Input = styled.input<{ hasError?: boolean }>`
  background-color: #fafafa;
  border: 1px solid ${({ hasError }) => hasError ? '#dc2626' : '#d4d4d4'};
  color: #171717;
  padding: 0.875rem 1rem;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.2s;

  &::placeholder {
    color: #737373;
  }

  &:focus {
    outline: none;
    border-color: ${({ hasError }) => hasError ? '#dc2626' : '#0a0a0a'};
    box-shadow: ${({ hasError }) => hasError ? '0 0 0 2px rgba(220, 38, 38, 0.2)' : '0 0 0 2px rgba(10, 10, 10, 0.1)'};
  }

  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px #fafafa inset !important;
    -webkit-text-fill-color: #171717 !important;
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
  color: #171717;
  
  input[type="checkbox"] {
    accent-color: #0a0a0a;
  }
`;

export const ForgotPasswordLink = styled.a`
  color: #0a0a0a;
  text-decoration: none;
  transition: all 0.2s;
  
  &:hover {
    text-decoration: underline;
  }
`;

export const ActionButton = styled.button`
  background: #0a0a0a;
  color: #fff;
  border: none;
  padding: 0.875rem;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
  text-decoration: none;
  width: 100%;

  &:hover:not(:disabled) {
    background: #171717;
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const CreateAccountButton = styled(Link)`
  background: transparent;
  color: #171717;
  border: 2px solid #d4d4d4;
  padding: 0.875rem;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
  text-decoration: none;
  display: block;
  width: 100%;
  margin-top: 1rem;

  &:hover {
    background: #fafafa;
    border-color: #0a0a0a;
  }
`;

export const DescriptionText = styled.p`
  color: #525252;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  min-height: 40vh;
  font-size: 1.2rem;
  color: #525252;
`;

export const WarningBox = styled.div`
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: rgba(234, 179, 8, 0.12);
  color: #854d0e;
  border: 1px solid rgba(234, 179, 8, 0.3);
  border-radius: 6px;
  font-size: 0.9rem;
`;

export const ErrorMessage = styled.div`
  color: #dc2626;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  padding: 0.75rem 1rem;
  background-color: rgba(220, 38, 38, 0.08);
  border: 1px solid rgba(220, 38, 38, 0.2);
  border-radius: 6px;
`;

export const FieldErrorMessage = styled.span`
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
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
  background-color: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  padding: 2rem;
  width: 100%;
  max-width: 420px;
  position: relative;
  animation: slideUp 0.3s ease-out;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);

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
  color: #171717;
  margin: 0;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #737373;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.8;
  transition: all 0.2s;

  &:hover {
    opacity: 1;
    color: #0a0a0a;
  }
`;

export const ModalDescription = styled.p`
  color: #525252;
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
