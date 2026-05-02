import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CurrentWeatherData, ForecastItem, ForecastData, CityCoords } from '../types/WeatherData';
import { weatherService } from '../services/weatherService';
import { imageService } from '../services/imageService';
import iziToast from 'izitoast';
import i18n from '../i18n';

interface Store {
  city: string;
  setCity: (city: string) => void;
  weatherData: CurrentWeatherData | null;
  forecastData: ForecastItem[] | null;
  loading: boolean;
  cityFound: boolean;
  fetchWeather: (cityOrCoords: string | CityCoords) => Promise<void>;
  foreCast: (coords: CityCoords) => Promise<void>;
  fetchImage: (city: string) => Promise<void>;
  cityImage?: {
    imageUrl: string;
    imageAlt: string;
  };
  suggestions: CityCoords[];
  setSuggestions: (suggestions: CityCoords[]) => void;
}
export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      suggestions: [],
      setSuggestions: (list) => set({ suggestions: list }),
      city: '',
      setCity: (city) => set({ city }),
      weatherData: null,
      forecastData: null,
      loading: false,
      cityFound: true,

      fetchWeather: async (cityOrCoords: string | CityCoords) => {
        set({
          loading: true,
          cityFound: true,
          forecastData: null,
          cityImage: undefined,
        });

        try {
          let primaryCity: CityCoords;

          if (typeof cityOrCoords === 'string') {
            const coordsList = await weatherService.getGeo(cityOrCoords);
            set({ suggestions: coordsList });

            if (!coordsList || coordsList.length === 0) {
              set({
                loading: false,
                cityFound: false,
                weatherData: null,
                forecastData: null,
                suggestions: [],
              });
              return;
            }
            primaryCity = coordsList[0];
          } else {
            primaryCity = cityOrCoords;
          }

          const weatherData = await weatherService.fetchWeather(primaryCity, i18n.language?.split('-')[0] || 'en');

          set({
            loading: false,
            weatherData,
            cityFound: true,
          });

          await get().fetchImage(primaryCity.name);
          await get().foreCast(primaryCity);
        } catch (error) {
          set({ loading: false, cityFound: false, weatherData: null });
          if (error instanceof Error) {
            let messageKey = 'error';
            switch (error.message) {
              case 'cityNotFound':
                messageKey = 'cityNotFound';
                break;
              case 'authErrorWeather':
                messageKey = 'authErrorWeather';
                break;
              default:
                messageKey = 'error';
                break;
            }
            iziToast.error({
              title: i18n.t('error'),
              message: i18n.t(messageKey),
              position: 'topCenter',
              timeout: 5000,
            });
          } else {
            console.log('Promise was rejected');
          }
        }
      },

      fetchImage: async (city: string) => {
        set({ cityImage: undefined });
        try {
          const imageData = await imageService.getCityImage(city);
          set({ cityImage: imageData || undefined });
        } catch (error) {
          set({ cityImage: undefined });
          if (error instanceof Error) {
            let messageKey = 'imageError';
            switch (error.message) {
              case 'authErrorUnsplash':
                messageKey = 'authErrorUnsplash';
                break;
              default:
                messageKey = 'imageError';
                break;
            }
            iziToast.error({
              title: i18n.t('imageError'),
              message: i18n.t(messageKey),
              position: 'topCenter',
              timeout: 5000,
            });
          }
        }
      },

      foreCast: async (coords: CityCoords): Promise<void> => {
        try {
          const forecastResponse = (await weatherService.getForecast(coords, i18n.language?.split('-')[0] || 'en')) as
            | ForecastData
            | undefined;

          if (forecastResponse && forecastResponse.list) {
            const dailyData: ForecastItem[] = forecastResponse.list.filter((reading: ForecastItem) => {
              return reading.dt_txt.includes('12:00:00');
            });
            set({ forecastData: dailyData });
          } else {
            set({ forecastData: null });
          }
        } catch (error) {
          if (error instanceof Error) {
            let messageKey = 'forecastError';
            switch (error.message) {
              case 'authError':
                messageKey = 'authError';
                break;
              default:
                messageKey = 'forecastError';
                break;
            }
            iziToast.error({
              title: i18n.t('forecastError'),
              message: i18n.t(messageKey),
              position: 'topCenter',
              timeout: 5000,
            });
          }
        }
      },
    }),
    {
      name: 'weather-app-storage',
      partialize: (state) => ({
        city: state.city,
        weatherData: state.weatherData,
        forecastData: state.forecastData,
      }),
    },
  ),
);
