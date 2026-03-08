import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../routes/paths';
import { db } from '../../../lib/firebase';
import { Container } from '../../common/Container';
import * as S from './styles';

export const Hero: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [, setUserCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchUserCount = async () => {
      try {
        const { doc, getDoc } = await import('firebase/firestore');
        const statsRef = doc(db, 'stats', 'users');
        const statsDoc = await getDoc(statsRef);
        
        if (isMounted && statsDoc.exists()) {
          const count = statsDoc.data().count || 0;
          setUserCount(count);
        }
      } catch (err) {
        console.error('Erro ao buscar contagem:', err);
      }
    };

    fetchUserCount();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const isValidEmail = email.trim() !== '' && email.includes('@');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail) {
      setError(t('landing.hero.invalidEmail'));
      return;
    }
    setError('');
    navigate(`${ROUTES.PAGAMENTO}?email=${encodeURIComponent(email)}`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  return (
    <S.HeroSection id="hero">
      <Container>
        <S.HeroContent>
          <S.Title>{t('landing.hero.title')}</S.Title>
          <S.Subtitle>
            {t('landing.hero.subtitle')}
          </S.Subtitle>
          
            {/* <S.SocialProof>
              <CounterNumber>{animatedCount.toLocaleString('pt-BR')}</CounterNumber>
              <CounterText>{t('landing.hero.socialProof')}</CounterText>
            </S.SocialProof> */}
          
          <S.FormContainer as="form" onSubmit={handleSubmit}>
            <S.InputWrapper>
              <S.EmailInput
                type="email"
                placeholder={t('landing.hero.emailPlaceholder')}
                value={email}
                onChange={handleChange}
                style={error ? { borderColor: '#dc2626' } : undefined}
              />
              {error && <S.ErrorMessage>{error}</S.ErrorMessage>}
            </S.InputWrapper>
            <S.CTAButton type="submit">
              {t('landing.hero.startNow')}
            </S.CTAButton>
          </S.FormContainer>
          <S.FinePrint>
            {t('landing.hero.freeTrial')}
          </S.FinePrint>
        </S.HeroContent>
      </Container>
    </S.HeroSection>
  );
};
