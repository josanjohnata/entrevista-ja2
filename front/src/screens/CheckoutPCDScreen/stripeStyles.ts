import styled, { keyframes } from 'styled-components';

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

export const CardInfo = styled.p`
  font-size: 13px;
  color: #6B7280;
  text-align: center;
  margin: 4px 0 0;
`;

