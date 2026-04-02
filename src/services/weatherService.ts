import axios from "axios";
import iziToast from 'izitoast'
import type {CityCoords, CurrentWeatherData, ForecastData} from '../types/WeatherData'

const geoUrl = 'https://api.openweathermap.org/geo/1.0/direct'
const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather'
const forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast'

export const  weatherService = {
    /** 
     * @param city - village name for search
     * @returns - {lat, lon, name} or undefined if error
     * */


    async getGeo(city: string): Promise<CityCoords | undefined> {
        const accessKey = import.meta.env.VITE_API_KEY
        const params = {
            q: city,
            limit: 1,
            appid: accessKey,
        }
        try {
            if (city) {
                const response = await axios.get(geoUrl, {params})
                if (response.data && response.data.length > 0) {
                    return ({
                        lat: response.data[0].lat,
                        lon: response.data[0].lon,
                        name: response.data[0].name
                    } as CityCoords)
                }
                iziToast.error({ message: 'Город не найден' })
            }
            return undefined

        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                iziToast.error({ message: 'Weather: Ошибка авторизации' })
                return undefined
            }
            throw new Error('Error fetching weather data: ' + error)
        }


    },
    async  fetchWeather(coords: CityCoords): Promise<CurrentWeatherData> {
        /**
         * @param coords - {lat, lon}
         * @returns - CurrentWeatherData */
        const accessKey = import.meta.env.VITE_API_KEY
        if (!coords || !Number.isFinite(coords.lat) || !Number.isFinite(coords.lon)){
            throw new Error('Invalid coordinates')
        }
        if (!accessKey || !accessKey.length) throw new Error('API key is not defined')


        try {
            const params = {
                lat: coords.lat,
                lon: coords.lon,
                appid: accessKey,
                units: "metric",
                lang: "ru"
            }
            const response = await axios.get(weatherUrl, {params})
            return response.data as CurrentWeatherData
        } catch (error) {
            throw new Error('Error fetching weather data: ' + error)
        }
    },

    async getForecast(coords?: CityCoords) {
        /**
         * @param coords - {lat, lon}
         * @returns - ForecastData */
        const accessKey = import.meta.env.VITE_API_KEY
        if (!coords) return undefined;
        if (!accessKey) throw new Error('API key is not defined');
        const params = {
            lat: coords.lat,
            lon: coords.lon,
            appid: accessKey,
            units: "metric",
            lang: "ru"
        }
        try {
            const response = await axios.get(forecastUrl, {params})
            return  response.data as ForecastData
        }  catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                iziToast.error({ message: 'Ошибка авторизации' })
                return undefined
            }
            throw new Error('Error fetching weather data: ' + error)
        }
    }
}


