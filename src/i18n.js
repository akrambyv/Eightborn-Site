import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import trTranslation from './locales/tr/translation.json';
import enTranslation from './locales/en/translation.json';
import azTranslation from './locales/az/translation.json';
import ruTranslation from './locales/ru/translation.json';

const resources = {
  tr: {
    translation: trTranslation
  },
  en: {
    translation: enTranslation
  },
  az: {
    translation: azTranslation
  },
  ru: {
    translation: ruTranslation
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,

    fallbackLng: 'tr',

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false
    },

    debug: false
  });

export default i18n;