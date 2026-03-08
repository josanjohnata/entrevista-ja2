import styled from 'styled-components';
import { theme } from '../../../GlobalStyles';

export const Header = styled.header`
  background-color: #f5f5f5;
  top: 0;
  z-index: 50;
  width: 100%;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
`;

export const NavContainer = styled.div`
  display: flex;
  height: 4rem;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 1.5rem;
`;

export const DesktopNav = styled.nav`
  display: none;
  align-items: center;
  gap: 1.5rem;
  
  @media (min-width: ${theme.breakpoints.md}) {
    display: flex;
  }
`;

export const NavLink = styled.a`
  font-size: 0.875rem;
  font-weight: 500;
  color: #171717;
  transition: color 0.3s ease;
  text-decoration: none;

  &:hover {
    color: #0a0a0a;
  }
`;

export const MobileMenuButton = styled.button`
  display: block;
  background: none;
  border: none;
  cursor: pointer;
  color: #171717;

  @media (min-width: ${theme.breakpoints.md}) {
    display: none;
  }
`;

export const LoginButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.5rem;
  cursor: pointer;
  border: 1px solid #d4d4d4;
  transition: all 0.2s ease;
  background-color: #fff;
  color: #171717;
  text-decoration: none;

  &:hover {
    border-color: #a3a3a3;
    background-color: #fafafa;
  }
`;

export const MobileSheet = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  height: auto;
  min-height: 300px;
  max-height: 90vh;
  width: 80%;
  max-width: 300px;
  background-color: #fafafa;
  z-index: 100;
  box-shadow: -10px 0 20px rgba(0, 0, 0, 0.1);
  border-radius: 0 0 0 1rem;
  color: #171717;
  transform: translateX(${({ $isOpen }) => ($isOpen ? '0' : '100%')});
  transition: transform 0.3s ease-in-out, visibility 0.3s ease-in-out;
  visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
  pointer-events: ${({ $isOpen }) => ($isOpen ? 'auto' : 'none')};

  display: flex;
  flex-direction: column;
  padding: 2rem;
  gap: 2rem;

  ${NavLink} {
    font-size: 1.25rem;
  }
  
  ${LoginButton} {
    width: 100%;
  }
`;
