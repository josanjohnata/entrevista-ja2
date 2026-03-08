import React from 'react';
import { HeaderContainer, LogoLink, LogoText } from './styles';
import { ROUTES } from '../../routes/paths';

export const SimpleHeader: React.FC = () => {
  return (
    <HeaderContainer>
      <LogoLink to={ROUTES.HOME}>
        <LogoText>Entrevista Já</LogoText>
      </LogoLink>
    </HeaderContainer>
  );
};

