import i18n from '../i18n/config';

export const translateBackendError = (error: string | Error | unknown): string => {
  let errorCode = '';
  
  if (typeof error === 'string') {
    errorCode = error;
  } else if (error instanceof Error) {
    errorCode = error.message;
  } else if (error && typeof error === 'object' && 'errorCode' in error) {
    errorCode = (error as { errorCode: string }).errorCode;
  } else if (error && typeof error === 'object' && 'error' in error) {
    errorCode = (error as { error: string }).error;
  }

  const translationKey = `errors.backend.${errorCode}`;
  const translated = i18n.t(translationKey);
  
  if (translated === translationKey) {
    return i18n.t('errors.backend.UNKNOWN_ERROR');
  }
  
  return translated;
};

