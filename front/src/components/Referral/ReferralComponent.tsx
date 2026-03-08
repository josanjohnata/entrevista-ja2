import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { FiCopy, FiCheck, FiGift, FiDollarSign, FiUsers, FiCheckCircle, FiClock, FiEdit2, FiSave, FiKey } from 'react-icons/fi';
import { httpsCallable } from 'firebase/functions';
import { functions, db } from '../../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { detectRegion } from '../../utils/regionDetector';
import * as S from './styles';

interface ReferralMetrics {
  totalReferrals: number;
  completedReferrals: number;
  pendingReferrals: number;
  totalRewardAmount: number;
  currentBalance: number;
}

type ReferralView = 'indicacao' | 'metricas' | 'pix';

export const ReferralComponent: React.FC<{ view?: ReferralView }> = ({ view = 'indicacao' }) => {
  const { t } = useTranslation();
  const { userData, currentUser, refreshUserData } = useAuth();
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [metrics, setMetrics] = useState<ReferralMetrics | null>(null);
  const [loadingMetrics, setLoadingMetrics] = useState(false);
  const [pixKey, setPixKey] = useState(userData?.pixKey || '');
  const [isEditingPix, setIsEditingPix] = useState(false);
  const [savingPix, setSavingPix] = useState(false);
  const [requestingPayout, setRequestingPayout] = useState(false);
  const [pixMessage, setPixMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const balance = userData?.balance || 0;

  const detectedRegion = useMemo(() => detectRegion(), []);
  const isBR = detectedRegion === 'BR';
  const minPayoutAmount = 5000;
  const canRequestPayout = isBR && balance >= minPayoutAmount && pixKey.trim() !== '';

  const promotionalCode = isBR ? 'PROMO10' : 'PROMO2';
  const referralCode = userData?.referralCode;

  const formatBalance = (value: number, region?: 'BR' | 'EU' | 'OTHER') => {
    const amount = (value / 100).toFixed(2);
    return region === 'BR' ? amount.replace('.', ',') : amount;
  };

  const balanceInCurrency = formatBalance(balance, detectedRegion);

  // Construir o link de indicação usando o código original do usuário
  // Agora aponta para a landing page para novos usuários verem o conteúdo primeiro
  const baseUrl = window.location.origin;
  const referralLink = referralCode 
    ? `${baseUrl}/?ref=${referralCode}`
    : '';

  // Gerar código de indicação se não existir
  useEffect(() => {
    const generateCodeIfNeeded = async () => {
      if (!currentUser || !userData || userData.referralCode || isGenerating) return;
      setIsGenerating(true);
      try {
        const generateReferralCodeForUser = httpsCallable(functions, 'generateReferralCodeForUser');
        await generateReferralCodeForUser();
        await refreshUserData();
      } catch (error) {
        console.error('Erro ao gerar código de indicação:', error);
      } finally {
        setIsGenerating(false);
      }
    };
    generateCodeIfNeeded();
  }, [currentUser, userData, isGenerating, refreshUserData]);

  // Buscar métricas de indicação
  useEffect(() => {
    const fetchMetrics = async () => {
      if (!currentUser || !userData?.referralCode || loadingMetrics) return;
      setLoadingMetrics(true);
      try {
        const getReferralMetrics = httpsCallable(functions, 'getReferralMetrics');
        const result = await getReferralMetrics();
        const data = result.data as { success: boolean; metrics: ReferralMetrics };
        if (data.success && data.metrics) {
          setMetrics(data.metrics);
        }
      } catch (error) {
        console.error('Erro ao buscar métricas de indicação:', error);
      } finally {
        setLoadingMetrics(false);
      }
    };
    fetchMetrics();
  }, [currentUser, userData?.referralCode, loadingMetrics]);

  const handleCopyLink = async () => {
    if (!referralLink) return;
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (error) {
      console.error('Erro ao copiar link:', error);
    }
  };

  const handleCopyCode = async () => {
    if (!promotionalCode) return;
    try {
      await navigator.clipboard.writeText(promotionalCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (error) {
      console.error('Erro ao copiar código:', error);
    }
  };

  const validatePixKey = (key: string): { valid: boolean; error?: string } => {
    const trimmed = key.trim();
    if (trimmed.length === 0) return { valid: false, error: t('referral.pixKeyRequired') };
    if (trimmed.length > 77) return { valid: false, error: t('referral.pixKeyTooLong') };
    const sanitized = trimmed.replace(/[^a-zA-Z0-9@.\-+ ]/g, '');
    if (sanitized !== trimmed) return { valid: false, error: t('referral.pixKeyInvalidChars') };
    return { valid: true };
  };

  const handleSavePixKey = async () => {
    if (!currentUser) {
      setPixMessage({ type: 'error', text: t('referral.pixKeyRequired') });
      return;
    }
    const validation = validatePixKey(pixKey);
    if (!validation.valid) {
      setPixMessage({ type: 'error', text: validation.error || t('referral.pixKeyInvalid') });
      return;
    }
    setSavingPix(true);
    setPixMessage(null);
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      const sanitizedPixKey = pixKey.trim().replace(/\s+/g, ' ');
      await setDoc(userDocRef, { pixKey: sanitizedPixKey, updatedAt: new Date() }, { merge: true });
      await refreshUserData();
      setIsEditingPix(false);
      setPixMessage({ type: 'success', text: t('referral.pixKeySaved') });
      setTimeout(() => setPixMessage(null), 3000);
    } catch (error) {
      console.error('Erro ao salvar chave PIX:', error);
      setPixMessage({ type: 'error', text: t('referral.pixKeySaveError') });
    } finally {
      setSavingPix(false);
    }
  };

  const handleRequestPayout = async () => {
    if (!currentUser || !canRequestPayout) return;
    setRequestingPayout(true);
    setPixMessage(null);
    try {
      const requestPayout = httpsCallable(functions, 'requestReferralPayout');
      const result = await requestPayout();
      const data = result.data as { success: boolean; message?: string };
      if (data.success) {
        await refreshUserData();
        setPixMessage({ type: 'success', text: data.message || t('referral.payoutRequested') });
        setTimeout(() => setPixMessage(null), 5000);
      } else {
        setPixMessage({ type: 'error', text: data.message || t('referral.payoutError') });
      }
    } catch (error: unknown) {
      console.error('Erro ao solicitar pagamento:', error);
      const errorMessage = error instanceof Error ? error.message : t('referral.payoutError');
      setPixMessage({ type: 'error', text: errorMessage });
    } finally {
      setRequestingPayout(false);
    }
  };

  useEffect(() => {
    if (userData?.pixKey) setPixKey(userData.pixKey);
  }, [userData?.pixKey]);

  const currencySymbol = detectedRegion === 'BR' ? 'R$' : detectedRegion === 'EU' ? '\u20AC' : '$';

  // Loading state — show inside view container so it fills the panel
  if (!referralCode) {
    return (
      <S.ReferralViewContainer>
        <S.ReferralCard>
          <S.ReferralTitle>
            <FiGift size={24} />
            {t('referral.title')}
          </S.ReferralTitle>
          <S.ReferralMessage>
            {isGenerating ? t('referral.codeGenerating') : t('referral.codeGenerating')}
          </S.ReferralMessage>
        </S.ReferralCard>
      </S.ReferralViewContainer>
    );
  }

  // Single-view mode: render only the active tab content
  return (
    <S.ReferralViewContainer>
      {/* ==================== Indicação ==================== */}
      {view === 'indicacao' && (
        <S.ReferralCard>
          <S.ReferralDescription>{t('referral.description')}</S.ReferralDescription>
          <S.ReferralSection>
            <S.ReferralLabel>{t('referral.yourCode')}</S.ReferralLabel>
            <S.ReferralCodeContainer>
              <S.ReferralCode>{promotionalCode}</S.ReferralCode>
              <S.CopyButton onClick={handleCopyCode} title={t('referral.copyCode')}>
                {copiedCode ? <FiCheck size={14} /> : <FiCopy size={14} />}
              </S.CopyButton>
            </S.ReferralCodeContainer>
          </S.ReferralSection>
          <S.ReferralSection>
            <S.ReferralLabel>{t('referral.yourLink')}</S.ReferralLabel>
            <S.ReferralLinkContainer>
              <S.ReferralLink>{referralLink}</S.ReferralLink>
              <S.CopyButton onClick={handleCopyLink} title={t('referral.copyLink')}>
                {copiedLink ? <FiCheck size={14} /> : <FiCopy size={14} />}
              </S.CopyButton>
            </S.ReferralLinkContainer>
          </S.ReferralSection>
          <S.ReferralInfo>{t('referral.howItWorks')}</S.ReferralInfo>
        </S.ReferralCard>
      )}

      {/* ==================== Métricas ==================== */}
      {view === 'metricas' && (
        <S.MetricsCard>
          <S.MetricsGrid>
            <S.MetricCard>
              <S.MetricIcon><FiUsers size={16} /></S.MetricIcon>
              <S.MetricValue>{metrics?.totalReferrals ?? 0}</S.MetricValue>
              <S.MetricLabel>{t('referral.totalReferrals')}</S.MetricLabel>
            </S.MetricCard>
            <S.MetricCard>
              <S.MetricIcon style={{ color: '#10b981' }}><FiCheckCircle size={16} /></S.MetricIcon>
              <S.MetricValue>{metrics?.completedReferrals ?? 0}</S.MetricValue>
              <S.MetricLabel>{t('referral.completedReferrals')}</S.MetricLabel>
            </S.MetricCard>
            <S.MetricCard>
              <S.MetricIcon style={{ color: '#f59e0b' }}><FiClock size={16} /></S.MetricIcon>
              <S.MetricValue>{metrics?.pendingReferrals ?? 0}</S.MetricValue>
              <S.MetricLabel>{t('referral.pendingReferrals')}</S.MetricLabel>
            </S.MetricCard>
            <S.MetricCard>
              <S.MetricIcon style={{ color: '#6366f1' }}><FiDollarSign size={16} /></S.MetricIcon>
              <S.MetricValue>
                {currencySymbol}{metrics ? formatBalance(metrics.totalRewardAmount, detectedRegion) : '0'}
              </S.MetricValue>
              <S.MetricLabel>{t('referral.totalEarned')}</S.MetricLabel>
            </S.MetricCard>
          </S.MetricsGrid>
        </S.MetricsCard>
      )}

      {/* ==================== PIX (BR only) ==================== */}
      {view === 'pix' && isBR && (
        <S.PixCard>
          {isEditingPix ? (
            <>
              <S.PixInput
                type="text"
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
                placeholder={t('referral.pixKeyPlaceholder')}
                disabled={savingPix}
              />
              <S.PixButtonRow>
                <S.PixButton onClick={handleSavePixKey} disabled={savingPix || !pixKey.trim()} style={{ flex: 1 }}>
                  {savingPix ? t('referral.saving') : <><FiSave size={13} />{t('referral.save')}</>}
                </S.PixButton>
                <S.PixCancelButton
                  onClick={() => { setIsEditingPix(false); setPixKey(userData?.pixKey || ''); setPixMessage(null); }}
                  disabled={savingPix}
                  style={{ flex: 1 }}
                >
                  {t('referral.cancel')}
                </S.PixCancelButton>
              </S.PixButtonRow>
            </>
          ) : (
            <>
              <S.PixKeyDisplay>
                <S.ReferralLink>{pixKey || t('referral.noPixKey')}</S.ReferralLink>
                <S.CopyButton onClick={() => setIsEditingPix(true)} title={t('referral.editPixKey')}>
                  <FiEdit2 size={14} />
                </S.CopyButton>
              </S.PixKeyDisplay>
              {pixKey && (
                <S.PixButton onClick={handleRequestPayout} disabled={!canRequestPayout || requestingPayout}>
                  {requestingPayout
                    ? t('referral.processing')
                    : t('referral.requestPayout', { amount: formatBalance(balance, 'BR') })}
                </S.PixButton>
              )}
            </>
          )}
          {pixMessage && (
            pixMessage.type === 'success'
              ? <S.PixSuccess>{pixMessage.text}</S.PixSuccess>
              : <S.PixError>{pixMessage.text}</S.PixError>
          )}
          {!pixKey && <S.PixInfo>{t('referral.pixKeyInfo')}</S.PixInfo>}
          {pixKey && balance < minPayoutAmount && (
            <S.PixInfo>
              {t('referral.minPayoutAmount', {
                current: formatBalance(balance, 'BR'),
                required: formatBalance(minPayoutAmount, 'BR'),
              })}
            </S.PixInfo>
          )}
          <S.ReferralBalance>
            <S.BalanceIcon><FiDollarSign size={14} /></S.BalanceIcon>
            <S.BalanceLabel>{t('referral.yourBalance')}</S.BalanceLabel>
            <S.BalanceAmount>{currencySymbol}{balanceInCurrency}</S.BalanceAmount>
          </S.ReferralBalance>
        </S.PixCard>
      )}
    </S.ReferralViewContainer>
  );
};
