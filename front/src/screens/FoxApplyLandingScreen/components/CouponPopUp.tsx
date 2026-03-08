import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Copy } from 'lucide-react';
import styled from 'styled-components';
import { Button, Heading3, Text } from '../styles';
import { useReferralTracking } from '../../../hooks/useReferralTracking';
import { useAuth } from '../../../contexts/AuthContext';
import { detectRegion } from '../../../utils/regionDetector';
import type { Region } from '../../../utils/regionDetector';

const POPUP_SHOWN_KEY = 'entrevistaja_coupon_popup_shown';

function getCouponCode(region: Region): string {
  return region === 'BR' ? 'PROMO10' : 'PROMO2';
}

function getCouponLabel(region: Region): string {
  switch (region) {
    case 'BR':
      return 'R$ 10';
    case 'EU':
      return '€2';
    case 'OTHER':
    default:
      return '$2';
  }
}

const Overlay = styled.div<{ $visible: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: oklch(0.08 0.01 260 / 0.85);
  backdrop-filter: blur(8px);
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  visibility: ${({ $visible }) => ($visible ? 'visible' : 'hidden')};
  transition: opacity 0.3s ease, visibility 0.3s ease;
`;

const Modal = styled.div`
  position: relative;
  width: 100%;
  max-width: 28rem;
  background: oklch(0.15 0.015 260 / 0.95);
  backdrop-filter: blur(12px);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 0 40px oklch(0.72 0.19 45 / 0.15),
              0 0 80px oklch(0.82 0.15 195 / 0.1);
  animation: modalIn 0.35s ease-out;

  @keyframes modalIn {
    from {
      opacity: 0;
      transform: scale(0.95) translateY(10px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 2.25rem;
  height: 2.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: oklch(1 0 0 / 0.08);
  color: var(--text-secondary);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: color 0.2s, background 0.2s;

  &:hover {
    background: oklch(1 0 0 / 0.12);
    color: var(--text-primary);
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

const Badge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: oklch(0.72 0.19 45 / 0.25);
  color: var(--neon-orange);
  margin-bottom: 1rem;
`;

const Title = styled(Heading3)`
  font-size: 1.5rem;
  margin: 0 0 0.5rem 0;

  .gradient-text {
    background: linear-gradient(135deg, oklch(0.72 0.19 45), oklch(0.82 0.15 195));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const Description = styled(Text)`
  margin: 0 0 1.5rem 0;
  font-size: 0.9375rem;
`;

const CouponBox = styled.div`
  background: oklch(0.1 0.01 260);
  border: 1px dashed oklch(0.72 0.19 45 / 0.6);
  border-radius: 0.75rem;
  padding: 1rem 1.25rem;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const CouponCode = styled.span`
  font-family: var(--font-code), monospace;
  font-weight: 700;
  font-size: 1.5rem;
  letter-spacing: 0.15em;
  background: linear-gradient(135deg, oklch(0.72 0.19 45), oklch(0.82 0.15 195));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  user-select: all;
`;

const CouponValue = styled.span`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.125rem;
  color: var(--text-secondary);
`;

const CTAWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  button,
  a {
    width: 100%;
    justify-content: center;
  }
`;

export const CouponPopUp: React.FC = () => {
  const { t } = useTranslation();
  const { getCheckoutUrl, trackCheckoutClick } = useReferralTracking();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [visible, setVisible] = useState(false);

  const region = useMemo(() => detectRegion(), []);
  const couponCode = useMemo(() => getCouponCode(region), [region]);
  const couponLabel = useMemo(() => getCouponLabel(region), [region]);

  const copyToClipboard = useCallback(async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      return true;
    } catch {
      try {
        const input = document.createElement('input');
        input.value = code;
        input.readOnly = true;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        return true;
      } catch {
        return false;
      }
    }
  }, []);

  const handleUseCoupon = useCallback(async () => {
    await copyToClipboard(couponCode);
    trackCheckoutClick();
    handleClose();
    window.location.href = getCheckoutUrl();
  }, [couponCode, copyToClipboard, trackCheckoutClick, getCheckoutUrl]);

  useEffect(() => {
    if (authLoading || isAuthenticated) return;
    try {
      if (typeof window !== 'undefined' && window.localStorage.getItem(POPUP_SHOWN_KEY)) {
        return;
      }
      const timer = window.setTimeout(() => setVisible(true), 5000);
      return () => window.clearTimeout(timer);
    } catch {
      const timer = window.setTimeout(() => setVisible(true), 5000);
      return () => window.clearTimeout(timer);
    }
  }, [authLoading, isAuthenticated]);

  const handleClose = () => {
    setVisible(false);
    try {
      window.localStorage.setItem(POPUP_SHOWN_KEY, '1');
    } catch {
      // ignore
    }
  };

  return (
    <Overlay $visible={visible} onClick={handleClose} role="dialog" aria-modal="true" aria-label={t('foxApplyLanding.couponPopUp.title')}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <CloseButton type="button" onClick={handleClose} aria-label={t('foxApplyLanding.couponPopUp.close')}>
          <X />
        </CloseButton>

        <Badge>{t('foxApplyLanding.couponPopUp.badge')}</Badge>
        <Title>
          <span className="gradient-text">{t('foxApplyLanding.couponPopUp.title')}</span>
        </Title>
        <Description>{t('foxApplyLanding.couponPopUp.description')}</Description>

        <CouponBox>
          <CouponCode>{couponCode}</CouponCode>
          <CouponValue style={{ display: 'block', marginTop: '0.5rem' }}>
            {couponLabel} {t('foxApplyLanding.couponPopUp.discount')}
          </CouponValue>
        </CouponBox>

        <CTAWrapper>
          <Button
            type="button"
            size="lg"
            className="glow-orange"
            onClick={handleUseCoupon}
          >
            <Copy size={18} />
            {t('foxApplyLanding.couponPopUp.ctaCopy')}
          </Button>
        </CTAWrapper>
      </Modal>
    </Overlay>
  );
};
