import React from 'react';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { ROUTES } from '../../../routes/paths';
import styled from 'styled-components';
import { Button } from '../styles';

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  background: hsl(222, 47%, 6%)CC;
  backdrop-filter: blur(12px);
  border-bottom: 1px solid hsl(222, 30%, 16%);
  height: 4rem;
`;

const NavContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  @media (min-width: 1024px) {
    padding: 0 2rem;
  }
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: hsl(210, 40%, 98%);
  
  span {
    font-size: 1.25rem;
    font-weight: 700;
    
    .highlight {
      color: hsl(24, 95%, 53%);
    }
  }
`;

const NavLinks = styled.div`
  display: none;
  align-items: center;
  gap: 2rem;
  
  @media (min-width: 768px) {
    display: flex;
  }
  
  a {
    font-size: 0.875rem;
    color: hsl(215, 20%, 55%);
    text-decoration: none;
    transition: color 0.3s ease;
    
    &:hover {
      color: hsl(210, 40%, 98%);
    }
  }
`;

const NavButton = styled(Button)`
  @media (max-width: 767px) {
    display: none;
  }
`;

export const Navbar: React.FC = () => {
  return (
    <Nav>
      <NavContainer>
        <Logo to={ROUTES.HOME}>
          <span>🦊</span>
          <span>
            Fox<span className="highlight">Apply</span>
          </span>
        </Logo>
        
        <NavLinks>
          <HashLink smooth to="/pcd#como-funciona">Como Funciona</HashLink>
          <HashLink smooth to="/pcd#recursos">Recursos</HashLink>
          <HashLink smooth to="/pcd#depoimentos">Depoimentos</HashLink>
          <Link to={ROUTES.BLOG}>Blog</Link>
          <HashLink smooth to="/pcd#faq">FAQ</HashLink>
        </NavLinks>
        
        <NavButton as={Link} to={ROUTES.PAGAMENTO_PCD} $size="sm">
          Começar Grátis
        </NavButton>
      </NavContainer>
    </Nav>
  );
};

