import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CurrentWeatherData, ForecastItem, ForecastData } from "../types/WeatherData";
import { weatherService } from '../services/weatherService';
import { imageService } from '../services/imageService';

interface Store {
    city: string;
    setCity: (city: string) => void;
    weatherData: CurrentWeatherData | null;
    forecastData: ForecastItem[] | null;
    loading: boolean;
    cityFound: boolean;
    fetchWeather: (city: string) => Promise<void>;
    foreCast: (city: string) => Promise<void>;
    fetchImage: (city: string) => Promise<void>;
    cityImage?: {
        imageUrl: string;
        imageAlt: string;
    };
}

export const useStore = create<Store>()(
    persist(
        (set, get) => ({
            city: "",
            setCity: (city) => set({ city }),
            weatherData: null,
            forecastData: null,
            loading: false,
            cityFound: true,

            fetchWeather: async (city: string) => {
                if (!city) return;
                set({
                    loading: true,
                    cityFound: true,
                    forecastData: null,
                    cityImage: undefined
                });

                try {
                    const coords = await weatherService.getGeo(city);

                    if (!coords) {
                        set({
                            loading: false,
                            cityFound: false,
                            weatherData: null,
                            forecastData: null,
                            cityImage: undefined
                        });
                        return;
                    }

                    const weatherData = await weatherService.fetchWeather(coords);

                    set({
                        loading: false,
                        weatherData,
                        cityFound: true
                    });

                    await get().fetchImage(coords.name);
                    await get().foreCast(coords.name);
                } catch (error) {
                    set({
                        loading: false,
                        cityFound: false,
                        weatherData: null,
                    });
                    console.error("Error in fetchWeather flow:", error);
                }
            },

            fetchImage: async (city: string) => {
                set({ cityImage: undefined })
                try {
                    const imageData = await imageService.getCityImage(city);
                    set({ cityImage: imageData || undefined });
                } catch (error) {
                    console.error("Error fetching image:", error);
                    set({ cityImage: undefined });
                }
            },

            foreCast: async (city: string) => {
                if (!city) return;
                try {
                    const coords = await weatherService.getGeo(city);
                    if (coords) {
                        const forecastResponse = await weatherService.getForecast(coords) as ForecastData | undefined;
                        if (forecastResponse && forecastResponse.list) {
                            const dailyData: ForecastItem[] = forecastResponse.list.filter((reading: ForecastItem) => {
                                return reading.dt_txt.includes('12:00:00');
                            });
                            set({ forecastData: dailyData });
                        } else {
                            set({ forecastData: null });
                        }
                    }
                } catch (error) {
                    console.error("Error fetching forecast:", error);
                }
            }
        }),
        { name: "weather-app-storage" }
    )
);
