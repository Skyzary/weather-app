import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import fr from './locales/fr.json';
import ru from './locales/ru.json';

const geoDetector: any = {
  name: 'geoDetector',
  type: 'languageDetector',
  async: true,
  detect: async (callback: (lng: string) => void) => {
    try {
      const response = await fetch('https://get.geojs.io/v1/ip/geo.json');
      if (!response.ok) {
        throw new Error(\`HTTP error! status: \${response.status}\`);
      }
      const data = await response.json();
      const countryCode = data.country;
      
      const frCountries = ['FR', 'BE', 'CH', 'CA', 'LU', 'MC', 'SN', 'CI', 'CM']; // French speaking countries
      const ruCountries = ['RU', 'BY', 'KZ', 'KG', 'TJ']; // Russian speaking countries
      
      if (frCountries.includes(countryCode)) {
        callback('fr');
      } else if (ruCountries.includes(countryCode)) {
        callback('ru');
      } else {
        callback('en');
      }
    } catch (error) {
      console.error('Geo detection failed:', error);
      callback('en'); // fallback
    }
  },
  init: () => {},
  cacheUserLanguage: () => {}
};

const languageDetector = new LanguageDetector();
languageDetector.addDetector(geoDetector);

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en,
      fr,
      ru
    },
    fallbackLng: 'en',
    detection: {
      order: ['geoDetector', 'localStorage', 'navigator'],
      caches: ['localStorage']
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;