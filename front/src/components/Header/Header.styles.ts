import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';

/* =============================================
   HEADER WRAPPER
   ============================================= */

export const HeaderWrapper = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 100%;
  max-width: 1400px;
  padding: clamp(14px, 1vw + 10px, 20px) clamp(16px, 2vw, 24px) 0;
  z-index: 200;
  animation: slideDown 1s var(--ease-out-expo) forwards;

  @media (min-width: 2560px) {
    max-width: 1800px;
  }
`;

export const LogoImg = styled.img`
  height: 28px;
  width: auto;
  object-fit: contain;
  transition: var(--transition-med);
`;

export const PremiumHeaderBar = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 22px;
  background: #fff;
  border: 1px solid #e5e5e5;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  gap: 0;
`;

export const BrandWrapper = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  flex-shrink: 0;
  padding-right: 16px;
  transition: var(--transition-med);

  &:hover ${LogoImg} {
    transform: scale(1.1) rotate(-8deg);
    filter: drop-shadow(0 4px 14px var(--fox-primary));
  }
`;

export const BrandName = styled.div`
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 700;
  color: #171717;
  letter-spacing: -0.025em;
  line-height: 1;

  span {
    color: var(--fox-primary);
  }
`;

export const Divider = styled.div`
  width: 1px;
  height: 24px;
  background: #e5e5e5;
  flex-shrink: 0;
`;

/* =============================================
   NAV LINKS (Desktop)
   ============================================= */

export const NavLinks = styled.ul`
  display: flex;
  align-items: center;
  gap: 6px;
  list-style: none;
  flex: 1;
  justify-content: space-evenly;
  padding: 0 16px;
  min-width: 0;

  @media (max-width: 1024px) {
    display: none;
  }
`;

export const ActiveDot = styled.span`
  width: 4px;
  height: 4px;
  background-color: var(--fox-primary);
  border-radius: 50%;
  margin-left: 4px;
  box-shadow: 0 0 8px var(--fox-primary), 0 0 16px rgba(255, 85, 0, 0.4);
  flex-shrink: 0;
`;

export const NavLink = styled(Link)<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  text-decoration: none;
  color: ${({ $active }) => ($active ? '#171717' : '#525252')};
  font-size: 0.82rem;
  font-weight: 500;
  padding: 7px 11px;
  border-radius: 10px;
  transition: var(--transition-fast);
  white-space: nowrap;
  letter-spacing: 0.01em;
  background: ${({ $active }) => ($active ? '#f5f5f5' : 'transparent')};
  border: 1px solid ${({ $active }) => ($active ? '#e5e5e5' : 'transparent')};

  &:hover {
    color: #171717;
    background: #f5f5f5;
  }
`;

/* =============================================
   HEADER ACTIONS (Desktop)
   ============================================= */

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
  padding-left: 12px;

  @media (max-width: 1024px) {
    display: none;
  }
