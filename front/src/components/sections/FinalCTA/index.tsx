import React from 'react';
import { useTranslation } from 'react-i18next';
import { Container } from '../../common/Container';
import * as S from './styles';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../routes/paths';

export const FinalCTA: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <S.CTASection id="cta-final">
      <Container style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <h1>{t('landing.finalCTA.title')}</h1>
        <p style={{ maxWidth: '650px', marginTop: '1rem', fontSize: '1.125rem' }}>
          {t('landing.finalCTA.description')}
        </p>
        <S.CTAButton as={Link} to={ROUTES.PAGAMENTO} style={{ marginTop: '2.5rem' }}>
          {t('landing.finalCTA.button')}
        </S.CTAButton>
      </Container>
    </S.CTASection>
  );
};
