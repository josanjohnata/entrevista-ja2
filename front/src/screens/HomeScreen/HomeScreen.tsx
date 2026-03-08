import React, { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'styled-components';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LayoutWithSidebar } from '../../components/LayoutWithSidebar/LayoutWithSidebar';
import i18n from '../../i18n/config';

class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Erro ao renderizar IndexPage:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>{i18n.t('error.title')}</h2>
          <p>{this.state.error?.message || i18n.t('error.unknown')}</p>
          <p>{i18n.t('error.checkConsole')}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

import { IndexPage } from '../../presentation/pages/Index/Index';
import { theme } from '../../styles/theme';
import { GlobalStyles } from '../../styles/GlobalStyles';
import { useAuth } from '../../contexts/AuthContext';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getCheckoutSession, syncSubscription } from '../../lib/stripe';
import { clearProfileCache } from '../../components/ProtectedRoute/ProtectedRoute';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export const HomeScreen: React.FC = () => {
  const { currentUser, refreshUserData } = useAuth();
  const userKey = currentUser?.uid || 'no-user';
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();

  React.useEffect(() => {
    const sessionId = params.get('session_id');
    if (sessionId) {
      const checkPaymentStatus = async () => {
        try {
          const session = await getCheckoutSession(sessionId);
          
          if (session.status === 'paid') {
            try {
              await syncSubscription(sessionId, currentUser?.uid);
              await refreshUserData();
              clearProfileCache();
            } catch (syncError) {
              console.error('Erro ao sincronizar subscription:', syncError);
            }
            setParams((prev => {
              const newParams = new URLSearchParams(prev);
              newParams.delete('session_id');
              return newParams;
            }));
            navigate('/cv-automation', { replace: true });
          } else if (session.status === 'pending') {
            navigate('/pending-payment', { replace: true });
          } else if (session.status === 'expired') {
            navigate('/pending-payment?type=expired', { replace: true });
          } else {
            navigate('/pending-payment', { replace: true });
          }
        } catch (error) {
          console.error('Erro ao verificar status do pagamento:', error);
          navigate('/pending-payment', { replace: true });
        }
      };
      
      checkPaymentStatus();
    }
  }, [params, navigate, currentUser, refreshUserData, setParams]);

  return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <GlobalStyles />
        <LayoutWithSidebar>
          <ErrorBoundary>
            <div style={{ minHeight: '100vh', position: 'relative' }}>
              <IndexPage key={userKey} />
            </div>
          </ErrorBoundary>
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
        </LayoutWithSidebar>
        </ThemeProvider>
      </QueryClientProvider>
  );
};
