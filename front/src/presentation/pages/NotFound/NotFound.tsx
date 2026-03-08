import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../routes/paths';
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
        <S.Cta onClick={() => navigate(ROUTES.HOME)}>
          <ArrowLeft />
          {t('notFound.backToHome')}
        </S.Cta>
      </S.Content>

      <S.Footer>Entrevista Já</S.Footer>
    </S.Container>
  );
};
