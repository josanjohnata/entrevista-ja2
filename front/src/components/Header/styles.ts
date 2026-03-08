import styled from 'styled-components';

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

export const Logo = styled.a`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  font-family: 'Readex Pro', sans-serif;
`;

export const LogoImage = styled.img`
  height: 2rem;
  width: auto;
  object-fit: contain;
`;

export const LogoText = styled.span`
  font-size: 1.5rem;
  font-weight: bold;
`;

export const NavLinks = styled.div`
  display: none;
  @media (min-width: 768px) {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
`;

export const NavLink = styled.a<{ $isActive?: boolean }>`
  font-family: 'Readex Pro', sans-serif;
  color: #4F4F4F;
  padding: 0.5rem;
  border-radius: 6px;
  transition: background-color 0.3s;
  text-decoration: none;
  cursor: pointer;
  position: relative;

  &:hover {
    background-color: #DBDBD4;
  }

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
  background-color: #4A90E2;
  color: #FFFFFF;
  padding: 0.5rem 1rem;

  &:hover {
    background-color: #357ABD;
  }

  &::after {
    display: none !important;
  }
`;

export const MobileMenuButton = styled.button`
  display: block;
  background: none;
  border: none;
  cursor: pointer;
  @media (min-width: 768px) {
    display: none;
  }
`;

export const MobileMenu = styled.div<{ isOpen: boolean }>`
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  padding: 0 1.5rem 0.75rem;
  margin-bottom: 0.25rem;

  @media (min-width: 768px) {
    display: none;
  }

  ${NavLink} {
    display: block;
  }

  ${LoginButton} {
    display: block;
    text-align: center;
  }
`;

export const UserInfoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const UserInfoText = styled.span`
  font-size: 0.9rem;
  color: #666;
`;

export const MobileUserInfo = styled.div`
  padding: 0.5rem;
  font-size: 0.9rem;
  color: #666;
`;
