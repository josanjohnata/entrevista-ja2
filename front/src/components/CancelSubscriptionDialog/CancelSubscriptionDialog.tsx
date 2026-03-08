import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { keyframes } from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

/* =============================================
   KEYFRAMES
   ============================================= */

const overlayIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

const dialogIn = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.92) translateY(12px);
    filter: blur(4px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
    filter: blur(0);
  }
`;

const foxPulse = keyframes`
  0%, 100% {
    filter: drop-shadow(0 0 6px rgba(239, 68, 68, 0.08));
    transform: scale(1);
  }
  50% {
    filter: drop-shadow(0 0 18px rgba(239, 68, 68, 0.2));
    transform: scale(1.03);
  }
`;

const dotGlow = keyframes`
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

/* =============================================
   STYLED COMPONENTS
   ============================================= */

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
  padding: clamp(1rem, 3vw, 1.5rem);
  animation: ${overlayIn} 0.25s ease forwards;
`;

const Dialog = styled.div`
  width: 100%;
  max-width: clamp(320px, 90vw, 480px);
  background: rgba(12, 12, 13, 0.97);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 22px;
  overflow: hidden;
  box-shadow:
    0 40px 80px rgba(0, 0, 0, 0.55),
    0 0 60px rgba(239, 68, 68, 0.03),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
  position: relative;
  animation: ${dialogIn} 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(239, 68, 68, 0.15) 30%,
      rgba(239, 68, 68, 0.25) 50%,
      rgba(239, 68, 68, 0.15) 70%,
      transparent 100%
    );
  }
`;

const Header = styled.div`
  padding: clamp(1rem, 3vw, 1.25rem) clamp(1rem, 3vw, 1.5rem) 0;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
`;

const CloseButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  color: rgba(255, 255, 255, 0.35);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  flex-shrink: 0;

  &:hover:not(:disabled) {
    color: #fff;
    background: rgba(255, 255, 255, 0.07);
    border-color: rgba(255, 255, 255, 0.15);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const FoxWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${foxPulse} 3s ease-in-out infinite;
`;

const Content = styled.div`
  padding: 0 clamp(1rem, 3vw, 1.5rem) clamp(1rem, 3vw, 1.5rem);
  text-align: center;
`;

const Title = styled.h2`
  font-family: var(--font-display, 'Clash Display', system-ui, sans-serif);
  font-size: 1.2rem;
  font-weight: 650;
  color: #ffffff;
  letter-spacing: -0.02em;
  margin: 16px 0 8px;
`;

const Message = styled.p`
  font-family: var(--font-body, 'Satoshi', system-ui, sans-serif);
  font-size: 0.84rem;
  color: rgba(255, 255, 255, 0.38);
  line-height: 1.65;
  margin: 0 0 20px;
`;

const RefundBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 12px;
  background: rgba(239, 68, 68, 0.05);
  border: 1px solid rgba(239, 68, 68, 0.1);
  margin-bottom: 24px;
`;

const RefundDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #ef4444;
  box-shadow: 0 0 8px rgba(239, 68, 68, 0.5);
  flex-shrink: 0;
  animation: ${dotGlow} 2s ease-in-out infinite;
`;

const RefundText = styled.span`
  font-family: var(--font-body, 'Satoshi', system-ui, sans-serif);
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.5;
  text-align: left;
`;

const Separator = styled.div`
  height: 1px;
  background: rgba(255, 255, 255, 0.05);
  margin-bottom: 20px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;

  @media (max-width: 480px) {
    flex-direction: column-reverse;
  }
`;

const KeepButton = styled.button`
  flex: 1;
  padding: 13px 20px;
  border-radius: 14px;
  font-family: var(--font-body, 'Satoshi', system-ui, sans-serif);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.08);

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.08);
    color: #fff;
    border-color: rgba(255, 255, 255, 0.15);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const ConfirmCancelBtn = styled.button`
  flex: 1;
  position: relative;
  padding: 13px 20px;
  border-radius: 14px;
  font-family: var(--font-body, 'Satoshi', system-ui, sans-serif);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  background: #dc2626;
  color: #ffffff;
  border: none;
  box-shadow: 0 4px 20px rgba(220, 38, 38, 0.2);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.1) 50%,
      transparent 100%
    );
    background-size: 200% 100%;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover:not(:disabled) {
    background: #b91c1c;
    box-shadow: 0 6px 28px rgba(220, 38, 38, 0.3);
    transform: translateY(-1px);

    &::before {
      opacity: 1;
      animation: ${shimmer} 1.2s ease infinite;
    }
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 2px 12px rgba(220, 38, 38, 0.25);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Spinner = styled.span`
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.25);
  border-top-color: #fff;
  border-radius: 50%;
  animation: ${spin} 0.6s linear infinite;
  margin-right: 8px;
  vertical-align: middle;
`;

/* =============================================
   COMPONENT
   ============================================= */

interface CancelSubscriptionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCancel: () => void;
  subscriptionDate?: Date;
}

