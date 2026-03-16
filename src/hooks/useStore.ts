import {create} from 'zustand'
import {persist} from 'zustand/middleware'
import type {CurrentWeatherData, ForecastItem} from "../types/WeatherData";
import axios from "axios";

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
                         set({
                            loading: false,
                            cityFound: false,
                            weatherData: null,
                            city: ""
                        })
                        return;
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
                    get().fetchImage(cityName);
                } catch (error) {
                    set({
                        loading: false,
                        cityFound: false,
                        weatherData: null,
                        city: ""
                    })
                    console.error("Error fetching weather data:", error);
                }
            },
            fetchImage: async (city: string): Promise<void> => {
                if (!city) return;
                const baseUrl = "https://api.unsplash.com/search/photos";

                try{
                    const response = await axios.get(`${baseUrl}`, {params: {
                        query: city,
                        client_id: import.meta.env.VITE_UNSPLASH_ACCESS_KEY,
                        per_page: 1,
                        orientation: "landscape",
                    }})
                    const result = response.data.results[0]
                    if (result){
                        const optimizeUrl = new URL(result.urls.raw)
                        optimizeUrl.searchParams.set("fm", "avif")
                        optimizeUrl.searchParams.set("w", "600")
                        optimizeUrl.searchParams.set("h", "400")
                        optimizeUrl.searchParams.set("fit", "crop")
                        optimizeUrl.searchParams.set("q", "50")
                        set({cityImage: {
                                imageUrl: optimizeUrl.toString(),
                                imageAlt: result.alt_description
                        }})
                    } else {
                        set({cityImage: undefined})
                    }
                }
                catch (error) {
                    console.error("Error fetching image from Unsplash:", error);
                    set({cityImage: undefined})
                }
            },

            foreCast: async (city: string): Promise<void> => {
                if (!city) return;
                set({loading: true})
                try {
                    const forecastResp = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
                        params: {
                            q: city,
                            units: "metric",
                            appid: import.meta.env.VITE_API_KEY,
                            lang: "ru"
                        }
                    });
                    const forecastData = forecastResp.data
                    const dailyData: ForecastItem[] = forecastData.list.filter((reading: ForecastItem) => {
                        return reading.dt_txt.includes('12:00:00')
                    });
                    set({
                        loading: false,
                        forecastData: dailyData
                    })
                } catch (error) {
                    console.error("Error fetching forecast data:", error);
                    set({ loading: false });
                }
            }
        }),
        {name: "weather-app-storage"},
    )
)
