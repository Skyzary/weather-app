import axios from "axios";
import type { CurrentWeatherData, CityCoords, ForecastData, ForecastItem } from '../types/WeatherData';

const geoUrl = 'https://api.openweathermap.org/geo/1.0/direct';
const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather';
const forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';

export const weatherService = {
    async getGeo(city: string): Promise<CityCoords | undefined> {
        if (!city) {
            return undefined;
        }
        const params = {
            q: city,
            limit: 1,
            appid: import.meta.env.VITE_API_KEY,
        };
        try {
            const response = await axios.get(geoUrl, { params });
            if (response.data && response.data.length > 0) {
                const { lat, lon, name } = response.data[0];
                return { lat, lon, name };
            }
            return undefined;
        } catch (error) {
            console.error('Error fetching geo data: ' + error);
            throw error;
        }
    },

    async fetchWeather(coords: CityCoords): Promise<CurrentWeatherData | null> {
        if (!coords) {
            return null;
        }
        const params = {
            lat: coords.lat,
            lon: coords.lon,
            appid: import.meta.env.VITE_API_KEY,
            units: "metric",
            lang: "ru"
        };
        try {
            const response = await axios.get(weatherUrl, { params });
            return response.data as CurrentWeatherData;
        } catch (error) {
            console.error('Error fetching weather data: ' + error);
            throw error;
        }
    },

    async getForecast(coords: CityCoords): Promise<ForecastItem[] | undefined> {
        if (!coords) {
            return undefined;
        }
        const params = {
            lat: coords.lat,
            lon: coords.lon,
            appid: import.meta.env.VITE_API_KEY,
            units: "metric",
            lang: "ru"
        };
        try {
            const response = await axios.get(forecastUrl, { params });
            const forecastData = response.data as ForecastData;
            if (forecastData && forecastData.list) {
                const dailyData: ForecastItem[] = forecastData.list.filter((reading: ForecastItem) => {
                    return reading.dt_txt.includes('12:00:00');
                });
                return dailyData;
            }
            return undefined;
        } catch (error) {
            console.error('Error fetching forecast data: ' + error);
            throw error;
        }
    }
};
