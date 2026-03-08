import styled, { keyframes, css } from 'styled-components';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const Container = styled.div`
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
`;

export const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #FEE2E2;
  color: #DC2626;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 14px;
`;

export const TabContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;

export const Tab = styled.button<{ $active: boolean }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 16px;
  border: 2px solid ${props => props.$active ? '#10B981' : '#E5E7EB'};
  background: ${props => props.$active ? '#ECFDF5' : '#FFFFFF'};
  color: ${props => props.$active ? '#059669' : '#6B7280'};
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.$active ? '#10B981' : '#D1D5DB'};
    background: ${props => props.$active ? '#ECFDF5' : '#F9FAFB'};
  }
`;

export const PixIcon = styled.span`
  display: flex;
  align-items: center;
  color: #32BCAD;
`;

export const ContentCard = styled.div`
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 16px;
  padding: 24px;
`;

export const PlanSummary = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
  margin-bottom: 20px;
  border-bottom: 1px solid #E5E7EB;

  h3 {
    font-size: 16px;
    font-weight: 600;
    color: #1F2937;
    margin: 0;
  }

  p {
    font-size: 18px;
    font-weight: 700;
    color: #059669;
    margin: 0;
  }
`;

export const QRCodeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

export const StatusBadge = styled.div<{ $status: string }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;

  ${props => props.$status === 'PAID' ? css`
    background: #ECFDF5;
    color: #059669;
  ` : css`
    background: #FEF3C7;
    color: #D97706;
  `}
`;

export const LoadingBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 40px;
  color: #6B7280;

  .spinning {
    animation: ${spin} 1s linear infinite;
  }
`;

export const QRCodeWrapper = styled.div`
  background: #FFFFFF;
  padding: 16px;
  border-radius: 12px;
  border: 2px solid #E5E7EB;
  
  img {
    width: 200px;
    height: 200px;
    display: block;
  }
`;

export const PixCodeContainer = styled.div`
  width: 100%;

  label {
    display: block;
    font-size: 13px;
    color: #6B7280;
    margin-bottom: 8px;
    text-align: center;
  }
`;

export const PixCodeInput = styled.div`
  display: flex;
  gap: 8px;

  input {
    flex: 1;
    padding: 12px;
    border: 1px solid #E5E7EB;
    border-radius: 8px;
    font-size: 12px;
    color: #374151;
    background: #F9FAFB;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const CopyButton = styled.button<{ $copied: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 16px;
  background: ${props => props.$copied ? '#059669' : '#10B981'};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: ${props => props.$copied ? '#047857' : '#059669'};
  }
`;

export const ExpirationInfo = styled.p`
  font-size: 13px;
  color: #6B7280;
  text-align: center;
  margin: 8px 0 0;
  line-height: 1.5;
`;

export const SimulateButton = styled.button`
  padding: 10px 20px;
  background: #FEF3C7;
  color: #92400E;
  border: 1px solid #FCD34D;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 8px;

  &:hover {
    background: #FDE68A;
  }
`;

export const CardForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;

  label {
    font-size: 13px;
    font-weight: 500;
    color: #374151;
  }

  input {
    padding: 12px 14px;
    border: 1px solid #E5E7EB;
    border-radius: 8px;
    font-size: 15px;
    color: #1F2937;
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      border-color: #10B981;
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
    }

    &::placeholder {
      color: #9CA3AF;
    }
  }
`;

export const InputRow = styled.div`
  display: flex;
  gap: 12px;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

export const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 24px;
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 8px;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .spinning {
    animation: ${spin} 1s linear infinite;
  }
`;

export const CardInfo = styled.p`
  font-size: 13px;
  color: #6B7280;
  text-align: center;
  margin: 4px 0 0;
`;