`;

export const ActionLink = styled.a`
  display: flex;
  align-items: center;
  gap: 7px;
  color: #525252;
  text-decoration: none;
  font-size: 0.82rem;
  font-weight: 400;
  padding: 7px 13px;
  border-radius: 10px;
  transition: var(--transition-fast);
  white-space: nowrap;
  letter-spacing: 0.01em;

  &:hover {
    color: #171717;
    background: #f5f5f5;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

/* =============================================
   MOBILE HAMBURGER BUTTON
   ============================================= */

export const MobileMenuButton = styled.button`
  display: none;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #f5f5f5;
  border: 1px solid #e5e5e5;
  color: #525252;
  cursor: pointer;
  transition: var(--transition-fast);
  flex-shrink: 0;
  margin-left: auto;

  &:hover {
    color: #171717;
    background: #e5e5e5;
    border-color: #d4d4d4;
  }

  @media (max-width: 1024px) {
    display: flex;
  }
`;

/* =============================================
   MOBILE DRAWER
   ============================================= */

const drawerIn = keyframes`
  from { opacity: 0; transform: translateX(100%); }
  to { opacity: 1; transform: translateX(0); }
`;

const drawerOut = keyframes`
  from { opacity: 1; transform: translateX(0); }
  to { opacity: 0; transform: translateX(100%); }
`;

const overlayIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const overlayOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

export const MobileOverlay = styled.div<{ $isOpen: boolean; $isClosing: boolean }>`
  display: none;
  position: fixed;
  inset: 0;
  z-index: 300;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);

  @media (max-width: 1024px) {
    display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
    animation: ${({ $isClosing }) => ($isClosing ? overlayOut : overlayIn)} 0.25s var(--ease-out-expo) forwards;
  }
`;

export const MobileDrawer = styled.div<{ $isOpen: boolean; $isClosing: boolean }>`
  display: none;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: min(340px, 85vw);
  z-index: 301;
  background: #fff;
  border-left: 1px solid #e5e5e5;
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.08);
  flex-direction: column;
  overflow-y: auto;

  @media (max-width: 1024px) {
    display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
    animation: ${({ $isClosing }) => ($isClosing ? drawerOut : drawerIn)} 0.3s var(--ease-out-expo) forwards;
  }
`;

export const DrawerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e5e5;
`;

export const DrawerBrand = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const DrawerBrandName = styled.span`
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 700;
  color: #171717;
  letter-spacing: -0.02em;

  span {
    color: var(--fox-primary);
  }
`;

export const DrawerCloseBtn = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: #f5f5f5;
  border: 1px solid #e5e5e5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #525252;
  cursor: pointer;
  transition: var(--transition-fast);

  &:hover {
    color: #171717;
    background: #e5e5e5;
    border-color: #d4d4d4;
  }
`;

export const DrawerNav = styled.nav`
  display: flex;
  flex-direction: column;
  padding: 12px 16px;
  gap: 2px;
  flex: 1;
`;

export const DrawerNavLink = styled(Link)<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: ${({ $active }) => ($active ? '#171717' : '#525252')};
  font-family: var(--font-body);
  font-size: 0.88rem;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  padding: 12px 14px;
  border-radius: 12px;
  transition: var(--transition-fast);
  background: ${({ $active }) => ($active ? 'rgba(255, 85, 0, 0.08)' : 'transparent')};
  border-left: 3px solid ${({ $active }) => ($active ? 'var(--fox-primary)' : 'transparent')};

  svg {
    flex-shrink: 0;
    opacity: ${({ $active }) => ($active ? 1 : 0.6)};
  }

  &:hover {
    color: #171717;
    background: #f5f5f5;
  }
`;

export const DrawerExternalLink = styled.a<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: #525252;
  font-family: var(--font-body);
  font-size: 0.88rem;
  font-weight: 400;
  padding: 12px 14px;
  border-radius: 12px;
  transition: var(--transition-fast);
  background: transparent;
  border-left: 3px solid transparent;

  svg {
    flex-shrink: 0;
    opacity: 0.6;
  }

  &:hover {
    color: #171717;
    background: #f5f5f5;
  }
`;

export const DrawerDivider = styled.div`
  height: 1px;
  background: #e5e5e5;
  margin: 8px 14px;
`;

export const DrawerFooter = styled.div`
  padding: 16px;
  border-top: 1px solid #e5e5e5;
`;

export const DrawerLogoutBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  color: #525252;
  font-family: var(--font-body);
  font-size: 0.88rem;
  font-weight: 400;
  padding: 12px 14px;
  border-radius: 12px;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: var(--transition-fast);
  border-left: 3px solid transparent;

  svg {
    flex-shrink: 0;
    opacity: 0.6;
  }

  &:hover {
    color: #ef4444;
    background: rgba(239, 68, 68, 0.06);
  }
`;

/* =============================================
   USER MENU — Premium Avatar + Dropdown
   ============================================= */

const dropdownReveal = keyframes`
  from {
    opacity: 0;
    transform: translateY(-6px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const dropdownHide = keyframes`
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(-6px) scale(0.95);
  }
`;

export const UserMenuWrapper = styled.div`
  position: relative;
  flex-shrink: 0;
  margin-left: 4px;

  @media (max-width: 1024px) {
    display: none;
  }
`;

export const AvatarTrigger = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #FF6B1A 0%, #E84D00 100%);
  color: #fff;
  font-family: var(--font-display);
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
  box-shadow:
    0 2px 8px rgba(255, 85, 0, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 60%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
    transition: 0.5s;
  }

  &:hover {
    transform: translateY(-1px);
    box-shadow:
      0 4px 16px rgba(255, 85, 0, 0.35),
      inset 0 1px 0 rgba(255, 255, 255, 0.25);

    &::after {
      left: 140%;
    }
  }

  &:active {
    transform: translateY(0) scale(0.96);
  }
`;

export const AvatarPhoto = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 12px;
  object-fit: cover;
`;

export const DropdownOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 199;
`;

export const UserMenuDropdown = styled.div<{ $isClosing?: boolean }>`
  position: absolute;
  top: calc(100% + 10px);
  right: -4px;
  width: 248px;
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  z-index: 210;
  transform-origin: top right;
  animation: ${({ $isClosing }) => ($isClosing ? dropdownHide : dropdownReveal)}
    ${({ $isClosing }) => ($isClosing ? '0.15s' : '0.25s')}
    cubic-bezier(0.16, 1, 0.3, 1) forwards;
  overflow: hidden;
`;

export const DropdownUserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 16px 14px;
  position: relative;
  background: linear-gradient(
    135deg,
    rgba(255, 85, 0, 0.04) 0%,
    transparent 60%
  );

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 16px;
    right: 16px;
    height: 1px;
    background: #e5e5e5;
  }
`;

export const DropdownAvatarLarge = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, #FF6B1A 0%, #E84D00 100%);
  color: #fff;
  font-family: var(--font-display);
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(255, 85, 0, 0.2);
`;

export const DropdownUserMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
  flex: 1;
`;

export const DropdownUserName = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
`;

export const DropdownUserNameText = styled.span`
  font-family: var(--font-display);
  font-size: 0.82rem;
  font-weight: 600;
  color: #171717;
  letter-spacing: -0.01em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
`;

export const DropdownUserEmail = styled.span`
  font-family: var(--font-body);
  font-size: 0.68rem;
  color: #737373;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
`;

export const DropdownRoleBadge = styled.span`
  font-family: var(--font-body);
  font-size: 0.56rem;
  font-weight: 700;
  color: var(--fox-primary);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  line-height: 1;
  flex-shrink: 0;
  padding: 2.5px 6px;
  border-radius: 4px;
  background: rgba(255, 85, 0, 0.1);
  border: 1px solid rgba(255, 85, 0, 0.1);
`;

export const DropdownMenuItems = styled.div`
  padding: 4px 6px;
  display: flex;
  flex-direction: column;
  gap: 1px;
`;

export const DropdownDivider = styled.div`
  height: 1px;
  background: #e5e5e5;
  margin: 2px 10px;
`;

export const DropdownMenuLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 9px 10px;
  border: none;
  border-radius: 10px;
  background: transparent;
  color: #525252;
  font-family: var(--font-body);
  font-size: 0.8rem;
  font-weight: 450;
  letter-spacing: 0.005em;
  cursor: pointer;
  transition: all 0.15s ease;
  text-align: left;
  text-decoration: none;
  position: relative;

  svg {
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    opacity: 0.6;
    transition: all 0.15s ease;
  }

  &:hover {
    color: #171717;
    background: #f5f5f5;

    svg {
      opacity: 1;
      color: var(--fox-primary);
    }
  }
`;

export const DropdownLogoutItem = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 9px 10px;
  border: none;
  border-radius: 10px;
  background: transparent;
  color: #525252;
  font-family: var(--font-body);
  font-size: 0.8rem;
  font-weight: 450;
  letter-spacing: 0.005em;
  cursor: pointer;
  transition: all 0.15s ease;
  text-align: left;
  position: relative;

  svg {
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    opacity: 0.6;
    transition: all 0.15s ease;
  }

  &:hover {
    color: #ef4444;
    background: rgba(239, 68, 68, 0.06);

    svg {
      opacity: 1;
      color: #ef4444;
    }
  }
`;

export const NotificationDot = styled.span`
  width: 6px;
  height: 6px;
  background: var(--fox-primary);
  border-radius: 50%;
  box-shadow: 0 0 6px var(--fox-primary);
  flex-shrink: 0;
`;

const bellSwing = keyframes`
  0%, 100% { transform: rotate(0deg); }
  15% { transform: rotate(14deg); }
  30% { transform: rotate(-12deg); }
  45% { transform: rotate(8deg); }
  60% { transform: rotate(-6deg); }
  75% { transform: rotate(2deg); }
`;

export const NotificationBell = styled.span`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--fox-primary);
  flex-shrink: 0;
  transform-origin: top center;
  animation: ${bellSwing} 2.5s var(--ease-out-expo) infinite;
  animation-delay: 1s;
  filter: drop-shadow(0 0 4px rgba(255, 85, 0, 0.4));

  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: -1px;
    width: 5px;
    height: 5px;
    background: var(--fox-primary);
    border-radius: 50%;
    box-shadow: 0 0 6px var(--fox-primary);
  }
`;
