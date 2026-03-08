import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ptTranslations from './locales/pt.json';

i18n.use(initReactI18next).init({
  resources: {
    pt: {
      translation: ptTranslations,
    },
  },
  lng: 'pt',
  fallbackLng: 'pt',
  supportedLngs: ['pt'],
  debug: false,
  interpolation: {
    escapeValue: false,
  },
});

i18n.on('languageChanged', (lng) => {
  if (document.documentElement) {
    document.documentElement.lang = lng;
  }
});

export default i18n;
