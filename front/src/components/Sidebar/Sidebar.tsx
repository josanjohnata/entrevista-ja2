import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { FiUser, FiLogOut, FiFileText, FiSearch, FiDownload, FiAward, FiMail, FiBriefcase, FiActivity } from 'react-icons/fi';
import * as S from './Sidebar.styles';

interface SidebarProps {
  showOnlyLogout?: boolean;
  isOpen: boolean;
  onItemClick?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ showOnlyLogout, isOpen, onItemClick }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, currentUser } = useAuth();
  
  // Verificar se é admin
  const ADMIN_EMAILS = ['josanjohnata@gmail.com', 'edhurabelo@gmail.com'];
  const isAdmin = currentUser?.email && ADMIN_EMAILS.includes(currentUser.email);

  const handleLogout = async () => {
    try {
      await logout();
      onItemClick?.();
      navigate('/');
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  const handleItemClick = () => {
    onItemClick?.();
  };

  const menuItems = [
    {
      id: 'resume',
      label: t('header.resumeTurbo'),
      icon: <FiFileText />,
      path: '/cv-automation',
      isActive: location.pathname === '/cv-automation',
    },
    {
      id: 'linkedin-champion',
      label: t('header.linkedinChampion'),
      icon: <FiAward />,
      path: '/linkedin-champion',
      isActive: location.pathname === '/linkedin-champion',
    },
    {
      id: 'cover-letter',
      label: t('header.coverLetter'),
      icon: <FiMail />,
      path: '/cover-letter',
      isActive: location.pathname === '/cover-letter',
    },
    // {
    //   id: 'blog',
    //   label: t('header.blog'),
    //   icon: <FiBook />,
    //   path: '/blog',
    //   isActive: location.pathname.startsWith('/blog'),
    // },
    {
      id: 'linkedin-search',
      label: t('header.filterJobs'),
      icon: <FiSearch />,
      path: '/linkedin-search',
      isActive: location.pathname === '/linkedin-search',
    },
    {
      id: 'recommended-jobs',
      label: t('header.recommendedJobs'),
      icon: <FiBriefcase />,
      path: '/recommended-jobs',
      isActive: location.pathname === '/recommended-jobs',
      hasNotification: true,
    },
    {
      id: 'download-extension',
      label: t('header.downloadExtension'),
      icon: <FiDownload />,
      href: 'https://chromewebstore.google.com/detail/entrevistaj%C3%A1-linkedin-eas/hmebmpekpajofnclfboeghbhcfomomdp',
      isExternal: true,
    },
    {
      id: 'profile',
      label: t('header.profile'),
      icon: <FiUser />,
      path: '/profile',
      isActive: location.pathname === '/profile',
    },
    // Dashboard apenas para admin
    ...(isAdmin ? [{
      id: 'referral-dashboard',
      label: t('header.referralDashboard'),
      icon: <FiActivity />,
      path: '/admin/referral-dashboard',
      isActive: location.pathname === '/admin/referral-dashboard',
    }] : []),
  ];

  const logoutItem = {
    id: 'logout',
    label: t('header.logout'),
    icon: <FiLogOut />,
    onClick: handleLogout,
  };

  // Se showOnlyLogout, mostrar apenas logout
  const itemsToShow = showOnlyLogout 
    ? []
    : menuItems;

  return (
    <S.SidebarContainer $isOpen={isOpen}>
      <S.SidebarNav>
        {itemsToShow.map((item) => {
          if (item.isExternal && item.href) {
            return (
              <S.SidebarExternalLink
                key={item.id}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                $isActive={false}
                onClick={handleItemClick}
              >
                {item.icon}
                <span>{item.label}</span>
              </S.SidebarExternalLink>
            );
          }

          if (item.path) {
            return (
              <S.SidebarLink
                key={item.id}
                to={item.path}
                $isActive={item.isActive}
                onClick={handleItemClick}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.hasNotification && <S.NotificationBadge />}
              </S.SidebarLink>
            );
          }

          return null;
        })}
      </S.SidebarNav>
      
      <S.SidebarFooter>
        {showOnlyLogout ? (
          <S.SidebarButton
            onClick={logoutItem.onClick}
            $isActive={false}
          >
            {logoutItem.icon}
            <span>{logoutItem.label}</span>
          </S.SidebarButton>
        ) : (
          <S.SidebarButton
            onClick={logoutItem.onClick}
            $isActive={false}
          >
            {logoutItem.icon}
            <span>{logoutItem.label}</span>
          </S.SidebarButton>
        )}
      </S.SidebarFooter>
    </S.SidebarContainer>
  );
};
