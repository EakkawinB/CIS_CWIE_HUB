import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { translations } from './translations'

// Extract language codes from translations object
export const SUPPORTED_LANGUAGES = Object.keys(
  translations
) as Array<keyof typeof translations>

const resources = {
  en: { translation: translations.en },
  th: { translation: translations.th },
}

// Initialize i18next with react support
if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
      resources,
      fallbackLng: 'en',
      supportedLngs: SUPPORTED_LANGUAGES,
      ns: ['translation'],
      defaultNS: 'translation',
      interpolation: {
        escapeValue: false, // React already protects from XSS
      },
      detection: {
        order: ['localStorage', 'navigator'],
        caches: ['localStorage'],
      },
    })
}

export default i18n
