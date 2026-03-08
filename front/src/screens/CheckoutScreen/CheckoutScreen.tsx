"use client"
import React, { useState, FormEvent, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import * as S from "./styles";
import { FiCheck, FiUser, FiEye, FiEyeOff } from "react-icons/fi";
import { auth, db, functions } from "../../lib/firebase";
import { httpsCallable } from "firebase/functions";
import { FeaturesList, FeatureItem } from "../../components/sections/Features/styles";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { ROUTES } from "../../routes/paths";
import { StripeCheckout } from "./StripeCheckout";
import { Loading } from '../../components/common/Loading';
import { doc, setDoc, increment } from "firebase/firestore";
import { SimpleHeader } from "../../components/SimpleHeader";
import { useAuth } from "../../contexts/AuthContext";
import { PlanKey } from "../../lib/stripe";
import { getRegionConfig, detectCountry, detectCountrySync, getPlanPrice } from "../../utils/regionDetector";

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  acceptedTerms?: string;
}

export const CheckoutScreen: React.FC = () => {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const selectedPlanId = (params.get("plan") || 'monthly') as PlanKey | 'lifetime';
  const userIdFromParams = params.get("userid");
  const emailFromParams = params.get("email");
  const customerNameFromParams = params.get("customerName");
  // Código de indicação: primeiro tenta da URL, depois do localStorage
  const referralCodeFromUrl = params.get("ref") || localStorage.getItem('referral_code');
  
  // Detecta a região e obtém a configuração de preço
  const regionConfig = useMemo(() => getRegionConfig(), []);
  
  // Só mostra o pagamento se houver userId e email válidos nos parâmetros da URL
  // Isso garante que o usuário já preencheu o formulário de registro
  const shouldShowPayment = userIdFromParams && emailFromParams && emailFromParams.trim() !== '';
  const userId = userIdFromParams || currentUser?.uid;
  const prefilledEmail = emailFromParams || currentUser?.email || '';

  // Obter informações do plano selecionado baseado na região
  const planType = selectedPlanId === 'lifetime' ? 'lifetime' : selectedPlanId === 'quarterly' ? 'quarterly' : 'monthly';
  const planPrice = getPlanPrice(regionConfig.region, planType);
  const planPriceInCents = planPrice.price;
  const planPriceDisplay = `${regionConfig.currencySymbol} ${planPrice.priceDisplay}`;
  
  const selectedPlan = {
    name: selectedPlanId === 'lifetime' ? t('plans.lifetime') : selectedPlanId === 'quarterly' ? t('plans.quarterly') : t('plans.monthly'),
    description: selectedPlanId === 'lifetime' ? t('plans.lifetimeDescription') : selectedPlanId === 'quarterly' ? t('plans.quarterlyDescription') : t('plans.monthlyDescription'),
    price: planPriceInCents,
    priceDisplay: planPriceDisplay,
  };
  
  const [formValues, setFormValues] = useState({
    name: '',
    email: prefilledEmail,
    password: '',
    confirmPassword: ''
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateField = (field: string, value: string): string => {
    switch (field) {
      case 'name':
        return !value.trim() ? t('checkout.nameRequired') : '';
      case 'email':
        if (!value.trim()) return t('checkout.emailRequired');
        if (!value.includes('@')) return t('checkout.emailInvalid');
        return '';
      case 'password':
        if (!value) return t('checkout.passwordRequired');
        if (value.length < 6) return t('checkout.passwordMinLength');
        return '';
      case 'confirmPassword':
        if (!value) return t('checkout.confirmPasswordRequired');
        if (value !== formValues.password) return t('checkout.passwordsDontMatch');
        return '';
      default:
        return '';
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormValues(prev => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, formValues[field as keyof typeof formValues]);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const [
    createUserWithEmailAndPassword,
    ,
    loading,
    authError,
  ] = useCreateUserWithEmailAndPassword(auth);

  const planFeatures = [
    t('checkout.features.feature1'),
    t('checkout.features.feature2'),
    t('checkout.features.feature3'),
    t('checkout.features.feature4'),
    t('checkout.features.feature10'),
    t('checkout.features.feature5'),
    t('checkout.features.feature6'),
    t('checkout.features.feature7'),
    t('checkout.features.feature8'),
    t('checkout.features.feature9'),
  ];


  const handleSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newErrors: FormErrors = {};
    const fields = ['name', 'email', 'password', 'confirmPassword'] as const;
    
    fields.forEach(field => {
      const error = validateField(field, formValues[field]);
      if (error) newErrors[field] = error;
    });

    if (!acceptedTerms) {
      newErrors.acceptedTerms = t('checkout.acceptTermsRequired');
    }

    setErrors(newErrors);
    setTouched({ name: true, email: true, password: true, confirmPassword: true, acceptedTerms: true });

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    const userCredential = await createUserWithEmailAndPassword(
      formValues.email,
      formValues.password
    );

    if (!userCredential) {
      return;
    }

    try {
      // Aguardar e garantir que o usuário está autenticado
      let currentUser = auth.currentUser;
      let retries = 0;
      const maxRetries = 5;
      
      // Aguardar até que o usuário esteja disponível e autenticado
      while ((!currentUser || currentUser.uid !== userCredential.user.uid) && retries < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 200));
        currentUser = auth.currentUser;
        retries++;
      }
      
      if (!currentUser || currentUser.uid !== userCredential.user.uid) {
        throw new Error('Usuário não autenticado corretamente');
      }

      // Forçar atualização do token para garantir que está válido
      const idToken = await currentUser.getIdToken(true);
      if (!idToken) {
        throw new Error('Token de autenticação não disponível');
      }

      // Detectar país do usuário
      let detectedCountry: string | undefined;
      try {
        detectedCountry = await detectCountry();
      } catch (error) {
        console.warn('Erro ao detectar país, usando fallback:', error);
        detectedCountry = detectCountrySync();
      }

      // Aguardar um pouco para dar tempo da Cloud Function criar o documento se necessário
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Referência do documento do usuário
      const userDocRef = doc(db, "users", userCredential.user.uid);
      
      // Tentar criar/atualizar o documento com retry em caso de erro de permissão
      let documentCreated = false;
      retries = 0;
      
      while (!documentCreated && retries < maxRetries) {
        try {
          // Sempre usar merge: true para evitar conflitos com a Cloud Function
          await setDoc(userDocRef, {
            nome: formValues.name,
            cpf: null,
            lastSUB: null,
            userId: userCredential.user.uid,
            subscriptionStatus: 'pending',
            region: regionConfig.region,
            currency: regionConfig.currency,
            country: detectedCountry,
          }, { merge: true });
          documentCreated = true;
        } catch (error: unknown) {
          retries++;
          const firebaseError = error as { code?: string; message?: string };
          console.error(`Tentativa ${retries} de criar documento falhou:`, firebaseError);
          
          if (firebaseError.code === 'permission-denied' && retries < maxRetries) {
            // Aguardar mais tempo e tentar novamente
            await new Promise(resolve => setTimeout(resolve, 500));
            // Forçar atualização do token novamente
            await currentUser.getIdToken(true);
          } else {
            throw error;
          }
        }
      }

      // Atualizar estatísticas
      try {
        const statsRef = doc(db, 'stats', 'users');
        await setDoc(statsRef, { count: increment(1), updatedAt: new Date() }, { merge: true });
      } catch (error) {
        // Não bloquear o fluxo se houver erro nas estatísticas
        console.warn('Erro ao atualizar estatísticas:', error);
      }

      // Processar código de indicação se presente
      if (referralCodeFromUrl) {
        try {
          const processReferralSignup = httpsCallable(functions, 'processReferralSignup');
          await processReferralSignup({ referralCode: referralCodeFromUrl });
          console.log('✅ Código de indicação processado com sucesso');
        } catch (error: unknown) {
          // Não bloquear o fluxo se houver erro na indicação
          console.warn('⚠️ Erro ao processar código de indicação:', error);
          // Erros comuns: código inválido, usuário já indicado, etc.
          // Não mostramos erro para o usuário para não atrapalhar o cadastro
        }
      }

      const newParams = new URLSearchParams();
      newParams.set('plan', selectedPlanId);
      newParams.set('email', formValues.email);
      newParams.set('userid', userCredential.user.uid);
      if (formValues.name) {
        newParams.set('customerName', formValues.name);
      }
      // Manter o código de indicação na URL se existir
      if (referralCodeFromUrl) {
        newParams.set('ref', referralCodeFromUrl);
      }
      
      navigate(`${ROUTES.PAGAMENTO}?${newParams.toString()}`, { replace: true });
    } catch (e) {
      console.error('Error saving user data:', e);
      setErrors(prev => ({ ...prev, email: t('checkout.createAccountError') }));
    }
  }

  useEffect(() => {
    if (authError) {
      switch (authError.code) {
        case 'auth/email-already-in-use':
          setErrors(prev => ({ ...prev, email: t('checkout.emailAlreadyInUse') }));
          break;
        case 'auth/invalid-email':
          setErrors(prev => ({ ...prev, email: t('checkout.emailInvalidError') }));
          break;
        case 'auth/weak-password':
          setErrors(prev => ({ ...prev, password: t('checkout.weakPassword') }));
          break;
        case 'auth/operation-not-allowed':
          setErrors(prev => ({ ...prev, email: t('checkout.operationNotAllowed') }));
          break;
        default:
          setErrors(prev => ({ ...prev, email: t('checkout.createAccountError') }));
      }
    }
  }, [authError, t]);

  return (
    <>
      <SimpleHeader />
      <S.PageWrapper>
        <S.MainContainer>
          <S.MainTitle>{t('checkout.title')}</S.MainTitle>
          <S.CheckoutGrid>
            <S.FormColumn>
              {shouldShowPayment ? (
                <StripeCheckout
                  planId={selectedPlanId === 'lifetime' ? 'plan_lifetime' : selectedPlanId === 'quarterly' ? 'plan_quarterly' : 'plan_monthly'}
                  userId={userId!}
                  email={prefilledEmail}
                  customerName={customerNameFromParams || formValues.name}
                />
              ) : (
                <form onSubmit={handleSignIn}>
                  <S.FormSection>
                    <S.SectionHeader><FiUser /> {t('checkout.data')}</S.SectionHeader>
                    <S.InputGroup>
                      <label htmlFor="name">{t('checkout.fullName')}</label>
                      <S.Input 
                        id="name" 
                        type="text" 
                        placeholder={t('checkout.fullNamePlaceholder')} 
                        name="name"
                        value={formValues.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        onBlur={() => handleBlur('name')}
                        hasError={touched.name && !!errors.name}
                      />
                      {touched.name && errors.name && <S.FieldErrorMessage>{errors.name}</S.FieldErrorMessage>}
                    </S.InputGroup>
                    <S.InputGroup>
                      <label htmlFor="email">{t('checkout.email')}</label>
                      <S.Input 
                        id="email" 
                        type="email" 
                        placeholder={t('checkout.emailPlaceholder')} 
                        name="email" 
                        value={formValues.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        onBlur={() => handleBlur('email')}
                        hasError={touched.email && !!errors.email}
                      />
                      {touched.email && errors.email && <S.FieldErrorMessage>{errors.email}</S.FieldErrorMessage>}
                    </S.InputGroup>
                    <S.InputGroup>
                      <label htmlFor="password">{t('checkout.password')}</label>
                      <S.PasswordInputWrapper>
                        <S.Input 
                          id="password" 
                          type={showPassword ? "text" : "password"}
                          placeholder={t('login.passwordPlaceholder')} 
                          name="password"
                          value={formValues.password}
                          onChange={(e) => handleChange('password', e.target.value)}
                          onBlur={() => handleBlur('password')}
                          hasError={touched.password && !!errors.password}
                          style={{ paddingRight: '45px' }}
                        />
                        <S.TogglePasswordButton
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? t('login.hidePassword') : t('login.showPassword')}
                        >
                          {showPassword ? <FiEyeOff /> : <FiEye />}
                        </S.TogglePasswordButton>
                      </S.PasswordInputWrapper>
                      {touched.password && errors.password && <S.FieldErrorMessage>{errors.password}</S.FieldErrorMessage>}
                    </S.InputGroup>
                    <S.InputGroup>
                      <label htmlFor="confirmPassword">{t('checkout.confirmPassword')}</label>
                      <S.PasswordInputWrapper>
                        <S.Input 
                          id="confirmPassword" 
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder={t('login.passwordPlaceholder')} 
                          name="confirmPassword"
                          value={formValues.confirmPassword}
                          onChange={(e) => handleChange('confirmPassword', e.target.value)}
                          onBlur={() => handleBlur('confirmPassword')}
                          hasError={touched.confirmPassword && !!errors.confirmPassword}
                          style={{ paddingRight: '45px' }}
                        />
                        <S.TogglePasswordButton
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          aria-label={showConfirmPassword ? t('login.hidePassword') : t('login.showPassword')}
                        >
                          {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                        </S.TogglePasswordButton>
                      </S.PasswordInputWrapper>
                      {touched.confirmPassword && errors.confirmPassword && <S.FieldErrorMessage>{errors.confirmPassword}</S.FieldErrorMessage>}
                    </S.InputGroup>
                  </S.FormSection>
                  <S.FormSection>
                    <S.InputGroup>
                      <S.TermsLabel>
                        <input 
                          type="checkbox" 
                          checked={acceptedTerms}
                          onChange={(e) => {
                            setAcceptedTerms(e.target.checked);
                            setTouched(prev => ({ ...prev, acceptedTerms: true }));
                            if (e.target.checked) {
                              setErrors(prev => ({ ...prev, acceptedTerms: undefined }));
                            } else {
                              setErrors(prev => ({ ...prev, acceptedTerms: t('checkout.acceptTermsRequired') }));
                            }
                          }}
                        />
                        <span>{t('checkout.acceptTerms')} <S.TermsLink as={Link} to={ROUTES.POLITICA_PRIVACIDADE} target="_blank">{t('checkout.termsAndPrivacy')}</S.TermsLink> {t('checkout.ofPrivacy')}</span>
                      </S.TermsLabel>
                      {touched.acceptedTerms && errors.acceptedTerms && <S.FieldErrorMessage>{errors.acceptedTerms}</S.FieldErrorMessage>}
                    </S.InputGroup>
                  </S.FormSection>
                  <S.SubmitButton type="submit" disabled={!!loading}>
                    {loading ? <Loading size="sm" /> : t('checkout.createAccount')}
                  </S.SubmitButton>
                </form>
              )}
            </S.FormColumn>

            <S.SummaryColumn>
              <S.SummaryCard>
                <S.SectionHeader>{t('checkout.chosenPlan')}</S.SectionHeader>
                <S.PlanTitle>{selectedPlan.name}</S.PlanTitle>
                <FeaturesList>
                  {planFeatures.map((feature) => (
                    <FeatureItem key={feature} style={{ fontSize: '1rem' }}>
                      <FiCheck size={20} />
                      <span> {feature}</span>
                    </FeatureItem>
                  ))}
                </FeaturesList>
              </S.SummaryCard>
            </S.SummaryColumn>
          </S.CheckoutGrid>
        </S.MainContainer>
      </S.PageWrapper>
    </>
  );
};
