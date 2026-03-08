import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../../GlobalStyles';

export const HeaderContainer = styled.header`
  width: 100%;
  padding: 1rem 2rem;
  background-color: transparent;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
`;

export const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
`;

export const LogoImage = styled.img`
  height: 2rem;
  width: auto;
  object-fit: contain;
`;

export const LogoText = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${theme.colors.primary.main};
`;
