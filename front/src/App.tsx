import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { AppRoutes } from './routes';
import { GlobalStyle } from './GlobalStyles';
import { AuthProvider } from './contexts/AuthContext';
import { theme } from './styles/theme';
import { Analytics } from '@vercel/analytics/react';
import { SEO } from './components/SEO';
import './i18n/config';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <AuthProvider>
          <SEO />
          <GlobalStyle />
          <AppRoutes />
          <Analytics />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
