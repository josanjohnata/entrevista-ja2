import styled from 'styled-components';

const pageBg = '#f5f5f5';
const cardBg = '#fff';
const borderColor = '#e5e5e5';
const inputBg = '#fafafa';
const textMain = '#171717';
const textMuted = '#525252';
const accent = 'var(--fox-primary, #FF5500)';

export const PageWrapper = styled.div`
  background-color: ${pageBg};
  color: ${textMain};
  padding: 5rem 2rem 3rem;
  min-height: 100vh;

  @media (max-width: 768px) {
    padding: 4rem 1rem 2rem;
  }
`;

export const MainContainer = styled.div`
  max-width: 640px;
  margin: 0 auto;
`;

export const MainTitle = styled.h1`
  text-align: center;
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${textMain};
`;

export const Subtitle = styled.p`
  text-align: center;
  font-size: 1rem;
  color: ${textMuted};
  margin-bottom: 2rem;
`;

export const FormCard = styled.div`
  background-color: ${cardBg};
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid ${borderColor};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

export const FormSection = styled.div`
  margin-bottom: 1.5rem;
`;

export const SectionHeader = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${textMain};
`;

export const InputGroup = styled.div`
  margin-bottom: 0.75rem;

  label {
    display: block;
    color: ${textMuted};
    font-size: 0.9375rem;
    font-weight: 500;
    margin-bottom: 0.35rem;
  }
`;

export const Input = styled.input<{ hasError?: boolean }>`
  width: 100%;
  background-color: ${inputBg};
  border: 1px solid ${({ hasError }) => (hasError ? '#dc2626' : borderColor)};
  color: ${textMain};
  padding: 0.65rem 0.875rem;
  border-radius: 6px;
  font-size: 1rem;

  &::placeholder {
    color: #a3a3a3;
  }

  &:focus {
    outline: none;
    border-color: ${({ hasError }) => (hasError ? '#dc2626' : accent)};
  }
`;

export const Textarea = styled.textarea<{ hasError?: boolean }>`
  width: 100%;
  min-height: 120px;
  resize: vertical;
  background-color: ${inputBg};
  border: 1px solid ${({ hasError }) => (hasError ? '#dc2626' : borderColor)};
  color: ${textMain};
  padding: 0.65rem 0.875rem;
  border-radius: 6px;
  font-size: 1rem;
  font-family: inherit;

  &::placeholder {
    color: #a3a3a3;
  }

  &:focus {
    outline: none;
    border-color: ${({ hasError }) => (hasError ? '#dc2626' : accent)};
  }
`;

export const FieldError = styled.span`
  color: #dc2626;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  display: block;
`;

export const SubmitButton = styled.button`
  width: 100%;
  padding: 0.875rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  margin-top: 0.5rem;
  background: linear-gradient(135deg, #ff6a1a, #ff4800);
  color: #fff;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    opacity: 0.95;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const SuccessMessage = styled.div`
  text-align: center;
  padding: 2rem;
  background: #f0fdf4;
  border: 1px solid #86efac;
  border-radius: 12px;
  color: #166534;
  margin-bottom: 1rem;
`;

export const BackLink = styled.div`
  text-align: center;
  margin-top: 1rem;

  a {
    color: ${accent};
    text-decoration: none;
    font-weight: 500;
  }
  a:hover {
    text-decoration: underline;
  }
`;
