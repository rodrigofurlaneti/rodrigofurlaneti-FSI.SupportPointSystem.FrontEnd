import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import ptBr from './i18n/locales/pt-br.json';
import en from './i18n/locales/en.json';
import es from './i18n/locales/es.json';
import fr from './i18n/locales/fr.json';
import zh from './i18n/locales/zh.json';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            pt: { translation: ptBr },
            en: { translation: en },
            es: { translation: es },
            fr: { translation: fr },
            zh: { translation: zh }
        },
        fallbackLng: 'pt',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;