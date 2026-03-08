import React from 'react';
import { HeaderContainer, LogoLink, LogoImage, LogoText } from './styles';
import logoImage from '../../assets/logo.png';
import { ROUTES } from '../../routes/paths';

export const SimpleHeader: React.FC = () => {
  return (
    <HeaderContainer>
      <LogoLink to={ROUTES.HOME}>
        <LogoImage src={logoImage} alt="Logo" />
        <LogoText>FoxApply</LogoText>
      </LogoLink>
    </HeaderContainer>
  );
};

