import React from 'react';
import styled from 'styled-components';
import { theme } from '../GlobalStyles';
import { Link } from 'react-router-dom';
import { ROUTES } from '../routes/paths';

const LogoLink = styled.a`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  font-size: 1.25rem;
  font-weight: 700;
  color: inherit;
`;

export const Logo: React.FC = () => {
  return (
    <LogoLink as={Link} to={ROUTES.HOME}>
      Entrevista Já
    </LogoLink>
  );
};