export const CancelSubscriptionDialog: React.FC<CancelSubscriptionDialogProps> = ({
  isOpen,
  onClose,
  onCancel,
  subscriptionDate,
}) => {
  const { t } = useTranslation();
  const { currentUser, logout } = useAuth();
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const daysSinceSubscription = subscriptionDate
    ? Math.floor((Date.now() - subscriptionDate.getTime()) / (1000 * 60 * 60 * 24))
    : null;
  const isEligibleForRefund = daysSinceSubscription !== null && daysSinceSubscription <= 7;

  const handleConfirm = async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await setDoc(userRef, {
        subscriptionStatus: 'canceled',
        updatedAt: new Date(),
      }, { merge: true });

      setTimeout(async () => {
        await logout();
        onCancel();
      }, 1500);
    } catch (error) {
      console.error('Erro ao cancelar assinatura:', error);
      toast.error(error instanceof Error ? error.message : t('profile.subscriptionCancelError'));
      setLoading(false);
    }
  };

  return (
    <Overlay onClick={!loading ? onClose : undefined}>
      <Dialog onClick={(e) => e.stopPropagation()}>
        <Header>
          <CloseButton onClick={onClose} disabled={loading}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </CloseButton>
        </Header>

        <Content>
          {/* Fox — warning state with X eyes */}
          <FoxWrapper>
            <svg
              width="48"
              height="48"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="foxCancelGrad" x1="10%" y1="0%" x2="90%" y2="100%">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#991b1b" />
                </linearGradient>
                <linearGradient id="foxCancelEar" x1="50%" y1="0%" x2="50%" y2="100%">
                  <stop offset="0%" stopColor="#fca5a5" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0.2" />
                </linearGradient>
              </defs>
              <path
                d="M 10 8 L 24 26 L 32 20 L 40 26 L 54 8 L 50 42 L 32 58 L 14 42 Z"
                fill="url(#foxCancelGrad)"
              />
              <path
                d="M 25 33 L 32 52 L 39 33 L 32 27 Z"
                fill="rgba(0,0,0,0.3)"
                opacity="0.85"
              />
              <path d="M 14 13 L 23 25 L 20 17 Z" fill="url(#foxCancelEar)" />
              <path d="M 50 13 L 41 25 L 44 17 Z" fill="url(#foxCancelEar)" />
              {/* X eyes */}
              <line x1="24" y1="30" x2="28" y2="34" stroke="rgba(0,0,0,0.55)" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="28" y1="30" x2="24" y2="34" stroke="rgba(0,0,0,0.55)" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="36" y1="30" x2="40" y2="34" stroke="rgba(0,0,0,0.55)" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="40" y1="30" x2="36" y2="34" stroke="rgba(0,0,0,0.55)" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M 30 45 L 32 47 L 34 45 Z" fill="rgba(0,0,0,0.4)" />
            </svg>
          </FoxWrapper>

          <Title>{t('profile.cancelSubscriptionTitle')}</Title>
          <Message>{t('profile.cancelSubscriptionMessage')}</Message>

          {isEligibleForRefund && (
            <RefundBadge>
              <RefundDot />
              <RefundText>
                {t('profile.refundEligible', { days: 7 - (daysSinceSubscription || 0) })}
              </RefundText>
            </RefundBadge>
          )}

          <Separator />

          <ButtonGroup>
            <KeepButton onClick={onClose} disabled={loading}>
              {t('common.cancel')}
            </KeepButton>
            <ConfirmCancelBtn onClick={handleConfirm} disabled={loading}>
              {loading ? (
                <><Spinner />{t('common.loading')}</>
              ) : (
                t('profile.confirmCancelSubscription')
              )}
            </ConfirmCancelBtn>
          </ButtonGroup>
        </Content>
      </Dialog>
    </Overlay>
  );
};
