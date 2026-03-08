import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth, UserRole } from '../../contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { AccessDeniedContainer } from './styles';
import { ROUTES } from '../../routes/paths';
import { PendingPaymentScreen } from '../../screens/PendingPayment';
import { Loading } from '../common/Loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  requireAuth?: boolean;
  skipProfileCheck?: boolean;
  requireActiveSubscription?: boolean;
}

const profileCache = new Map<string, { completed: boolean; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos
let cacheClearedTimestamp = 0;

const getProfileFromCache = (uid: string): boolean | null => {
  const cached = profileCache.get(uid);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.completed;
  }
  return null;
};

const setProfileCache = (uid: string, completed: boolean) => {
  profileCache.set(uid, { completed, timestamp: Date.now() });
};

// eslint-disable-next-line react-refresh/only-export-components
export const clearProfileCache = () => {
  profileCache.clear();
  cacheClearedTimestamp = Date.now();
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  requireAuth = true,
  skipProfileCheck = false,
  requireActiveSubscription = true
}) => {
  const { t } = useTranslation();
  const { isAuthenticated, userData, loading, currentUser, hasActiveSubscription, isSubscriptionExpired } = useAuth();
  const location = useLocation();
  const [checkingProfile, setCheckingProfile] = useState(!skipProfileCheck);
  const [profileCompleted, setProfileCompleted] = useState(false);
  const hasCheckedRef = useRef<string | null>(null);
  const lastCacheClearRef = useRef<number>(0);

  const checkProfile = useCallback(async () => {
    if (skipProfileCheck || !currentUser || !db) {
      setCheckingProfile(false);
      return;
    }

    // Se o cache foi limpo desde a última verificação, forçar nova verificação
    if (cacheClearedTimestamp > lastCacheClearRef.current) {
      hasCheckedRef.current = null;
      lastCacheClearRef.current = cacheClearedTimestamp;
    }

    if (hasCheckedRef.current === currentUser.uid) {
      setCheckingProfile(false);
      return;
    }

    const cachedResult = getProfileFromCache(currentUser.uid);
    if (cachedResult !== null && cacheClearedTimestamp <= lastCacheClearRef.current) {
      setProfileCompleted(cachedResult);
      setCheckingProfile(false);
      hasCheckedRef.current = currentUser.uid;
      return;
    }

    try {
      const profileRef = doc(db, 'profiles', currentUser.uid);
      const profileSnap = await getDoc(profileRef);

      const isCompleted = profileSnap.exists() && profileSnap.data().profileCompleted === true;
      setProfileCompleted(isCompleted);
      setProfileCache(currentUser.uid, isCompleted);
      hasCheckedRef.current = currentUser.uid;
      lastCacheClearRef.current = cacheClearedTimestamp;
    } catch (error) {
      console.error('Erro ao verificar perfil:', error);
      setProfileCompleted(false);
    } finally {
      setCheckingProfile(false);
    }
  }, [currentUser, skipProfileCheck]);

  useEffect(() => {
    if (isAuthenticated && !loading && !skipProfileCheck) {
      checkProfile();
    } else if (skipProfileCheck) {
      setCheckingProfile(false);
    }
  }, [isAuthenticated, loading, skipProfileCheck, checkProfile]);

  useEffect(() => {
    if (
      location.pathname === '/cv-automation' &&
      isAuthenticated &&
      !loading &&
      !skipProfileCheck &&
      cacheClearedTimestamp > lastCacheClearRef.current
    ) {
      hasCheckedRef.current = null;
      checkProfile();
    }
  }, [location.pathname, isAuthenticated, loading, skipProfileCheck, checkProfile]);

  if (loading || checkingProfile) {
    return <Loading fullScreen />;
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  // Verificar assinatura ANTES do perfil
  // Se o usuário não pagou, não faz sentido exigir que complete o perfil
  if (requireActiveSubscription && isAuthenticated && userData) {
    if (isSubscriptionExpired) {
      return <PendingPaymentScreen type="expired" />;
    }

    if (!hasActiveSubscription) {
      return <PendingPaymentScreen type="pending" />;
    }
  }

  // Só verifica perfil depois de confirmar que a assinatura está ativa
  if (!skipProfileCheck && isAuthenticated && !profileCompleted && location.pathname !== ROUTES.PERFIL) {
    return <Navigate to={ROUTES.PERFIL} state={{ isFirstAccess: true }} replace />;
  }

  if (requiredRole && userData) {
    const hasPermission = checkPermission(userData.role, requiredRole);

    if (!hasPermission) {
      return (
        <AccessDeniedContainer>
          <h2>{t('protectedRoute.accessDenied')}</h2>
          <p>{t('protectedRoute.noPermission')}</p>
          <p>{t('protectedRoute.currentPlan')} <strong>{getRoleDisplayName(userData.role, t)}</strong></p>
          <p>{t('protectedRoute.requiredPlan')} <strong>{getRoleDisplayName(requiredRole, t)}</strong></p>
        </AccessDeniedContainer>
      );
    }
  }

  return <>{children}</>;
};

const checkPermission = (userRole: UserRole, requiredRole: UserRole): boolean => {
  const roleHierarchy = {
    [UserRole.RECRUITER]: 4,
    [UserRole.QUARTERLY_PLAN]: 3,
    [UserRole.MONTHLY_PLAN]: 2,
    [UserRole.BASIC_PLAN]: 1,
  };

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
};

const getRoleDisplayName = (role: UserRole, t: (key: string) => string): string => {
  const roleNames = {
    [UserRole.RECRUITER]: t('protectedRoute.roles.recruiter'),
    [UserRole.QUARTERLY_PLAN]: t('protectedRoute.roles.quarterlyPlan'),
    [UserRole.MONTHLY_PLAN]: t('protectedRoute.roles.monthlyPlan'),
    [UserRole.BASIC_PLAN]: t('protectedRoute.roles.basicPlan'),
  };

  return roleNames[role] || t('protectedRoute.roles.unknown');
};
