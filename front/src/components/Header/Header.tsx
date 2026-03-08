import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Download, User, Menu, X, FileText, Award, Mail, Search, Briefcase, LogOut, Activity, Bell } from 'lucide-react';
import { useAuth, UserRole } from '../../contexts/AuthContext';
import logoImage from '../../assets/logo.png';
import * as S from './Header.styles';

export const Header: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, currentUser, userData } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const closingRef = useRef(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuClosing, setMenuClosing] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const ADMIN_EMAILS = ['josanjohnata@gmail.com', 'edhurabelo@gmail.com'];
  const isAdmin = currentUser?.email && ADMIN_EMAILS.includes(currentUser.email);

  const getUserInitials = (): string => {
    const name = userData?.displayName || currentUser?.displayName || currentUser?.email || '';
    if (name.includes('@')) return name.charAt(0).toUpperCase();
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return name.charAt(0).toUpperCase() || '?';
  };

  const getRoleBadge = (): string => {
    if (!userData?.role) return '';
    const map: Record<string, string> = {
      [UserRole.RECRUITER]: 'Recruiter',
      [UserRole.QUARTERLY_PLAN]: 'Trimestral',
      [UserRole.MONTHLY_PLAN]: 'Mensal',
      [UserRole.BASIC_PLAN]: 'Basic',
    };
    return map[userData.role] || '';
  };

  const closeMenu = useCallback(() => {
    if (menuClosing) return;
    setMenuClosing(true);
    setTimeout(() => {
      setMenuOpen(false);
      setMenuClosing(false);
    }, 180);
  }, [menuClosing]);

  const toggleMenu = useCallback(() => {
    if (menuOpen) {
      closeMenu();
    } else {
      setMenuOpen(true);
      setMenuClosing(false);
    }
  }, [menuOpen, closeMenu]);

  const navItems = [
    { id: 'resume', label: t('header.resumeTurbo'), path: '/cv-automation', icon: <FileText size={18} /> },
    { id: 'linkedin-champion', label: t('header.linkedinChampion'), path: '/linkedin-champion', icon: <Award size={18} /> },
    { id: 'cover-letter', label: t('header.coverLetter'), path: '/cover-letter', icon: <Mail size={18} /> },
    { id: 'filter-jobs', label: t('header.filterJobs'), path: '/linkedin-search', icon: <Search size={18} /> },
    { id: 'recommended-jobs', label: t('header.recommendedJobs'), path: '/recommended-jobs', icon: <Briefcase size={18} />, hasBell: true },
  ];

  const extensionUrl = 'https://chromewebstore.google.com/detail/entrevistaj%C3%A1-linkedin-eas/hmebmpekpajofnclfboeghbhcfomomdp';

  const openMobile = () => {
    setMobileOpen(true);
    setIsClosing(false);
    closingRef.current = false;
    document.body.style.overflow = 'hidden';
  };

  const closeMobile = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    setIsClosing(true);
    setTimeout(() => {
      setMobileOpen(false);
      setIsClosing(false);
      closingRef.current = false;
      document.body.style.overflow = '';
    }, 280);
  }, []);

  const handleNavClick = useCallback(() => {
    closeMobile();
  }, [closeMobile]);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      closeMobile();
      navigate('/');
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  }, [logout, navigate, closeMobile]);

  useEffect(() => {
    if (!mobileOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMobile();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [mobileOpen, closeMobile]);

  // Close mobile menu on route change
  useEffect(() => {
    if (mobileOpen) closeMobile();
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // Close user dropdown on route change
  useEffect(() => {
    if (menuOpen) closeMenu();
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // Close user dropdown on Escape
  useEffect(() => {
    if (!menuOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [menuOpen, closeMenu]);

  return (
    <>
      <S.HeaderWrapper>
        <S.PremiumHeaderBar>
          <S.BrandWrapper to="/cv-automation">
            <S.LogoImg src={logoImage} alt="Logo Raposa" />
            <S.BrandName>
              Fox<span>Apply</span>
            </S.BrandName>
          </S.BrandWrapper>

          <S.Divider />

          <S.NavLinks>
            {navItems.map((item) => (
              <li key={item.id}>
                <S.NavLink to={item.path} $active={location.pathname === item.path}>
                  {item.label}
                  {item.hasBell ? (
                    <S.NotificationBell><Bell size={14} /></S.NotificationBell>
                  ) : (
                    location.pathname === item.path && <S.ActiveDot />
                  )}
                </S.NavLink>
              </li>
            ))}
          </S.NavLinks>

          <S.Divider />

          <S.HeaderActions>
            <S.ActionLink
              href={extensionUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Download size={15} />
              {t('header.downloadExtension')}
            </S.ActionLink>
            <S.UserMenuWrapper ref={menuRef}>
              <S.AvatarTrigger onClick={toggleMenu} aria-label={t('header.profile')}>
                {currentUser?.photoURL ? (
                  <S.AvatarPhoto src={currentUser.photoURL} alt="" />
                ) : (
                  getUserInitials()
                )}
              </S.AvatarTrigger>

              {menuOpen && (
                  <S.UserMenuDropdown $isClosing={menuClosing}>
                    <S.DropdownUserInfo>
                      <S.DropdownAvatarLarge>
                        {currentUser?.photoURL ? (
                          <S.AvatarPhoto src={currentUser.photoURL} alt="" />
                        ) : (
                          getUserInitials()
                        )}
                      </S.DropdownAvatarLarge>
                      <S.DropdownUserMeta>
                        <S.DropdownUserName>
                          <S.DropdownUserNameText>
                            {userData?.displayName || currentUser?.displayName || t('header.profile')}
                          </S.DropdownUserNameText>
                          {getRoleBadge() && (
                            <S.DropdownRoleBadge>{getRoleBadge()}</S.DropdownRoleBadge>
                          )}
                        </S.DropdownUserName>
                        <S.DropdownUserEmail>
                          {currentUser?.email}
                        </S.DropdownUserEmail>
                      </S.DropdownUserMeta>
                    </S.DropdownUserInfo>

                    <S.DropdownMenuItems>
                      <S.DropdownMenuLink to="/profile" onClick={closeMenu}>
                        <User size={16} />
                        {t('header.profile')}
                      </S.DropdownMenuLink>

                      {isAdmin && (
                        <S.DropdownMenuLink to="/admin/referral-dashboard" onClick={closeMenu}>
                          <Activity size={16} />
                          {t('header.referralDashboard')}
                        </S.DropdownMenuLink>
                      )}

                      <S.DropdownDivider />

                      <S.DropdownLogoutItem onClick={handleLogout}>
                        <LogOut size={16} />
                        {t('header.logout')}
                      </S.DropdownLogoutItem>
                    </S.DropdownMenuItems>
                  </S.UserMenuDropdown>
              )}
            </S.UserMenuWrapper>
          </S.HeaderActions>

          {/* Mobile hamburger */}
          <S.MobileMenuButton onClick={openMobile} aria-label="Abrir menu">
            <Menu size={20} />
          </S.MobileMenuButton>
        </S.PremiumHeaderBar>
      </S.HeaderWrapper>

      {/* User menu overlay — outside header to escape stacking context */}
      {menuOpen && <S.DropdownOverlay onClick={closeMenu} />}

      {/* Mobile Drawer */}
      {mobileOpen && (
        <>
          <S.MobileOverlay
            $isOpen={mobileOpen}
            $isClosing={isClosing}
            onClick={closeMobile}
          />
          <S.MobileDrawer $isOpen={mobileOpen} $isClosing={isClosing}>
            <S.DrawerHeader>
              <S.DrawerBrand>
                <S.LogoImg src={logoImage} alt="Logo" style={{ height: 24 }} />
                <S.DrawerBrandName>Fox<span>Apply</span></S.DrawerBrandName>
              </S.DrawerBrand>
              <S.DrawerCloseBtn onClick={closeMobile} aria-label="Fechar menu">
                <X size={16} />
              </S.DrawerCloseBtn>
            </S.DrawerHeader>

            <S.DrawerNav>
              {navItems.map((item) => (
                <S.DrawerNavLink
                  key={item.id}
                  to={item.path}
                  $active={location.pathname === item.path}
                  onClick={handleNavClick}
                >
                  {item.icon}
                  {item.label}
                  {item.hasBell && <S.NotificationBell><Bell size={14} /></S.NotificationBell>}
                </S.DrawerNavLink>
              ))}

              <S.DrawerDivider />

              <S.DrawerExternalLink
                href={extensionUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleNavClick}
              >
                <Download size={18} />
                {t('header.downloadExtension')}
              </S.DrawerExternalLink>

              <S.DrawerNavLink
                to="/profile"
                $active={location.pathname === '/profile'}
                onClick={handleNavClick}
              >
                <User size={18} />
                {t('header.profile')}
              </S.DrawerNavLink>

              {isAdmin && (
                <S.DrawerNavLink
                  to="/admin/referral-dashboard"
                  $active={location.pathname === '/admin/referral-dashboard'}
                  onClick={handleNavClick}
                >
                  <Activity size={18} />
                  {t('header.referralDashboard')}
                </S.DrawerNavLink>
              )}
            </S.DrawerNav>

            <S.DrawerFooter>
              <S.DrawerLogoutBtn onClick={handleLogout}>
                <LogOut size={18} />
                {t('header.logout')}
              </S.DrawerLogoutBtn>
            </S.DrawerFooter>
          </S.MobileDrawer>
        </>
      )}
    </>
  );
};
