import React from 'react';
import styled from 'styled-components';
import { theme } from '../GlobalStyles';
import { Link } from 'react-router-dom';
import logoImage from '../assets/logo.png';

const LogoLink = styled.a`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  font-size: 1.25rem;
  font-weight: 700;
  color: ${theme.colors.primary.main};
`;

const LogoImage = styled.img`
  height: 2rem;
  width: auto;
  object-fit: contain;
`;

export const Logo: React.FC = () => {
  return (
    <LogoLink as={Link} to="/cv-automation">
      <LogoImage src={logoImage} alt="Logo" />
      <span>FoxApply</span>
    </LogoLink>
  );
};
