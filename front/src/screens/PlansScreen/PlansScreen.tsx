import React, { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiCheck, FiShield, FiArrowLeft } from 'react-icons/fi';
import * as S from './styles';
import { getRegionConfig } from '../../utils/regionDetector';

export const PlansScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';

  const regionConfig = useMemo(() => getRegionConfig(), []);

  const prices = useMemo(() => {
    if (regionConfig.region === 'BR') {
      return {
        monthly: { amount: '39', cents: ',90', currency: 'R$', perMonth: '39,90' },
        lifetime: { 
          amount: '79', 
          cents: ',80', 
          currency: 'R$', 
          originalPrice: '798,00',
          discount: '90%'
        }
      };
    } else if (regionConfig.region === 'EU') {
      return {
        monthly: { amount: '9', cents: ',90', currency: '€', perMonth: '9,90' },
        lifetime: { 
          amount: '29', 
          cents: ',90', 
          currency: '€', 
          originalPrice: '299,00',
          discount: '90%'
        }
      };
    } else {
      return {
        monthly: { amount: '9', cents: '.90', currency: '$', perMonth: '9.90' },
        lifetime: { 
          amount: '29', 
          cents: '.90', 
          currency: '$', 
          originalPrice: '299.00',
          discount: '90%'
        }
      };
    }
  }, [regionConfig]);

  const handleSelectPlan = (planId: 'monthly' | 'lifetime') => {
    const params = new URLSearchParams({ plan: planId });
    if (email) params.set('email', email);
    navigate(`/checkout?${params.toString()}`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const planFeatures = t('plans.features.monthly', { returnObjects: true }) as string[];

  return (
    <>
      <S.PlansGlobalStyles />
      <S.PageWrapper>
      <S.BackButton onClick={handleBack}>
        <FiArrowLeft size={18} />
        {t('plans.back')}
      </S.BackButton>
      
      <S.Container>
        <S.Header>
          <S.Title>
            {t('plans.title')} <span>{t('plans.titleSpan')}</span>
          </S.Title>
          <S.Subtitle>
            {t('plans.subtitle')}
          </S.Subtitle>
        </S.Header>

        <S.PlansGrid>
          <S.PlanCard $isPopular={false} $delay={0}>
            <S.PlanName>{t('plans.monthly')}</S.PlanName>
            <S.PlanDescription>{t('plans.monthlyDescription')}</S.PlanDescription>
            
            <S.PriceContainer>
              <S.Price>
                <S.Currency>{prices.monthly.currency}</S.Currency>
                <S.Amount>{prices.monthly.amount}</S.Amount>
                <S.Cents>{prices.monthly.cents}</S.Cents>
                <S.Period>{t('plans.perMonth')}</S.Period>
              </S.Price>
            </S.PriceContainer>
            
            <S.FeaturesList>
              {planFeatures.map((feature, idx) => (
                <S.FeatureItem key={idx}>
                  <FiCheck size={18} />
                  <span>{feature}</span>
                </S.FeatureItem>
              ))}
            </S.FeaturesList>
            
            <S.SelectButton 
              $isPopular={false}
              onClick={() => handleSelectPlan('monthly')}
            >
              {t('plans.startNow')}
            </S.SelectButton>
          </S.PlanCard>

          <S.PlanCard $isPopular={true} $delay={200}>
            <S.PopularBadge>{t('plans.limitedTime')}</S.PopularBadge>
            <S.DiscountBadge>{prices.lifetime.discount} {t('plans.off')}</S.DiscountBadge>
            
            <S.PlanName>{t('plans.lifetime')}</S.PlanName>
            <S.PlanDescription>{t('plans.lifetimeDescription')}</S.PlanDescription>
            
            <S.PriceContainer>
              <S.Price>
                <S.OriginalPrice>
                  {t('plans.from')} {prices.lifetime.currency} {prices.lifetime.originalPrice}
                </S.OriginalPrice>
                <S.PriceText>{t('plans.for')}</S.PriceText>
                <S.CurrentPrice>
                  {prices.lifetime.currency} {prices.lifetime.amount}{prices.lifetime.cents}
                </S.CurrentPrice>
                <S.Period>{t('plans.lifetimePeriod')}</S.Period>
              </S.Price>
            </S.PriceContainer>
            
            <S.FeaturesList>
              {planFeatures.map((feature, idx) => (
                <S.FeatureItem key={idx}>
                  <FiCheck size={18} />
                  <span>{feature}</span>
                </S.FeatureItem>
              ))}
            </S.FeaturesList>
            
            <S.SelectButton 
              $isPopular={true}
              onClick={() => handleSelectPlan('lifetime')}
            >
              {t('plans.startNow')}
            </S.SelectButton>
          </S.PlanCard>
        </S.PlansGrid>

        <S.Guarantee>
          <FiShield size={24} />
          <p>
            <strong>{t('plans.guarantee')}</strong> — {t('plans.guaranteeText')}
          </p>
        </S.Guarantee>
      </S.Container>
    </S.PageWrapper>
    </>
  );
};
