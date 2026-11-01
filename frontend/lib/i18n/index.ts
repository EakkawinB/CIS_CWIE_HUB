import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enCommon from './locales/en/common.json';
import thCommon from './locales/th/common.json';

const savedLanguage = localStorage.getItem('cwie_language');

const initialLanguage =
  savedLanguage === 'th' || savedLanguage === 'en'
    ? savedLanguage
    : 'en';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: enCommon,
      },
      th: {
        common: thCommon,
      },
    },

    lng: initialLanguage,
    fallbackLng: 'en',

    defaultNS: 'common',
    ns: ['common'],

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;