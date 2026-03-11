import {create} from 'zustand'
import {persist} from 'zustand/middleware'
import type {CurrentWeatherData} from "../types/WeatherData";
import axios from "axios";
interface Store {
    city: string;
    setCity: (city: string) => void;
    weatherData:CurrentWeatherData | null;
    loading: boolean;
    cityFound: boolean;
    fetchWeather: (city: string) => Promise<void>;
}
export const useStore = create<Store>()(
    persist(
        (set) => ({
            city: "",
            setCity: (city) => set({ city }),
            weatherData: null,
            loading: false,
            cityFound: true,
            fetchWeather: async (city) => {
                if (!city) return;
                set({loading: true, cityFound: true })
                const params = {
                    q: city,
                    limit: 1,
                    appid: import.meta.env.VITE_API_KEY,

                };
                try {
                    const geo = await axios.get('https://api.openweathermap.org/geo/1.0/direct', {params})
                    if(!geo.data.length) {
                        throw new Error("City not found")
                    }
                    const {lat, lon, localNames} = await geo.data[0]
                    const cityName = localNames?.ru || geo.data[0].name
                    const weatherResponse = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
                        params: {
                            lat,
                            lon,
                            appid: import.meta.env.VITE_API_KEY,
                            units: "metric",
                            lang: "ru",
                        }
                    })
                    set({
                        city: cityName,
                        loading: false,
                        weatherData: weatherResponse.data,
                        cityFound: true
                    })



                } catch (error) {
                    set({
                        loading: false,
                        cityFound: false,
                        weatherData: null,
                        city: ""
                    })
                    console.error("Error fetching weather data:", error);
                }
                }

        }), {name: "weather-app-storage"}))