import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';

import * as S from './NotFound.styles';

export const NotFoundPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location.pathname);
  }, [location.pathname]);

  return (
    <S.Container>
      {/* Fox logo with orbit rings */}
      <S.FoxWrapper>
        <S.OrbitRing />
        <S.OrbitRingInner />
        <svg
          width="56"
          height="56"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="fg404" x1="10%" y1="0%" x2="90%" y2="100%">
              <stop offset="0%" stopColor="#FF7A2E" />
              <stop offset="100%" stopColor="#CC4400" />
            </linearGradient>
            <linearGradient id="fe404" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#FFB088" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#FF8844" stopOpacity="0.25" />
            </linearGradient>
            <linearGradient id="fm404" x1="50%" y1="20%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#FFEEDD" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#FFCCAA" stopOpacity="0.08" />
            </linearGradient>
          </defs>

          <path
            d="M 10 8 L 24 26 L 32 20 L 40 26 L 54 8 L 50 42 L 32 58 L 14 42 Z"
            fill="url(#fg404)"
          />
          <path
            d="M 25 33 L 32 52 L 39 33 L 32 27 Z"
            fill="url(#fm404)"
            opacity="0.85"
          />
          <S.FoxDetail d="M 14 13 L 23 25 L 20 17 Z" fill="url(#fe404)" $delay={0.15} />
          <S.FoxDetail d="M 50 13 L 41 25 L 44 17 Z" fill="url(#fe404)" $delay={0.25} />
          <S.FoxDetail d="M 30 45 L 32 49 L 34 45 Z" fill="rgba(0,0,0,0.5)" $delay={0.4} />
        </svg>
      </S.FoxWrapper>

      {/* 404 */}
      <S.CodeBlock>
        <S.Code>404</S.Code>
      </S.CodeBlock>

      {/* Content */}
      <S.Content>
        <S.Title>{t('notFound.title')}</S.Title>
        <S.Message>{t('notFound.message')}</S.Message>
        <S.PathChip>
          <S.StatusDot />
          {location.pathname}
        </S.PathChip>
        <br />
        <S.Cta onClick={() => navigate('/')}>
          <ArrowLeft />
          {t('notFound.backToHome')}
        </S.Cta>
      </S.Content>

      <S.Footer>FoxApply</S.Footer>
    </S.Container>
  );
};
