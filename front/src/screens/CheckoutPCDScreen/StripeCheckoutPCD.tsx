import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FiLoader, FiAlertCircle } from 'react-icons/fi';
import { 
  createCheckoutSessionPCD
} from '../../lib/stripe';
import { getRegionConfig } from '../../utils/regionDetector';
import * as S from './stripeStyles';

interface StripeCheckoutPCDProps {
  planId: string;
  userId: string;
  email: string;
  customerName?: string;
}

export const StripeCheckoutPCD: React.FC<StripeCheckoutPCDProps> = ({
  planId,
  userId,
  email,
  customerName,
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const regionConfig = useMemo(() => getRegionConfig(), []);

  useEffect(() => {
    const redirectToStripe = async () => {
      try {
        setLoading(true);
        setError(null);

        const session = await createCheckoutSessionPCD({
          planId: planId || 'plan_monthly',
          userId,
          email,
          amount: regionConfig.price,
          currency: regionConfig.currency.toLowerCase() as 'brl' | 'eur' | 'usd',
          customerName: customerName || undefined,
          productName: `${t('checkoutPCD.monthlyPlan')} - Entrevista Já`,
          productDescription: t('checkoutPCD.monthlyPlanDescription'),
          metadata: {
            userId,
            planId: planId || 'plan_monthly',
            isPCD: 'true',
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
  }, [planId, userId, email, customerName, regionConfig.price, regionConfig.currency, t]);

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
          <h3>{t('checkoutPCD.monthlyPlan')}</h3>
          <div>
            <p style={{ textDecoration: 'line-through', opacity: 0.6, fontSize: '14px', margin: 0 }}>
              {regionConfig.currencySymbol} {regionConfig.priceDisplay}
            </p>
            <p style={{ color: '#10b981', fontSize: '18px', fontWeight: 700, margin: '4px 0 0 0' }}>
              {t('checkoutPCD.freeFor30Days')}
            </p>
          </div>
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

