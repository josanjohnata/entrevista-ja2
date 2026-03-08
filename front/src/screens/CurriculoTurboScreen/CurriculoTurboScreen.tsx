import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getCheckoutSession, syncSubscription } from '../../lib/stripe';
import { clearProfileCache } from '../../components/ProtectedRoute/ProtectedRoute';
import { HeroSection } from './components/HeroSection';
import { ResumeAnalyzer } from './components/ResumeAnalyzer';
import * as S from './CurriculoTurboScreen.styles';

export const CurriculoTurboScreen: React.FC = () => {
  const { t } = useTranslation();
  const { currentUser, refreshUserData } = useAuth();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();

  // Payment session verification
  React.useEffect(() => {
    const sessionId = params.get('session_id');
    if (sessionId) {
      const checkPaymentStatus = async () => {
        try {
          const session = await getCheckoutSession(sessionId);

          if (session.status === 'paid') {
            try {
              await syncSubscription(sessionId, currentUser?.uid);
              await refreshUserData();
              clearProfileCache();
            } catch (syncError) {
              console.error('Erro ao sincronizar subscription:', syncError);
            }
            setParams(prev => {
              const newParams = new URLSearchParams(prev);
              newParams.delete('session_id');
              return newParams;
            });
            navigate('/cv-automation', { replace: true });
          } else if (session.status === 'pending') {
            navigate('/pending-payment', { replace: true });
          } else if (session.status === 'expired') {
            navigate('/pending-payment?type=expired', { replace: true });
          } else {
            navigate('/pending-payment', { replace: true });
          }
        } catch (error) {
          console.error('Erro ao verificar status do pagamento:', error);
          navigate('/pending-payment', { replace: true });
        }
      };

      checkPaymentStatus();
    }
  }, [params, navigate, currentUser, refreshUserData, setParams]);

  return (
    <S.Wrapper>
      <S.PageHeader>
        <S.PageTitle>{t('home.heroTitle')}</S.PageTitle>
        <S.PageSubtitle>{t('home.heroSubtitle')}</S.PageSubtitle>
      </S.PageHeader>

      <S.ContentWrapper>
        <S.DashboardGrid>
          <HeroSection />
          <S.MainColumn>
            <ResumeAnalyzer />
          </S.MainColumn>
        </S.DashboardGrid>
      </S.ContentWrapper>
    </S.Wrapper>
  );
};
