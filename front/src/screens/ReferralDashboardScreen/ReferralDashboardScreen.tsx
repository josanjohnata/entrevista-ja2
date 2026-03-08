import React from 'react';
import { ReferralDashboard } from '../../components/Referral/ReferralDashboard';
import * as S from './styles';

export const ReferralDashboardScreen: React.FC = () => {
  return (
    <>
      <S.PageWrapper>
        <S.MainContainer>
          <ReferralDashboard />
        </S.MainContainer>
      </S.PageWrapper>
    </>
  );
};

