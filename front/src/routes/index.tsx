import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from './paths';
import { LoginScreen } from '../screens/Login/Login';
import { CheckoutScreen } from '../screens/CheckoutScreen/CheckoutScreen';
import { CheckoutPCDScreen } from '../screens/CheckoutPCDScreen';
import { PrivacyPolicyScreen } from '../screens/PrivacyPolicy/PrivacyPolicy';
import { RefundReturnScreen } from '../screens/RefundReturnScreen';
import { CurriculoTurboScreen } from '../screens/CurriculoTurboScreen/CurriculoTurboScreen';
import { ProtectedRoute } from '../components/ProtectedRoute/ProtectedRoute';
import { UserRole, useAuth } from '../contexts/AuthContext';
import { LinkedInSearchScreen } from '../screens/LinkedInSearch/LinkedInSearch';
import { ProfileScreen } from '../screens/ProfileScreen/ProfileScreen';
import { LinkedInChampionScreen } from '../screens/LinkedInChampionScreen/LinkedInChampionScreen';
import { RecommendedJobsScreen } from '../screens/RecommendedJobsScreen/RecommendedJobsScreen';
import { BlogScreen, BlogPostScreen } from '../screens/BlogScreen';
import ErrorBoundary from '../components/ErrorBoundary';
import LandingPage from '../screens/landing/App';
import { PlansScreen } from '../screens/PlansScreen';
import { DivulgueVagaScreen } from '../screens/DivulgueVagaScreen/DivulgueVagaScreen';
import { PendingPaymentScreen } from '../screens/PendingPayment';
import { ReferralDashboardScreen } from '../screens/ReferralDashboardScreen/ReferralDashboardScreen';

import { ResultadosPage } from '../presentation/pages/Resultados/Resultados';
import { theme } from '../styles/theme';
import { GlobalStyles } from '../styles/GlobalStyles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'styled-components';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { NotFoundPage } from '../presentation/pages/NotFound/NotFound';
import { PCDLandingScreen } from '../screens/PCDLandingScreen';
import { LayoutWithSidebar } from '../components/LayoutWithSidebar/LayoutWithSidebar';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const ResultadosPageWrapper: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <ResultadosPage />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export const AppRoutes: React.FC = () => {
  const { currentUser } = useAuth();
  const userKey = currentUser?.uid || 'no-user';

  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path={ROUTES.HOME} element={<LandingPage />} />
      <Route path={ROUTES.PCD} element={<PCDLandingScreen />} />
      <Route path={ROUTES.LOGIN} element={<LoginScreen />} />
      <Route path={ROUTES.PLANOS} element={<PlansScreen />} />
      <Route path={ROUTES.DIVULGUE_VAGA} element={<DivulgueVagaScreen />} />
      <Route path={ROUTES.PAGAMENTO} element={<CheckoutScreen />} />
      <Route path={ROUTES.PAGAMENTO_PCD} element={<CheckoutPCDScreen />} />
      <Route path={ROUTES.PAGAMENTO_PENDENTE} element={<PendingPaymentScreen />} />
      <Route path={ROUTES.POLITICA_PRIVACIDADE} element={<PrivacyPolicyScreen />} />
      <Route path={ROUTES.REEMBOLSO} element={<RefundReturnScreen />} />
      <Route path={ROUTES.BLOG} element={<BlogScreen />} />
      <Route path={`${ROUTES.BLOG}/:slug`} element={<BlogPostScreen />} />
      <Route path={ROUTES.INICIO} element={<LandingPage />} />

      {/* Rotas protegidas com layout (sidebar) */}
      <Route element={<LayoutWithSidebar />}>
        <Route
          path={ROUTES.CURRICULO_TURBO}
          element={
            <ProtectedRoute requiredRole={UserRole.BASIC_PLAN} key={`cv-automation-${userKey}`}>
              <CurriculoTurboScreen key={userKey} />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.FILTRAR_VAGAS}
          element={
            <ProtectedRoute requiredRole={UserRole.BASIC_PLAN} key={`linkedin-${userKey}`}>
              <LinkedInSearchScreen key={userKey} />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.LINKEDIN_CAMPEAO}
          element={
            <ProtectedRoute requiredRole={UserRole.BASIC_PLAN} key={`linkedin-champion-${userKey}`}>
              <LinkedInChampionScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.VAGAS_RECOMENDADAS}
          element={
            <ProtectedRoute requiredRole={UserRole.BASIC_PLAN} key={`recommended-jobs-${userKey}`}>
              <RecommendedJobsScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.RESULTADOS}
          element={
            <ProtectedRoute requiredRole={UserRole.BASIC_PLAN} key={`results-${userKey}`}>
              <ResultadosPageWrapper />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.PERFIL}
          element={
            <ErrorBoundary>
              <ProtectedRoute requireAuth={true} skipProfileCheck={true} requireActiveSubscription={false} key={`profile-${userKey}`}>
                <ProfileScreen key={userKey} />
              </ProtectedRoute>
            </ErrorBoundary>
          }
        />
        <Route
          path={ROUTES.ADMIN_PAINEL_INDICACOES}
          element={
            <ErrorBoundary>
              <ProtectedRoute requireAuth={true} skipProfileCheck={true} requireActiveSubscription={false} key={`referral-dashboard-${userKey}`}>
                <ReferralDashboardScreen />
              </ProtectedRoute>
            </ErrorBoundary>
          }
        />
      </Route>

      {/* Redirecionamentos das rotas antigas (inglês) para português */}
      <Route path="/login" element={<Navigate to={ROUTES.LOGIN} replace />} />
      <Route path="/plans" element={<Navigate to={ROUTES.PLANOS} replace />} />
      <Route path="/checkout" element={<Navigate to={ROUTES.PAGAMENTO} replace />} />
      <Route path="/checkout-pcd" element={<Navigate to={ROUTES.PAGAMENTO_PCD} replace />} />
      <Route path="/pending-payment" element={<Navigate to={ROUTES.PAGAMENTO_PENDENTE} replace />} />
      <Route path="/privacy-policy" element={<Navigate to={ROUTES.POLITICA_PRIVACIDADE} replace />} />
      <Route path="/refund-return" element={<Navigate to={ROUTES.REEMBOLSO} replace />} />
      <Route path="/cv-automation" element={<Navigate to={ROUTES.CURRICULO_TURBO} replace />} />
      <Route path="/linkedin-search" element={<Navigate to={ROUTES.FILTRAR_VAGAS} replace />} />
      <Route path="/linkedin-champion" element={<Navigate to={ROUTES.LINKEDIN_CAMPEAO} replace />} />
      <Route path="/recommended-jobs" element={<Navigate to={ROUTES.VAGAS_RECOMENDADAS} replace />} />
      <Route path="/results" element={<Navigate to={ROUTES.RESULTADOS} replace />} />
      <Route path="/profile" element={<Navigate to={ROUTES.PERFIL} replace />} />
      <Route path="/admin/referral-dashboard" element={<Navigate to={ROUTES.ADMIN_PAINEL_INDICACOES} replace />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
