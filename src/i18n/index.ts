import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import enHome from './en/home.json'

import ptHome from './pt/home.json'

i18n.use(initReactI18next).init({
  resources: {
    en: {
      home: enHome,
    },
    pt: {
      home: ptHome,
    },
  },
  lng: 'pt',
  fallbackLng: 'en',
  ns: ['home'],
  defaultNS: 'home',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
