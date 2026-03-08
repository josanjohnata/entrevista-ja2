import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { FiUser, FiLogOut, FiFileText, FiSearch, FiDownload, FiMail, FiAward } from 'react-icons/fi';
import * as S from './styles';
import { Logo } from '../Logo';

interface HeaderHomeProps {
  isFirstAccess?: boolean;
  showOnlyLogout?: boolean;
}

export const HeaderHome: React.FC<HeaderHomeProps> = ({ isFirstAccess: propIsFirstAccess, showOnlyLogout }) => {
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { userData, logout } = useAuth();
  const profileMenuRef = useRef<HTMLDivElement>(null);
  
  const isSearchScreen = location.pathname === '/linkedin-search';
  const isProfileScreen = location.pathname === '/profile';
  const isCoverLetterScreen = location.pathname === '/cover-letter';
  const isLinkedInChampionScreen = location.pathname === '/linkedin-champion';
  const isFirstAccess = propIsFirstAccess || location.state?.isFirstAccess;

  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileMenuOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  const handleMenuClick = (action: string) => {
    setIsProfileMenuOpen(false);
    setIsMobileMenuOpen(false);
    
    switch (action) {
      case 'empresas':
        navigate('/empresas');
        break;
      case 'profile':
        navigate('/profile');
        break;
      case 'coverLetter':
        navigate('/cover-letter');
        break;
      case 'logout':
        handleLogout();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    if (isProfileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  return (
    <S.HeaderContainer>
      <S.Nav>
        <Logo />
        
        <S.NavLinks>
          {showOnlyLogout ? (
            <S.LoginButton onClick={() => handleMenuClick('logout')}>
              <FiLogOut /> {t('header.logout')}
            </S.LoginButton>
          ) : isSearchScreen || isLinkedInChampionScreen ? (
            <>
              <S.NavLink as={Link} to="/cv-automation">
                <FiFileText /> {t('header.resumeTurbo')}
              </S.NavLink>
              {!isCoverLetterScreen && (
                <S.NavLink onClick={() => handleMenuClick('coverLetter')}>
                  <FiMail /> {t('header.coverLetter')}
                </S.NavLink>
              )}
              {!isLinkedInChampionScreen && (
                <S.NavLink as={Link} to="/linkedin-champion">
                  <FiAward /> LinkedIn Champion
                </S.NavLink>
              )}
              {!isProfileScreen && (
                <S.NavLink onClick={() => handleMenuClick('profile')}>
                  <FiUser /> {t('header.profile')}
                </S.NavLink>
              )}
              <S.LoginButton onClick={() => handleMenuClick('logout')}>
                <FiLogOut /> {t('header.logout')}
              </S.LoginButton>
            </>
          ) : (
            <>
              {isCoverLetterScreen && (
                <S.NavLink as={Link} to="/cv-automation">
                  <FiFileText /> {t('header.resumeTurbo')}
                </S.NavLink>
              )}
              {!isFirstAccess && (
                <>
                  <S.NavLink as={Link} to="/linkedin-search">
                    <FiSearch /> {t('header.filterJobs')}
                  </S.NavLink>
                  {!isCoverLetterScreen && (
                    <S.NavLink onClick={() => handleMenuClick('coverLetter')}>
                      <FiMail /> {t('header.coverLetter')}
                    </S.NavLink>
                  )}
                  {!isLinkedInChampionScreen && (
                    <S.NavLink as={Link} to="/linkedin-champion">
                      <FiAward /> {t('header.linkedinChampion')}
                    </S.NavLink>
                  )}
                  <S.NavLink
                    as="a" 
                    href="https://chromewebstore.google.com/detail/entrevistaj%C3%A1-linkedin-eas/hmebmpekpajofnclfboeghbhcfomomdp" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <FiDownload /> {t('header.downloadExtension')}
                  </S.NavLink>
                </>
              )}
              {!isProfileScreen && (
                <S.NavLink onClick={() => handleMenuClick('profile')}>
                  <FiUser /> {t('header.profile')}
                </S.NavLink>
              )}
              <S.LoginButton onClick={() => handleMenuClick('logout')}>
                <FiLogOut /> {t('header.logout')}
              </S.LoginButton>
            </>
          )}
        </S.NavLinks>

        {!showOnlyLogout && (
          <S.MobileMenuButton onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <svg 
              width="24" 
              height="24" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </S.MobileMenuButton>
        )}
      </S.Nav>

      <S.MobileMenu isOpen={isMobileMenuOpen}>
        <S.UserInfo>
          <strong>{userData?.displayName || userData?.email}</strong>
        </S.UserInfo>
        
        {showOnlyLogout ? (
          <S.LoginButton onClick={() => handleMenuClick('logout')}>
            <FiLogOut /> {t('header.logout')}
          </S.LoginButton>
        ) : isSearchScreen || isLinkedInChampionScreen ? (
          <>
            <S.NavLink as={Link} to="/cv-automation" onClick={() => setIsMobileMenuOpen(false)}>
              <FiFileText /> {t('header.resumeTurbo')}
            </S.NavLink>
            {!isCoverLetterScreen && (
              <S.MobileMenuItem onClick={() => handleMenuClick('coverLetter')}>
                <FiMail /> {t('header.coverLetter')}
              </S.MobileMenuItem>
            )}
            {!isLinkedInChampionScreen && (
              <S.NavLink as={Link} to="/linkedin-champion" onClick={() => setIsMobileMenuOpen(false)}>
                <FiAward /> LinkedIn Champion
              </S.NavLink>
            )}
            {!isProfileScreen && (
              <S.MobileMenuItem onClick={() => handleMenuClick('profile')}>
                <FiUser /> {t('header.profile')}
              </S.MobileMenuItem>
            )}
            <S.MobileMenuItem onClick={() => handleMenuClick('logout')}>
              <FiLogOut /> {t('header.logout')}
            </S.MobileMenuItem>
          </>
        ) : (
          <>
            {isCoverLetterScreen && (
              <S.NavLink as={Link} to="/cv-automation" onClick={() => setIsMobileMenuOpen(false)}>
                <FiFileText /> {t('header.resumeTurbo')}
              </S.NavLink>
            )}
            {!isFirstAccess && (
              <>
                <S.NavLink as={Link} to="/linkedin-search" onClick={() => setIsMobileMenuOpen(false)}>
                  <FiSearch /> {t('header.filterJobs')}
                </S.NavLink>
                {!isCoverLetterScreen && (
                  <S.MobileMenuItem onClick={() => handleMenuClick('coverLetter')}>
                    <FiMail /> {t('header.coverLetter')}
                  </S.MobileMenuItem>
                )}
                {!isLinkedInChampionScreen && (
                  <S.NavLink as={Link} to="/linkedin-champion" onClick={() => setIsMobileMenuOpen(false)}>
                    <FiAward /> LinkedIn Champion
                  </S.NavLink>
                )}
                <S.NavLink
                  as="a" 
                  href="https://chromewebstore.google.com/detail/entrevistaj%C3%A1-linkedin-eas/hmebmpekpajofnclfboeghbhcfomomdp" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FiDownload /> {t('header.downloadExtension')}
                </S.NavLink>
              </>
            )}
            {!isProfileScreen && (
              <S.MobileMenuItem onClick={() => handleMenuClick('profile')}>
                <FiUser /> {t('header.profile')}
              </S.MobileMenuItem>
            )}
            <S.MobileMenuItem onClick={() => handleMenuClick('logout')}>
              <FiLogOut /> {t('header.logout')}
            </S.MobileMenuItem>
          </>
        )}
      </S.MobileMenu>
    </S.HeaderContainer>
  );
};
