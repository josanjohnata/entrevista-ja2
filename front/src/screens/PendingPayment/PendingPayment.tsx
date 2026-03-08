import { useNavigate, useSearchParams } from 'react-router-dom';
import { FiAlertCircle, FiClock } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { createCheckoutSession } from '../../lib/stripe';
import { getRegionConfig } from '../../utils/regionDetector';
import { db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import * as S from './styles';

interface PendingPaymentProps {
  type?: 'pending' | 'expired';
}

export const PendingPaymentScreen: React.FC<PendingPaymentProps> = ({ type: propType }) => {
  const [params] = useSearchParams();
  const urlType = params.get('type') as 'pending' | 'expired' | null;
  const type = propType || urlType || 'pending';
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { currentUser, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    const fetchUserName = async () => {
      if (currentUser?.uid) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserName(userData.nome || '');
          }
        } catch (error) {
          console.error('Erro ao buscar nome do usuário:', error);
        }
      }
    };
    fetchUserName();
  }, [currentUser]);

  const handleGoToPlans = async () => {
    if (!currentUser?.uid || !currentUser?.email) {
      navigate('/checkout');
      return;
    }

    try {
      setLoading(true);
      const regionConfig = getRegionConfig();

      const session = await createCheckoutSession({
        planId: 'plan_monthly',
        userId: currentUser.uid,
        email: currentUser.email,
        amount: regionConfig.price,
        currency: regionConfig.currency.toLowerCase() as 'brl' | 'eur' | 'usd',
        customerName: userName || undefined,
        productName: `${t('plans.monthlyPlan')} - Entrevista Já`,
        productDescription: t('plans.monthlyPlanDescription'),
        metadata: {
          userId: currentUser.uid,
          planId: 'plan_monthly',
        },
      });

      if (session.url) {
        window.location.href = session.url;
      } else {
        console.error('Erro: URL da sessão não encontrada');
        setLoading(false);
      }
    } catch (error) {
      console.error('Erro ao criar sessão de checkout:', error);
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const isPending = type === 'pending';

  return (
    <S.PageWrapper>
      <S.Container>
        <S.IconWrapper>
          {isPending ? <FiClock size={40} /> : <FiAlertCircle size={40} />}
        </S.IconWrapper>

        <S.Title>
          {isPending ? t('pendingPayment.pendingTitle') : t('pendingPayment.expiredTitle')}
        </S.Title>

        <S.Description>
          {isPending 
            ? t('pendingPayment.pendingDescription')
            : t('pendingPayment.expiredDescription')}
        </S.Description>

        <S.Card>
          <S.StatusBadge $type={type}>
            {isPending ? <FiClock size={16} /> : <FiAlertCircle size={16} />}
            {isPending ? t('pendingPayment.awaitingPayment') : t('pendingPayment.planExpired')}
          </S.StatusBadge>

          <S.InfoRow>
            <span>{t('pendingPayment.email')}</span>
            <span>{currentUser?.email || '-'}</span>
          </S.InfoRow>
          
          <S.InfoRow>
            <span>{t('pendingPayment.status')}</span>
            <span>{isPending ? t('pendingPayment.pending') : t('pendingPayment.expired')}</span>
          </S.InfoRow>
        </S.Card>

        <S.PrimaryButton onClick={handleGoToPlans} disabled={loading}>
          {loading 
            ? t('checkout.redirectingToPayment') 
            : isPending 
              ? t('pendingPayment.finishPayment') 
              : t('pendingPayment.renewSubscription')}
        </S.PrimaryButton>

        <S.SecondaryButton onClick={handleLogout}>
          {t('pendingPayment.logout')}
        </S.SecondaryButton>

        <S.HelpText>
          {t('pendingPayment.helpText')}
          <br />
          {t('pendingPayment.needHelp')} <a href="mailto:suporte@entrevistaja.com">{t('pendingPayment.contactUs')}</a>
        </S.HelpText>
      </S.Container>
    </S.PageWrapper>
  );
};
