import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const SidebarContainer = styled.aside<{ $isOpen: boolean }>`
  position: fixed;
  right: 0;
  top: 80px;
  height: calc(100vh - 80px);
  height: calc(100dvh - 80px);
  width: 260px;
  background-color: #FFFFFF;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  z-index: 150;
  overflow-y: auto;
  transform: ${({ $isOpen }) => ($isOpen ? 'translateX(0)' : 'translateX(100%)')};
  transition: transform 0.3s ease;

  @media (max-width: 768px) {
    width: clamp(200px, 65vw, 240px);
  }
`;

export const SidebarNav = styled.nav`
  display: flex;
  flex-direction: column;
  padding: 1rem 0;
  flex: 1;
`;

export const SidebarFooter = styled.div`
  padding: 1rem 0;
  border-top: 1px solid #E5E7EB;
  margin-top: auto;
`;

const baseSidebarLinkStyles = `
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.5rem;
  font-family: 'Readex Pro', sans-serif;
  font-size: 1rem;
  font-weight: 400;
  color: #4F4F4F;
  text-decoration: none;
  border: none;
  background: none;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  width: 100%;
  text-align: left;

  &:hover {
    background-color: #F3F4F6;
    color: #1F2937;
  }

  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }

  span {
    white-space: nowrap;
  }
`;

export const SidebarLink = styled(Link).attrs<{ $isActive?: boolean }>(({ $isActive }) => ({
  $isActive,
}))<{ $isActive?: boolean }>`
  ${baseSidebarLinkStyles}

  ${({ $isActive }) =>
    $isActive &&
    `
    background-color: #EFF6FF;
    color: #4A90E2;
    font-weight: 500;
    
    &::before {
      content: '';
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background-color: #4A90E2;
    }
    
    svg {
      color: #4A90E2;
    }
  `}
`;

export const SidebarButton = styled.button<{ $isActive?: boolean }>`
  ${baseSidebarLinkStyles}

  ${({ $isActive }) =>
    $isActive &&
    `
    background-color: #EFF6FF;
    color: #4A90E2;
    font-weight: 500;
    
    &::before {
      content: '';
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background-color: #4A90E2;
    }
    
    svg {
      color: #4A90E2;
    }
  `}
`;

export const SidebarExternalLink = styled.a<{ $isActive?: boolean }>`
  ${baseSidebarLinkStyles}
`;

export const NotificationBadge = styled.span`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 10px;
  height: 10px;
  background-color: #EF4444;
  border-radius: 50%;
  box-shadow: 0 0 0 2px #FFFFFF;
  animation: pulse 2s infinite;

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 2px #FFFFFF;
    }
    50% {
      box-shadow: 0 0 0 2px #FFFFFF, 0 0 0 4px rgba(239, 68, 68, 0.3);
    }
    100% {
      box-shadow: 0 0 0 2px #FFFFFF;
    }
  }
`;

