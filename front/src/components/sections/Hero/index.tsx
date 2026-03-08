import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { db } from '../../../lib/firebase';
import { Button } from '../../common/Button';
import { Input } from '../../common/Input';
import { Container } from '../../common/Container';
import * as S from './styles';

const useAnimatedCounter = (targetValue: number, duration: number = 1500) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);

  useEffect(() => {
    if (targetValue === 0) return;
    
    const startTime = Date.now();
    const startValue = countRef.current;
    
    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(startValue + (targetValue - startValue) * easeOutQuart);
      
      setCount(currentValue);
      countRef.current = currentValue;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [targetValue, duration]);

  return count;
};

export const Hero: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [userCount, setUserCount] = useState(0);
  const navigate = useNavigate();
  
  const animatedCount = useAnimatedCounter(userCount);

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
    navigate(`/checkout?email=${encodeURIComponent(email)}`);
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
              <Input 
                type="email" 
                placeholder={t('landing.hero.emailPlaceholder')} 
                value={email}
                onChange={handleChange}
                style={error ? { borderColor: '#dc2626' } : undefined}
              />
              {error && <S.ErrorMessage>{error}</S.ErrorMessage>}
            </S.InputWrapper>
            <Button type="submit">
              {t('landing.hero.startNow')}
            </Button>
          </S.FormContainer>
          <S.FinePrint>
            {t('landing.hero.freeTrial')}
          </S.FinePrint>
        </S.HeroContent>
      </Container>
    </S.HeroSection>
  );
};
