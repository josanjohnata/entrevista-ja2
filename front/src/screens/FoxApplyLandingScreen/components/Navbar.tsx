import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { ROUTES } from '../../../routes/paths';
import styled from 'styled-components';
import { Menu, X } from 'lucide-react';
import { Button } from '../styles';
import { useReferralTracking } from '../../../hooks/useReferralTracking';

const Nav = styled.nav<{ $scrolled: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  transition: all 0.3s ease;
  padding: ${({ $scrolled }) => ($scrolled ? '0.75rem 0' : '1.25rem 0')};
  background: ${({ $scrolled }) => 
    $scrolled ? 'oklch(0.15 0.015 260 / 0.8)' : 'transparent'};
  backdrop-filter: ${({ $scrolled }) => ($scrolled ? 'blur(12px)' : 'none')};
`;

const NavContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  gap: 2rem;
  
  @media (min-width: 1024px) {
    padding: 0 2rem;
  }
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: var(--text-primary);
  z-index: 60;
  
  img {
    height: 2.5rem;
    width: 2.5rem;
  }
  
  span {
    font-size: 1.25rem;
    font-weight: 700;
    font-family: var(--font-display);
    
    .highlight {
      color: var(--neon-orange);
    }
    
    @media (max-width: 480px) {
      font-size: 1rem;
    }
  }
`;

const NavLinks = styled.div`
  display: none;
  align-items: center;
  gap: 2rem;
  margin-left: auto;
  
  @media (min-width: 768px) {
    display: flex;
  }
  
  a, .nav-link {
    font-size: 0.875rem;
    font-weight: 600;
    color: white;
    text-decoration: none;
    transition: color 0.3s ease;
    
    &:hover {
      color: var(--neon-orange);
    }
  }
`;

const NavActions = styled.div`
  display: none;
  align-items: center;
  gap: 0.5rem;
  
  @media (min-width: 768px) {
    display: flex;
    gap: 1rem;
  }
  
  button,
  a {
    white-space: nowrap;
  }
`;

const MobileMenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  padding: 0.5rem;
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  z-index: 60;
  transition: color 0.3s ease;
  
  &:hover {
    color: var(--neon-orange);
  }
  
  @media (min-width: 768px) {
    display: none;
  }
`;

const MobileMenu = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: oklch(0.08 0.01 260 / 0.98);
  backdrop-filter: blur(12px);
  z-index: 55;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  padding: 2rem;
  transform: ${({ $isOpen }) => ($isOpen ? 'translateX(0)' : 'translateX(100%)')};
  opacity: ${({ $isOpen }) => ($isOpen ? '1' : '0')};
  transition: transform 0.3s ease, opacity 0.3s ease;
  
  @media (min-width: 768px) {
    display: none;
  }
`;

const MobileNavLinks = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  width: 100%;
  
  a, .nav-link {
    font-size: 1.25rem;
    font-weight: 600;
    color: white;
    text-decoration: none;
    transition: color 0.3s ease;
    
    &:hover {
      color: var(--neon-orange);
    }
  }
`;

const MobileNavActions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 1rem;
  width: 100%;
  max-width: 300px;
  margin-top: 1rem;
`;

const MobileLoginButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.875rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  text-decoration: none;
  border: 1px solid oklch(1 0 0 / 0.2);
  border-radius: 0.5rem;
  background: transparent;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    color: var(--neon-orange);
    border-color: var(--neon-orange);
    background: oklch(0.72 0.19 45 / 0.1);
  }
`;

const LoginButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  text-decoration: none;
  border: 1px solid oklch(1 0 0 / 0.2);
  border-radius: 0.5rem;
  background: transparent;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    color: var(--neon-orange);
    border-color: var(--neon-orange);
    background: oklch(0.72 0.19 45 / 0.1);
  }
`;

interface NavbarProps {
  hideSectionLinks?: boolean;
  hideActionButtons?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ hideSectionLinks = false, hideActionButtons = false }) => {
  const { t } = useTranslation();
  const { getCheckoutUrl, trackCheckoutClick } = useReferralTracking();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    // Prevent body scroll when mobile menu is open
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);
  
  const closeMobileMenu = () => setMobileMenuOpen(false);
  
  return (
    <>
      <Nav $scrolled={scrolled}>
        <NavContainer>
          <Logo to="/">
            <img 
              src="/images/fox-mascot.png" 
              alt="Entrevista Já"
            />
            <span>
              Fox<span className="highlight">Apply</span>
            </span>
          </Logo>
          
          {!hideSectionLinks && (
            <NavLinks>
              <HashLink smooth to="/#como-funciona" className="nav-link">{t('foxApplyLanding.navbar.howItWorks')}</HashLink>
              <HashLink smooth to="/#recursos" className="nav-link">{t('foxApplyLanding.navbar.features')}</HashLink>
              <HashLink smooth to="/#linkedin-champion" className="nav-link">{t('foxApplyLanding.navbar.linkedinChampion')}</HashLink>
              <Link to={ROUTES.BLOG} className="nav-link">{t('foxApplyLanding.navbar.blog')}</Link>
            </NavLinks>
          )}
          
          {!hideActionButtons && (
            <NavActions>
              <LoginButton to={ROUTES.LOGIN}>
                {t('foxApplyLanding.navbar.login')}
              </LoginButton>
              <Button 
                as={Link} 
                to={getCheckoutUrl()} 
                className="glow-orange"
                onClick={trackCheckoutClick}
              >
                {t('foxApplyLanding.navbar.getStarted')}
              </Button>
            </NavActions>
          )}
          
          {!hideActionButtons && (
            <MobileMenuButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </MobileMenuButton>
          )}
        </NavContainer>
      </Nav>
      
      {!hideActionButtons && (
        <MobileMenu $isOpen={mobileMenuOpen}>
          {!hideSectionLinks && (
            <MobileNavLinks>
              <HashLink smooth to="/#como-funciona" className="nav-link" onClick={closeMobileMenu}>
                {t('foxApplyLanding.navbar.howItWorks')}
              </HashLink>
              <HashLink smooth to="/#recursos" className="nav-link" onClick={closeMobileMenu}>
                {t('foxApplyLanding.navbar.features')}
              </HashLink>
              <HashLink smooth to="/#linkedin-champion" className="nav-link" onClick={closeMobileMenu}>
                {t('foxApplyLanding.navbar.linkedinChampion')}
              </HashLink>
              <Link to={ROUTES.BLOG} className="nav-link" onClick={closeMobileMenu}>
                {t('foxApplyLanding.navbar.blog')}
              </Link>
            </MobileNavLinks>
          )}
          
          <MobileNavActions>
            <MobileLoginButton to={ROUTES.LOGIN} onClick={closeMobileMenu}>
              {t('foxApplyLanding.navbar.login')}
            </MobileLoginButton>
            <Button 
              as={Link} 
              to={getCheckoutUrl()} 
              className="glow-orange" 
              size="lg"
              onClick={() => {
                trackCheckoutClick();
                closeMobileMenu();
              }}
            >
              {t('foxApplyLanding.navbar.getStarted')}
            </Button>
          </MobileNavActions>
        </MobileMenu>
      )}
    </>
  );
};

