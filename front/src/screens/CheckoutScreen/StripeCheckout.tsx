import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FiLoader, FiAlertCircle } from 'react-icons/fi';
import { 
  createCheckoutSession
} from '../../lib/stripe';
import { getRegionConfig, getPlanPrice } from '../../utils/regionDetector';
import * as S from './stripeStyles';

interface StripeCheckoutProps {
  planId: string;
  userId: string;
  email: string;
  customerName?: string;
}

export const StripeCheckout: React.FC<StripeCheckoutProps> = ({
  planId,
  userId,
  email,
  customerName,
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const regionConfig = useMemo(() => getRegionConfig(), []);
  
  // Determinar o tipo de plano (monthly, quarterly ou lifetime) baseado no planId
  const planType = planId?.includes('lifetime') ? 'lifetime' : planId?.includes('quarterly') ? 'quarterly' : 'monthly';
  const planPrice = useMemo(() => getPlanPrice(regionConfig.region, planType), [regionConfig.region, planType]);

  useEffect(() => {
    const redirectToStripe = async () => {
      try {
        setLoading(true);
        setError(null);

        const session = await createCheckoutSession({
          planId: planId || 'plan_monthly',
          userId,
          email,
          amount: planPrice.price,
          currency: regionConfig.currency.toLowerCase() as 'brl' | 'eur' | 'usd',
          customerName: customerName || undefined,
          productName: planType === 'lifetime' ? `${t('plans.lifetime')} - FoxApply` : planType === 'quarterly' ? `${t('plans.quarterly')} - FoxApply` : `${t('plans.monthlyPlan')} - FoxApply`,
          productDescription: planType === 'lifetime' ? t('plans.lifetimeDescription') : planType === 'quarterly' ? t('plans.quarterlyDescription') : t('plans.monthlyPlanDescription'),
          metadata: {
            userId,
            planId: planId || 'plan_monthly',
          },
        });

        if (session.url) {
          window.location.href = session.url;
        } else {
          setError(t('checkout.sessionCreateError'));
          setLoading(false);
        }
      } catch (err) {
        console.error('Erro ao redirecionar para Stripe:', err);
        const errorMessage = err instanceof Error ? err.message : t('errors.backend.UNKNOWN_ERROR');
        setError(errorMessage);
        setLoading(false);
      }
    };

    redirectToStripe();
  }, [planId, userId, email, customerName, planPrice.price, regionConfig.currency, planType, t]);

  return (
    <S.Container>
      {error && (
        <S.ErrorMessage>
          <FiAlertCircle size={18} />
          {error}
        </S.ErrorMessage>
      )}

      <S.ContentCard>
        <S.PlanSummary>
          <h3>{planType === 'lifetime' ? t('plans.lifetime') : planType === 'quarterly' ? t('plans.quarterly') : t('plans.monthlyPlan')}</h3>
          <p>{regionConfig.currencySymbol} {planPrice.priceDisplay}</p>
        </S.PlanSummary>

        {loading ? (
          <S.LoadingBox>
            <FiLoader className="spinning" size={24} />
            <span>{t('checkout.redirectingToPayment')}</span>
          </S.LoadingBox>
        ) : error ? (
          <S.CardInfo>
            {error}
          </S.CardInfo>
        ) : null}
      </S.ContentCard>
    </S.Container>
  );
};

