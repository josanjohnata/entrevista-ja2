import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { FiUsers, FiCheckCircle, FiClock, FiDollarSign, FiTrendingUp, FiActivity } from 'react-icons/fi';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../../lib/firebase';
import * as S from './dashboardStyles';

interface DashboardMetrics {
  totalUsers: number;
  totalReferrals: number;
  completedReferrals: number;
  pendingReferrals: number;
  totalRewardAmount: number;
  totalBalanceDistributed: number;
  conversionRate: number;
  topReferrers: Array<{
    email: string;
    referralCode: string;
    totalReferrals: number;
    completedReferrals: number;
    totalEarned: number;
  }>;
}

export const ReferralDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { userData, currentUser } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Verificar se é admin
  const ADMIN_EMAILS = ['josanjohnata@gmail.com', 'edhurabelo@gmail.com'];
  const isAdmin = currentUser?.email && ADMIN_EMAILS.includes(currentUser.email);

  useEffect(() => {
    if (!isAdmin || !currentUser) {
      setLoading(false);
      return;
    }

    const fetchDashboardMetrics = async () => {
      setLoading(true);
      setError(null);
      try {
        const getDashboardMetrics = httpsCallable(functions, 'getDashboardMetrics');
        const result = await getDashboardMetrics();
        const data = result.data as { success: boolean; metrics: DashboardMetrics };
        if (data.success && data.metrics) {
          setMetrics(data.metrics);
        }
      } catch (err) {
        console.error('Erro ao buscar métricas do dashboard:', err);
        setError('Erro ao carregar métricas');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardMetrics();
  }, [isAdmin, currentUser]);

  // Formatar valor baseado na região
  const formatBalance = (value: number, region?: 'BR' | 'EU' | 'OTHER') => {
    const amount = (value / 100).toFixed(2);
    return region === 'BR' ? amount.replace('.', ',') : amount;
  };

  const getCurrencySymbol = (region?: 'BR' | 'EU' | 'OTHER') => {
    return region === 'BR' ? 'R$' : region === 'EU' ? '€' : '$';
  };

  if (!isAdmin) {
    return null; // Não renderiza nada se não for admin
  }

  if (loading) {
    return (
      <S.DashboardContainer>
        <S.DashboardCard>
          <S.LoadingMessage>{t('referral.dashboard.loading')}</S.LoadingMessage>
        </S.DashboardCard>
      </S.DashboardContainer>
    );
  }

  if (error) {
    return (
      <S.DashboardContainer>
        <S.DashboardCard>
          <S.ErrorMessage>{error}</S.ErrorMessage>
        </S.DashboardCard>
      </S.DashboardContainer>
    );
  }

  if (!metrics) {
    return null;
  }

  return (
    <S.DashboardContainer>
      <S.DashboardHeader>
        <S.DashboardTitle>
          <FiActivity size={28} />
          {t('referral.dashboard.title')}
        </S.DashboardTitle>
        <S.DashboardSubtitle>{t('referral.dashboard.subtitle')}</S.DashboardSubtitle>
      </S.DashboardHeader>

      <S.MetricsGrid>
        <S.MetricCard>
          <S.MetricIcon style={{ background: '#3b82f6' }}>
            <FiUsers size={24} />
          </S.MetricIcon>
          <S.MetricContent>
            <S.MetricValue>{metrics.totalUsers}</S.MetricValue>
            <S.MetricLabel>{t('referral.dashboard.totalUsers')}</S.MetricLabel>
          </S.MetricContent>
        </S.MetricCard>

        <S.MetricCard>
          <S.MetricIcon style={{ background: '#8b5cf6' }}>
            <FiUsers size={24} />
          </S.MetricIcon>
          <S.MetricContent>
            <S.MetricValue>{metrics.totalReferrals}</S.MetricValue>
            <S.MetricLabel>{t('referral.dashboard.totalReferrals')}</S.MetricLabel>
          </S.MetricContent>
        </S.MetricCard>

        <S.MetricCard>
          <S.MetricIcon style={{ background: '#10b981' }}>
            <FiCheckCircle size={24} />
          </S.MetricIcon>
          <S.MetricContent>
            <S.MetricValue>{metrics.completedReferrals}</S.MetricValue>
            <S.MetricLabel>{t('referral.dashboard.completedReferrals')}</S.MetricLabel>
          </S.MetricContent>
        </S.MetricCard>

        <S.MetricCard>
          <S.MetricIcon style={{ background: '#f59e0b' }}>
            <FiClock size={24} />
          </S.MetricIcon>
          <S.MetricContent>
            <S.MetricValue>{metrics.pendingReferrals}</S.MetricValue>
            <S.MetricLabel>{t('referral.dashboard.pendingReferrals')}</S.MetricLabel>
          </S.MetricContent>
        </S.MetricCard>

        <S.MetricCard>
          <S.MetricIcon style={{ background: '#6366f1' }}>
            <FiDollarSign size={24} />
          </S.MetricIcon>
          <S.MetricContent>
            <S.MetricValue>
              {getCurrencySymbol(userData?.region)}
              {formatBalance(metrics.totalRewardAmount, userData?.region)}
            </S.MetricValue>
            <S.MetricLabel>{t('referral.dashboard.totalRewardAmount')}</S.MetricLabel>
          </S.MetricContent>
        </S.MetricCard>

        <S.MetricCard>
          <S.MetricIcon style={{ background: '#06b6d4' }}>
            <FiTrendingUp size={24} />
          </S.MetricIcon>
          <S.MetricContent>
            <S.MetricValue>{metrics.conversionRate.toFixed(1)}%</S.MetricValue>
            <S.MetricLabel>{t('referral.dashboard.conversionRate')}</S.MetricLabel>
          </S.MetricContent>
        </S.MetricCard>
      </S.MetricsGrid>

      {metrics.topReferrers && metrics.topReferrers.length > 0 && (
        <S.TopReferrersSection>
          <S.SectionTitle>{t('referral.dashboard.topReferrers')}</S.SectionTitle>
          <S.ReferrersTable>
            <S.TableHeader>
              <S.TableHeaderCell>{t('referral.dashboard.referrerEmail')}</S.TableHeaderCell>
              <S.TableHeaderCell>{t('referral.dashboard.referralCode')}</S.TableHeaderCell>
              <S.TableHeaderCell>{t('referral.dashboard.totalReferrals')}</S.TableHeaderCell>
              <S.TableHeaderCell>{t('referral.dashboard.completedReferrals')}</S.TableHeaderCell>
              <S.TableHeaderCell>{t('referral.dashboard.totalEarned')}</S.TableHeaderCell>
            </S.TableHeader>
            <S.TableBody>
              {metrics.topReferrers.map((referrer, index) => (
                <S.TableRow key={index}>
                  <S.TableCell>{referrer.email}</S.TableCell>
                  <S.TableCell>
                    <S.CodeBadge>{referrer.referralCode}</S.CodeBadge>
                  </S.TableCell>
                  <S.TableCell>{referrer.totalReferrals}</S.TableCell>
                  <S.TableCell>
                    <S.CompletedBadge>{referrer.completedReferrals}</S.CompletedBadge>
                  </S.TableCell>
                  <S.TableCell>
                    {getCurrencySymbol(userData?.region)}
                    {formatBalance(referrer.totalEarned, userData?.region)}
                  </S.TableCell>
                </S.TableRow>
              ))}
            </S.TableBody>
          </S.ReferrersTable>
        </S.TopReferrersSection>
      )}
    </S.DashboardContainer>
  );
};

