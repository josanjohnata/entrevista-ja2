import styled from 'styled-components';
import { theme } from '../../GlobalStyles';

export const HeaderContainer = styled.header`
  background-color: #FFFFFF;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  position: sticky;
  top: 0;
  z-index: 50;
`;

export const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0.75rem 1.5rem;
`;

export const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  @media (max-width: 767px) {
    display: none;
  }
`;

export const NavLink = styled.a<{ $isActive?: boolean }>`
  font-family: 'Readex Pro', sans-serif;
  font-size: 1rem;
  font-weight: 400;
  color: #4F4F4F;
  padding: 0.5rem;
  border-radius: 6px;
  transition: background-color 0.3s;
  text-decoration: none;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  ${({ $isActive }) =>
    $isActive &&
    `
    color: #4A90E2;
    &::after {
      content: '';
      position: absolute;
      bottom: -12px;
      left: 0;
      right: 0;
      height: 2px;
      background-color: #4A90E2;
    }
  `}
`;

export const LoginButton = styled(NavLink)`
  font-family: 'Readex Pro', sans-serif;
  font-size: 1rem;
  font-weight: 400;
  color: #374151;
  padding: 0.5rem 1rem;

  &:hover {
    opacity: 0.8;
  }

  &::after {
    display: none !important;
  }
`;

export const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  color: #374151;
  
  @media (max-width: 767px) {
    display: block;
  }
  
  &:hover {
    color: ${theme.colors.primary.light};
  }
`;

export const MobileMenu = styled.div<{ isOpen: boolean }>`
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
  flex-direction: column;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: white;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  z-index: 30;
  padding: 0.5rem;

  @media (min-width: 768px) {
    display: none !important;
  }

  ${NavLink} {
    display: block;
    width: 100%;
    padding: 0.75rem;
    margin: 0.25rem 0;
  }

  ${LoginButton} {
    display: block;
    text-align: center;
    width: auto;
    margin: 0.5rem;
  }
`;

export const UserInfo = styled.div`
  font-family: 'Readex Pro', sans-serif;
  font-size: 0.9rem;
  font-weight: 400;
  padding: 0.5rem;
  border-bottom: 1px solid #E5E7EB;
  color: #666;
`;

export const MobileMenuItem = styled.button`
  font-family: 'Readex Pro', sans-serif;
  font-size: 1rem;
  font-weight: 400;
  width: 100%;
  text-align: left;
  padding: 0.75rem;
  border: none;
  background-color: transparent;
  cursor: pointer;
  color: #4F4F4F;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background-color: #f3f4f6;
  }
`;
