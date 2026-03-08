import { useState, type FC, type FormEvent, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import * as S from "./styles";
import { FiEye, FiEyeOff, FiX, FiCheckCircle } from 'react-icons/fi';
import { AlertTriangle } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import { useAuthForm } from "../../hooks/useAuthForm";
import { useAuth } from "../../contexts/AuthContext";
import { auth } from "../../lib/firebase";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { sendPasswordResetEmail, signOut, setPersistence, browserLocalPersistence, browserSessionPersistence } from "firebase/auth";
import { SimpleHeader } from "../../components/SimpleHeader";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { createCheckoutSessionPCD } from "../../lib/stripe";
import { getRegionConfig } from "../../utils/regionDetector";

export const LoginScreen: FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState(() => localStorage.getItem('rememberedEmail') || '');
  const [password, setPassword] = useState(() => localStorage.getItem('rememberedPassword') || '');
  const [rememberMe, setRememberMe] = useState(() => !!localStorage.getItem('rememberedEmail'));
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetEmailError, setResetEmailError] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const { loading, error } = useAuthForm();
  const { firebaseConfigured, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [
    signInWithEmailAndPassword,
    ,
    signInLoading,
    signInError,
  ] = useSignInWithEmailAndPassword(auth);

  useEffect(() => {
    const checkPCDUserAndRedirect = async () => {
      if (!authLoading && isAuthenticated && auth.currentUser) {
        try {
          // Verificar se é usuário PCD com subscription pending
          const userDocRef = doc(db, 'users', auth.currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (!userDoc.exists()) {
            // Usuário não existe no banco - redirecionar para pagamento pendente por segurança
            navigate('/pending-payment', { replace: true });
            return;
          }
          
          const userData = userDoc.data();
          const isPCD = userData.isPCD === true;
          const subscriptionStatus = userData.subscriptionStatus || 'pending';
          
          // Se for PCD e ainda não completou o checkout (subscription pending)
          if (isPCD && subscriptionStatus === 'pending') {
            // Criar sessão de checkout do Stripe com email pré-preenchido
            try {
              const regionConfig = getRegionConfig();
              const session = await createCheckoutSessionPCD({
                planId: 'plan_monthly',
                userId: auth.currentUser.uid,
                email: auth.currentUser.email || email, // Usar email do usuário logado
                amount: regionConfig.price,
                currency: regionConfig.currency.toLowerCase() as 'brl' | 'eur' | 'usd',
                customerName: userData.nome || auth.currentUser.displayName || undefined,
                productName: `${t('checkoutPCD.monthlyPlan')} - FoxApply`,
                productDescription: t('checkoutPCD.monthlyPlanDescription'),
                metadata: {
                  userId: auth.currentUser.uid,
                  planId: 'plan_monthly',
                  isPCD: 'true',
                },
              });

              if (session && session.url) {
                // Redirecionar diretamente para o checkout do Stripe com email pré-preenchido
                window.location.href = session.url;
                return;
              }
            } catch (checkoutError) {
              console.error('Erro ao criar sessão de checkout:', checkoutError);
              // Em caso de erro, fazer logout e mostrar mensagem
              await signOut(auth);
              setGeneralError(t('login.pcdPendingCheckout'));
              setTimeout(() => {
                navigate('/checkout-pcd', { replace: true });
              }, 2000);
              return;
            }
          }
          
          // Verificar status da subscription para todos os usuários (PCD ou não)
          if (subscriptionStatus === 'active') {
            navigate('/recommended-jobs', { replace: true });
            return;
          } else if (subscriptionStatus === 'expired') {
            // Subscription expirada
            navigate('/pending-payment?type=expired', { replace: true });
            return;
          } else {
            // Subscription pendente ou cancelada - redirecionar para pagamento pendente
            navigate('/pending-payment', { replace: true });
            return;
          }
        } catch (error) {
          console.error('Erro ao verificar status do usuário:', error);
          // Em caso de erro, redirecionar para pagamento pendente por segurança
          navigate('/pending-payment', { replace: true });
        }
      }
    };
    
    checkPCDUserAndRedirect();
  }, [isAuthenticated, authLoading, navigate, t, email]);

  useEffect(() => {
    if (signInError) {
      setEmailError('');
      setPasswordError('');
      setGeneralError('');

      const errorCode = signInError.code;
      
      switch (errorCode) {
        case 'auth/invalid-email':
          setEmailError(t('login.invalidEmail'));
          break;
        case 'auth/user-disabled':
          setGeneralError(t('login.accountDisabled'));
          break;
        case 'auth/user-not-found':
          setEmailError(t('login.userNotFound'));
          break;
        case 'auth/wrong-password':
          setPasswordError(t('login.wrongPassword'));
          break;
        case 'auth/invalid-credential':
          setGeneralError(t('login.invalidCredentials'));
          setEmailError(t('login.verifyEmail'));
          setPasswordError(t('login.verifyPassword'));
          break;
        case 'auth/too-many-requests':
          setGeneralError(t('login.tooManyRequests'));
          break;
        case 'auth/network-request-failed':
          setGeneralError(t('login.networkError'));
          break;
        default:
          setGeneralError(t('login.loginError'));
          break;
      }
    }
  }, [signInError]);

  const handleLoginSubmit = async (event: FormEvent) => {
    event.preventDefault();
    
    setEmailError('');
    setPasswordError('');
    setGeneralError('');

    if (!email) {
      setEmailError(t('login.emailRequired'));
      return;
    }

    if (!password) {
      setPasswordError(t('login.passwordRequired'));
      return;
    }

    if (rememberMe) {
      localStorage.setItem('rememberedEmail', email);
      localStorage.setItem('rememberedPassword', password);
    } else {
      localStorage.removeItem('rememberedEmail');
      localStorage.removeItem('rememberedPassword');
    }

    await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
    await signInWithEmailAndPassword(email, password);
  };

  const handleForgotPassword = async (event: FormEvent) => {
    event.preventDefault();
    setResetEmailError('');

    if (!resetEmail) {
      setResetEmailError(t('login.emailRequired'));
      return;
    }

    if (!resetEmail.includes('@')) {
      setResetEmailError(t('login.invalidEmail'));
      return;
    }

    setResetLoading(true);

    try {
      await sendPasswordResetEmail(auth, resetEmail, {
        url: window.location.origin + '/login',
      });
      setResetSuccess(true);
    } catch (err: unknown) {
      const error = err as { code?: string };
      switch (error.code) {
        case 'auth/user-not-found':
          setResetEmailError(t('login.accountNotFound'));
          break;
        case 'auth/invalid-email':
          setResetEmailError(t('login.invalidEmail'));
          break;
        case 'auth/too-many-requests':
          setResetEmailError(t('login.tooManyAttempts'));
          break;
        default:
          setResetEmailError(t('login.resetError'));
      }
    } finally {
      setResetLoading(false);
    }
  };

  const openForgotModal = () => {
    setResetEmail(email);
    setResetEmailError('');
    setResetSuccess(false);
    setShowForgotModal(true);
  };

  const closeForgotModal = () => {
    setShowForgotModal(false);
    setResetEmail('');
    setResetEmailError('');
    setResetSuccess(false);
  };

  if (authLoading) {
    return (
      <>
        <SimpleHeader />
        <S.PageWrapper>
          <S.LoadingContainer>
            {t('login.checkingAuth')}
          </S.LoadingContainer>
        </S.PageWrapper>
      </>
    );
  }

  return (
    <>
      <SimpleHeader />
      <S.PageWrapper>
        <S.MainTitle>{t('login.title')}</S.MainTitle>

        <S.ContentGrid>
          <S.Column>
            <S.Subheading>{t('login.signIn')}</S.Subheading>
            {!firebaseConfigured && (
              <S.WarningBox>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <AlertTriangle size={20} style={{ flexShrink: 0, marginTop: '0.125rem' }} />
                  <div>
                    <strong>{t('login.firebaseNotConfigured')}</strong> {t('login.firebaseNotConfiguredDesc')}
                  </div>
                </div>
              </S.WarningBox>
            )}
            <S.LoginForm onSubmit={handleLoginSubmit}>
              <S.InputGroup>
                <S.Label htmlFor="email">{t('login.email')}</S.Label>
                <S.Input
                  type="email"
                  id="email"
                  placeholder={t('login.emailPlaceholder')}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError('');
                    setGeneralError('');
                  }}
                  onBlur={() => {
                    if (!email.trim()) {
                      setEmailError(t('login.emailRequired'));
                    } else if (!email.includes('@')) {
                      setEmailError(t('login.invalidEmail'));
                    }
                  }}
                  hasError={!!emailError}
                  required
                />
                {emailError && <S.FieldErrorMessage>{emailError}</S.FieldErrorMessage>}
              </S.InputGroup>

              <S.InputGroup>
                <S.Label htmlFor="password">{t('login.password')}</S.Label>
                <S.PasswordInputWrapper>
                  <S.Input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder={t('login.passwordPlaceholder')}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError('');
                      setGeneralError('');
                    }}
                    onBlur={() => {
                      if (!password.trim()) {
                        setPasswordError(t('login.passwordRequired'));
                      }
                    }}
                    hasError={!!passwordError}
                    required
                  />
                  <S.TogglePasswordButton
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? t('login.hidePassword') : t('login.showPassword')}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </S.TogglePasswordButton>
                </S.PasswordInputWrapper>
                {passwordError && <S.FieldErrorMessage>{passwordError}</S.FieldErrorMessage>}
              </S.InputGroup>

              <S.OptionsRow>
                <S.CheckboxWrapper onClick={() => setRememberMe(!rememberMe)}>
                  <input
                    type="checkbox"
                    id="remember-me"
                    checked={rememberMe}
                    readOnly
                  />
                  <S.Label htmlFor="remember-me">{t('login.rememberMe')}</S.Label>
                </S.CheckboxWrapper>
                <S.ForgotPasswordLink 
                  onClick={(e) => {
                    e.preventDefault();
                    openForgotModal();
                  }}
                >
                  {t('login.forgotPassword')}
                </S.ForgotPasswordLink>
              </S.OptionsRow>

              {generalError && (
                <S.ErrorMessage>
                  {generalError}
                </S.ErrorMessage>
              )}

              {error && (
                <S.ErrorMessage>
                  {error}
                </S.ErrorMessage>
              )}

              <S.ActionButton type="submit" disabled={loading || signInLoading}>
                {(loading || signInLoading) ? t('login.signingIn') : t('login.accessAccount')}
              </S.ActionButton>

              <S.CreateAccountButton to="/plans">
                {t('login.createAccount')}
              </S.CreateAccountButton>
            </S.LoginForm>
          </S.Column>
        </S.ContentGrid>
      </S.PageWrapper>

      {showForgotModal && (
        <S.ModalOverlay onClick={closeForgotModal}>
          <S.ModalContent onClick={(e) => e.stopPropagation()}>
            <S.ModalHeader>
              <S.ModalTitle>{t('login.resetPassword')}</S.ModalTitle>
              <S.CloseButton onClick={closeForgotModal} aria-label={t('common.close')}>
                <FiX />
              </S.CloseButton>
            </S.ModalHeader>

            {resetSuccess ? (
              <>
                <S.SuccessMessage>
                  <FiCheckCircle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>{t('login.emailSent')}</strong><br />
                    {t('login.emailSentDescription')}
                  </div>
                </S.SuccessMessage>
                <S.ActionButton type="button" onClick={closeForgotModal}>
                  {t('login.backToLogin')}
                </S.ActionButton>
              </>
            ) : (
              <>
                <S.ModalDescription>
                  {t('login.resetPasswordDescription')}
                </S.ModalDescription>

                <form onSubmit={handleForgotPassword}>
                  <S.InputGroup style={{ marginBottom: '1rem' }}>
                    <S.Label htmlFor="reset-email">{t('login.email')}</S.Label>
                    <S.Input
                      type="email"
                      id="reset-email"
                      placeholder={t('login.resetEmailPlaceholder')}
                      value={resetEmail}
                      onChange={(e) => {
                        setResetEmail(e.target.value);
                        setResetEmailError('');
                      }}
                      hasError={!!resetEmailError}
                      autoFocus
                    />
                    {resetEmailError && <S.FieldErrorMessage>{resetEmailError}</S.FieldErrorMessage>}
                  </S.InputGroup>

                  <S.ActionButton type="submit" disabled={resetLoading}>
                    {resetLoading ? t('login.sending') : t('login.sendResetLink')}
                  </S.ActionButton>
                </form>
              </>
            )}
          </S.ModalContent>
        </S.ModalOverlay>
      )}
    </>
  );
};
