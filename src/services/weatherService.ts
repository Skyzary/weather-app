import axios from "axios";
import iziToast from 'izitoast'
import type {CityCoords, CurrentWeatherData, ForecastData} from '../types/WeatherData'
import i18n from '../i18n'

const geoUrl = 'https://api.openweathermap.org/geo/1.0/direct'
const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather'
const forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast'
const accessKey = import.meta.env.VITE_API_KEY
const abortController: AbortController = new AbortController();

export const weatherService = {
    abortController: abortController,
    /**
     * @param city - village name for search
     * @returns - {lat, lon, name} or undefined if error
     * */


    async getGeo(city: string): Promise<CityCoords | undefined> {
        if (weatherService.abortController) {
            weatherService.abortController.abort()
        }
        weatherService.abortController = new AbortController();
        const params = {
            q: city,
            limit: 1,
            appid: accessKey,
        }
        try {
            if (city) {
                const response = await axios.get(geoUrl, {params, signal: this.abortController.signal})
                if (response.data && response.data.length > 0) {
                    return ({
                        lat: response.data[0].lat,
                        lon: response.data[0].lon,
                        name: response.data[0].name
                    } as CityCoords)
                } else {
                    iziToast.error({message: i18n.t('cityNotFound')})
                }
            }
            return undefined

        } catch (error) {
            if (error instanceof Error) {
                console.log('Error is' + error.message, error.cause)

            }
            if (axios.isCancel(error)) return Promise.reject('Request aborted');
            if (axios.isAxiosError(error) && error.message) {
                if (error?.response?.status === 401) {
                    iziToast.error({
                        message: i18n.t('authErrorWeather'),
                        position: "topCenter",
                    })
                }
                if (error.response?.status !== 401) {
                    throw new Error(
                        `Error fetching geo data: ${error.message} `,
                        {cause: error}
                    );
                }
            }

        }


    },

    async fetchWeather(coords: CityCoords): Promise<CurrentWeatherData | undefined> {
        /**
         * @param coords - {lat, lon}
         * @returns - CurrentWeatherData */

        if (weatherService.abortController) {
            weatherService.abortController.abort()
        }
        weatherService.abortController = new AbortController();

        if (!coords || !Number.isFinite(coords.lat) || !Number.isFinite(coords.lon)) {
            throw new Error('Invalid coordinates')
        }
        if (!accessKey || !accessKey.length) throw new Error('API key is not defined')


        try {
            const params = {
                lat: coords.lat,
                lon: coords.lon,
                appid: accessKey,
                units: "metric",
                lang: i18n.language?.split('-')[0] || "en"
            }
            const response = await axios.get(weatherUrl, {params, signal: this.abortController.signal})
            return response.data
        } catch (error) {
            if (error instanceof Error) {
                console.log('Error is' + error.message, error.cause)
            }
            if (axios.isCancel(error)) return Promise.reject('Request aborted');
            if (axios.isAxiosError(error) && error.message) {
                if (error?.response?.status === 401) {
                    iziToast.error({
                        title: "Ошибка",
                        message: i18n.t('authErrorWeather'),
                        position: "topCenter",
                    })
                }
                if (error.response?.status !== 401) {
                    throw new Error(
                        `Error fetching weather data: ${error.message} `,
                        {cause: error}
                    );
                }
            }
        }
    },

    async getForecast(coords: CityCoords | undefined): Promise<ForecastData | undefined> {
        /**
         * @param coords - {lat, lon}
         * @returns - ForecastData */
        if (this.abortController) {
            this.abortController.abort()
        }
        this.abortController = new AbortController();

        if (!coords) return undefined;
        if (!accessKey) throw new Error('API key is not defined');
        const params = {
            lat: coords.lat,
            lon: coords.lon,
            appid: accessKey,
            units: "metric",
            lang: i18n.language?.split('-')[0] || "en"
        }
        try {
            const response = await axios.get(forecastUrl, {params, signal: this.abortController.signal})
            return response.data as ForecastData


        } catch (error) {
            if (error instanceof Error) {
                console.log('Error is' + error.message, error.cause)
            }
            if (axios.isCancel(error)) return Promise.reject('Request aborted');
            if (axios.isAxiosError(error) && error.message) {
                if (error?.response?.status === 401) {
                    iziToast.error({
                        message: i18n.t('authError'),
                        position: "topCenter",
                    })
                }
                console.log('Error is' + error.message, error.cause)
                if (error.response?.status !== 401) {
                    throw new Error(
                        `Error forecasting data: ${error.message} `,
                        {cause: error}
                    );
                }


            }
        }
    }
}


