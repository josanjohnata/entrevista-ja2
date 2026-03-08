"use client"
import React, { useState, FormEvent, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import * as S from "./styles";
import { FiCheck, FiUser, FiEye, FiEyeOff, FiHeart, FiUpload, FiFile, FiX } from "react-icons/fi";
import { auth, db, storage, functions } from "../../lib/firebase";
import { httpsCallable } from "firebase/functions";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FeaturesList, FeatureItem } from "../../components/sections/Features/styles";
import { Link, useSearchParams } from "react-router-dom";
import { Loading } from '../../components/common/Loading';
import { doc, setDoc, increment } from "firebase/firestore";
import { SimpleHeader } from "../../components/SimpleHeader";
import { useAuth } from "../../contexts/AuthContext";
import { createCheckoutSessionPCD } from "../../lib/stripe";
import { getRegionConfig, detectCountry, detectCountrySync } from "../../utils/regionDetector";

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  acceptedTerms?: string;
  laudo?: string;
}

export const CheckoutPCDScreen: React.FC = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [params] = useSearchParams();
  const referralCodeFromUrl = params.get("ref"); // Código de indicação da URL

  // Detecta a região e obtém a configuração de preço
  const regionConfig = useMemo(() => getRegionConfig(), []);
  
  const prefilledEmail = currentUser?.email || '';

  // Plano único com preço baseado na região
  const selectedPlan = {
    name: t('checkoutPCD.monthly'),
    description: t('checkoutPCD.monthlyDescription'),
    price: regionConfig.price,
    priceDisplay: `${regionConfig.currencySymbol} ${regionConfig.priceDisplay}`,
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
  const [laudoFile, setLaudoFile] = useState<File | null>(null);
  const [uploadingLaudo] = useState(false);

  const validateField = (field: string, value: string | File | null): string => {
    switch (field) {
      case 'name':
        return !value || (typeof value === 'string' && !value.trim()) ? t('checkout.nameRequired') : '';
      case 'email':
        if (!value || typeof value !== 'string' || !value.trim()) return t('checkout.emailRequired');
        if (!value.includes('@')) return t('checkout.emailInvalid');
        return '';
      case 'password':
        if (!value || typeof value !== 'string') return t('checkout.passwordRequired');
        if (value.length < 6) return t('checkout.passwordMinLength');
        return '';
      case 'confirmPassword':
        if (!value || typeof value !== 'string') return t('checkout.confirmPasswordRequired');
        if (value !== formValues.password) return t('checkout.passwordsDontMatch');
        return '';
      case 'laudo':
        if (!value) return t('checkoutPCD.laudoRequired');
        if (value instanceof File) {
          const maxSize = 10 * 1024 * 1024; // 10MB
          if (value.size > maxSize) return t('checkoutPCD.laudoMaxSize');
          const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
          if (!allowedTypes.includes(value.type)) return t('checkoutPCD.laudoInvalidType');
        }
        return '';
      default:
        return '';
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validação do arquivo
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

    if (file.size > maxSize) {
      setErrors(prev => ({ ...prev, laudo: t('checkoutPCD.laudoMaxSize') }));
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      setErrors(prev => ({ ...prev, laudo: t('checkoutPCD.laudoInvalidType') }));
      return;
    }

    setLaudoFile(file);
    setErrors(prev => ({ ...prev, laudo: undefined }));
    setTouched(prev => ({ ...prev, laudo: true }));
  };

  const handleRemoveLaudo = () => {
    setLaudoFile(null);
    setErrors(prev => ({ ...prev, laudo: undefined }));
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

    // Validar laudo
    if (!laudoFile) {
      newErrors.laudo = t('checkoutPCD.laudoRequired');
    } else {
      const laudoError = validateField('laudo', laudoFile);
      if (laudoError) newErrors.laudo = laudoError;
    }

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
        isPCD: true, // Marca o usuário como PCD
        pcdLaudoUrl: null, // Será atualizado após upload
        pcdLaudoUploadedAt: null,
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
        }
      }

      // Fazer upload do laudo de forma assíncrona (não bloqueia o redirecionamento)
      if (laudoFile) {
        // Upload em background - não bloqueia o redirecionamento
        (async () => {
          try {
            const fileRef = ref(storage, `pcd-laudos/${userCredential.user.uid}/${laudoFile.name}`);
            await uploadBytes(fileRef, laudoFile);
            const laudoUrl = await getDownloadURL(fileRef);
            
            // Atualizar o documento do usuário com a URL do laudo
            await setDoc(doc(db, "users", userCredential.user.uid), {
              pcdLaudoUrl: laudoUrl,
              pcdLaudoUploadedAt: new Date(),
            }, { merge: true });
          } catch (error) {
            console.error('Erro ao fazer upload do laudo:', error);
            // Não bloqueia o fluxo - o laudo pode ser enviado depois
          }
        })();
      }

      // Criar sessão de checkout dinâmica com trial period de 30 dias e email pré-preenchido
      try {
        console.log('Criando sessão de checkout PCD para:', formValues.email);
        const session = await createCheckoutSessionPCD({
          planId: 'plan_monthly',
          userId: userCredential.user.uid,
          email: formValues.email, // Email será pré-preenchido via customer_email no backend
          amount: regionConfig.price,
          currency: regionConfig.currency.toLowerCase() as 'brl' | 'eur' | 'usd',
          customerName: formValues.name,
          productName: `${t('checkoutPCD.monthlyPlan')} - FoxApply`,
          productDescription: t('checkoutPCD.monthlyPlanDescription'),
          metadata: {
            userId: userCredential.user.uid,
            planId: 'plan_monthly',
            isPCD: 'true',
          },
        });

        if (session && session.url) {
          console.log('Redirecionando para checkout do Stripe com email pré-preenchido:', formValues.email);
          window.location.href = session.url;
        } else {
          console.warn('Sessão não retornou URL, usando fallback');
          // Fallback para o Payment Link fixo se a sessão não for criada
          window.location.href = 'https://buy.stripe.com/cNi5kFek6fgqbG36fNbV603';
        }
      } catch (error) {
        console.error('Erro ao criar sessão de checkout:', error);
        // Fallback para o Payment Link fixo em caso de erro
        window.location.href = 'https://buy.stripe.com/cNi5kFek6fgqbG36fNbV603';
      }
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
          <S.MainTitle>
            <FiHeart style={{ marginRight: '0.5rem', color: '#10b981' }} />
            {t('checkoutPCD.title')}
          </S.MainTitle>
          <S.PCDBanner>
            <S.PCDBannerIcon>
              <FiHeart />
            </S.PCDBannerIcon>
            <S.PCDBannerContent>
              <S.PCDBannerTitle>{t('checkoutPCD.bannerTitle')}</S.PCDBannerTitle>
              <S.PCDBannerText>{t('checkoutPCD.bannerText')}</S.PCDBannerText>
            </S.PCDBannerContent>
          </S.PCDBanner>
          <S.CheckoutGrid>
            <S.FormColumn>
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
                        $hasError={touched.name && !!errors.name}
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
                        $hasError={touched.email && !!errors.email}
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
                          $hasError={touched.password && !!errors.password}
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
                          $hasError={touched.confirmPassword && !!errors.confirmPassword}
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
                    <S.InputGroup>
                      <label htmlFor="laudo">{t('checkoutPCD.laudoLabel')}</label>
                      {!laudoFile ? (
                        <S.FileUploadWrapper>
                          <S.FileUploadInput
                            id="laudo"
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleFileChange}
                            disabled={uploadingLaudo}
                            onBlur={() => setTouched(prev => ({ ...prev, laudo: true }))}
                          />
                          <S.FileUploadLabel htmlFor="laudo" $hasError={touched.laudo && !!errors.laudo}>
                            <FiUpload />
                            <span>{uploadingLaudo ? t('checkoutPCD.uploading') : t('checkoutPCD.selectFile')}</span>
                          </S.FileUploadLabel>
                          <S.FileUploadHint>{t('checkoutPCD.laudoHint')}</S.FileUploadHint>
                        </S.FileUploadWrapper>
                      ) : (
                        <S.FilePreview>
                          <S.FilePreviewIcon>
                            <FiFile />
                          </S.FilePreviewIcon>
                          <S.FilePreviewInfo>
                            <S.FilePreviewName>{laudoFile?.name || t('checkoutPCD.fileUploaded')}</S.FilePreviewName>
                            <S.FilePreviewSize>
                              {laudoFile && `${(laudoFile.size / 1024 / 1024).toFixed(2)} MB`}
                            </S.FilePreviewSize>
                          </S.FilePreviewInfo>
                          <S.FileRemoveButton type="button" onClick={handleRemoveLaudo} disabled={uploadingLaudo}>
                            <FiX />
                          </S.FileRemoveButton>
                        </S.FilePreview>
                      )}
                      {touched.laudo && errors.laudo && <S.FieldErrorMessage>{errors.laudo}</S.FieldErrorMessage>}
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
                        <span>{t('checkout.acceptTerms')} <S.TermsLink as={Link} to="/privacy-policy" target="_blank">{t('checkout.termsAndPrivacy')}</S.TermsLink> {t('checkout.ofPrivacy')}</span>
                      </S.TermsLabel>
                      {touched.acceptedTerms && errors.acceptedTerms && <S.FieldErrorMessage>{errors.acceptedTerms}</S.FieldErrorMessage>}
                    </S.InputGroup>
                  </S.FormSection>
                  <S.SubmitButton type="submit" disabled={!!loading || uploadingLaudo || !laudoFile}>
                    {loading || uploadingLaudo ? <Loading size="sm" /> : t('checkoutPCD.createAccount')}
                  </S.SubmitButton>
                </form>
            </S.FormColumn>

            <S.SummaryColumn>
              <S.SummaryCard>
                <S.SectionHeader>{t('checkoutPCD.chosenPlan')}</S.SectionHeader>
                <S.PlanTitle>{selectedPlan.name}</S.PlanTitle>
                <S.FreeTrialBadge>
                  <FiHeart />
                  {t('checkoutPCD.freeTrialBadge')}
                </S.FreeTrialBadge>
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

