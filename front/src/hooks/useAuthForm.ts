import { useState } from 'react';
import { useAuth, UserRole } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

interface UseAuthFormProps {
  redirectTo?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const useAuthForm = ({ 
  redirectTo = '/dashboard', 
  onSuccess, 
  onError 
}: UseAuthFormProps = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, loginWithGoogle, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getRedirectPath = () => {
    const from = location.state?.from?.pathname;
    return from && from !== '/login' ? from : redirectTo;
  };

  const handleLogin = async (email: string, password: string) => {
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      onSuccess?.();
      navigate(getRedirectPath(), { replace: true });
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (
    email: string, 
    password: string, 
    displayName: string, 
    role: UserRole = UserRole.BASIC_PLAN
  ) => {
    setError('');
    setLoading(true);

    try {
      await register(email, password, displayName, role);
      onSuccess?.();
      navigate(getRedirectPath(), { replace: true });
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      await loginWithGoogle();
      onSuccess?.();
      navigate(getRedirectPath(), { replace: true });
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError('');

  return {
    loading,
    error,
    handleLogin,
    handleGoogleLogin,
    handleRegister,
    clearError,
  };
};

const getErrorMessage = (error: unknown): string => {
  if (error && typeof error === 'object' && 'code' in error) {
    const errorCode = (error as { code: string }).code;
    
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'Usuário não encontrado. Verifique o e-mail.';
      case 'auth/wrong-password':
        return 'Senha incorreta. Tente novamente.';
      case 'auth/invalid-email':
        return 'E-mail inválido. Verifique o formato.';
      case 'auth/user-disabled':
        return 'Esta conta foi desabilitada.';
      case 'auth/too-many-requests':
        return 'Muitas tentativas de login. Tente novamente mais tarde.';
      case 'auth/network-request-failed':
        return 'Erro de conexão. Verifique sua internet.';
      case 'auth/email-already-in-use':
        return 'Este e-mail já está sendo usado por outra conta.';
      case 'auth/weak-password':
        return 'A senha deve ter pelo menos 6 caracteres.';
      case 'auth/invalid-credential':
        return 'Credenciais inválidas. Verifique e-mail e senha.';
      default:
        return 'Erro na autenticação. Tente novamente.';
    }
  }
  
  return 'Erro inesperado. Tente novamente.';
}; 