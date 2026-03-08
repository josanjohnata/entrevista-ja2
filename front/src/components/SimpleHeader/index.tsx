import React from 'react';
import { HeaderContainer, LogoLink, LogoImage, LogoText } from './styles';
import logoImage from '../../assets/logo.png';

export const SimpleHeader: React.FC = () => {
  return (
    <HeaderContainer>
      <LogoLink to="/">
        <LogoImage src={logoImage} alt="Logo" />
        <LogoText>FoxApply</LogoText>
      </LogoLink>
    </HeaderContainer>
  );
};

