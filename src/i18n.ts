import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import fr from './locales/fr.json';
import ru from './locales/ru.json';
import uk from './locales/uk.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en,
      fr,
      ru,
      uk
    },
    fallbackLng: 'en',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    },
    interpolation: {
      escapeValue: false
    }
  });

if (!localStorage.getItem('i18nextLng')) {
  fetch('https://get.geojs.io/v1/ip/geo.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      const countryCode = data.country;
      const frCountries = ['FR', 'BE', 'CH', 'CA', 'LU', 'MC', 'SN', 'CI', 'CM'];
      const ruCountries = ['RU', 'BY', 'KZ', 'KG', 'TJ'];
      const ukCountries = ['UA'];
      
      let lang = 'en';
      if (frCountries.includes(countryCode)) {
        lang = 'fr';
      } else if (ruCountries.includes(countryCode)) {
        lang = 'ru';
      } else if (ukCountries.includes(countryCode)) {
        lang = 'uk';
      }
      
      i18n.changeLanguage(lang);
    })
    .catch(error => {
      console.error('Geo detection failed:', error);
    });
}

export default i18n;
