import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import enHome from './en/home.json'
import enTodo from './en/todo.json'

import ptHome from './pt/home.json'
import ptTodo from './pt/todo.json'

i18n.use(initReactI18next).init({
  resources: {
    en: {
      home: enHome,
      todo: enTodo,
    },
    pt: {
      home: ptHome,
      todo: ptTodo,
    },
  },
  lng: 'pt',
  fallbackLng: 'en',
  ns: ['home', 'todo'],
  defaultNS: 'home',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
