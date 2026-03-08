import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Logo } from '../../Logo';
import { FiMenu, FiX } from 'react-icons/fi';
import * as S from './styles';
import type { NavItem } from '../../../types/index';
import { Link } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks: NavItem[] = [
    { href: '#funcionamento', label: t('landing.navbar.howItWorks') },
    { href: '#contato', label: t('landing.navbar.contact') },
  ];

  return (
    <S.Header>
      <S.NavContainer>
        <Logo />

        <S.DesktopNav>
          {navLinks.map((link) => (
            <S.NavLink key={link.label} href={link.href}>{link.label}</S.NavLink>
          ))}
          <S.NavLink as={Link} to="/checkout">{t('landing.navbar.signUp')}</S.NavLink>
          <S.LoginButton as={Link} to="/login">{t('landing.navbar.login')}</S.LoginButton>
        </S.DesktopNav>

        <S.MobileMenuButton onClick={() => setIsMobileMenuOpen(true)}>
          <FiMenu size={24} />
        </S.MobileMenuButton>
      </S.NavContainer>

      <S.MobileSheet $isOpen={isMobileMenuOpen}>
        <S.MobileMenuButton onClick={() => setIsMobileMenuOpen(false)} style={{ alignSelf: 'flex-end' }}>
          <FiX size={24} />
        </S.MobileMenuButton>
        <Logo />
        {navLinks.map((link) => (
          <S.NavLink key={link.label} href={link.href} onClick={() => setIsMobileMenuOpen(false)}>
            {link.label}
          </S.NavLink>
        ))}
        <S.NavLink as={Link} to="/checkout" onClick={() => setIsMobileMenuOpen(false)}>
          {t('landing.navbar.signUp')}
        </S.NavLink>
        <S.LoginButton as={Link} to="/login">{t('landing.navbar.login')}</S.LoginButton>
      </S.MobileSheet>
    </S.Header>
  );
};
