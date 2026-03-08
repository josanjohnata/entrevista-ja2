import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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
import { CoverLetterScreen } from '../screens/CoverLetterScreen/CoverLetterScreen';
import { LinkedInChampionScreen } from '../screens/LinkedInChampionScreen/LinkedInChampionScreen';
import { RecommendedJobsScreen } from '../screens/RecommendedJobsScreen/RecommendedJobsScreen';
import { BlogScreen, BlogPostScreen } from '../screens/BlogScreen';
import ErrorBoundary from '../components/ErrorBoundary';
import LandingPage from '../screens/landing/App';
import { PlansScreen } from '../screens/PlansScreen';
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
      {/* Public routes (without header/layout) */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/pcd" element={<PCDLandingScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/plans" element={<PlansScreen />} />
      <Route path="/checkout" element={<CheckoutScreen />} />
      <Route path="/checkout-pcd" element={<CheckoutPCDScreen />} />
      <Route path="/pending-payment" element={<PendingPaymentScreen />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyScreen />} />
      <Route path="/refund-return" element={<RefundReturnScreen />} />
      <Route path="/blog" element={<BlogScreen />} />
      <Route path="/blog/:slug" element={<BlogPostScreen />} />
      <Route path="/home" element={<LandingPage />} />

      {/* Protected routes with persistent layout (Header stays mounted) */}
      <Route element={<LayoutWithSidebar />}>
        <Route
          path="/cv-automation"
          element={
            <ProtectedRoute requiredRole={UserRole.BASIC_PLAN} key={`cv-automation-${userKey}`}>
              <CurriculoTurboScreen key={userKey} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/linkedin-search"
          element={
            <ProtectedRoute requiredRole={UserRole.BASIC_PLAN} key={`linkedin-${userKey}`}>
              <LinkedInSearchScreen key={userKey} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cover-letter"
          element={
            <ProtectedRoute requiredRole={UserRole.BASIC_PLAN} key={`cover-letter-${userKey}`}>
              <CoverLetterScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/linkedin-champion"
          element={
            <ProtectedRoute requiredRole={UserRole.BASIC_PLAN} key={`linkedin-champion-${userKey}`}>
              <LinkedInChampionScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recommended-jobs"
          element={
            <ProtectedRoute requiredRole={UserRole.BASIC_PLAN} key={`recommended-jobs-${userKey}`}>
              <RecommendedJobsScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/results"
          element={
            <ProtectedRoute requiredRole={UserRole.BASIC_PLAN} key={`results-${userKey}`}>
              <ResultadosPageWrapper />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ErrorBoundary>
              <ProtectedRoute requireAuth={true} skipProfileCheck={true} requireActiveSubscription={false} key={`profile-${userKey}`}>
                <ProfileScreen key={userKey} />
              </ProtectedRoute>
            </ErrorBoundary>
          }
        />
        <Route
          path="/admin/referral-dashboard"
          element={
            <ErrorBoundary>
              <ProtectedRoute requireAuth={true} skipProfileCheck={true} requireActiveSubscription={false} key={`referral-dashboard-${userKey}`}>
                <ReferralDashboardScreen />
              </ProtectedRoute>
            </ErrorBoundary>
          }
        />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
