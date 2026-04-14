import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { weatherService } from './weatherService'
import type { CityCoords, CurrentWeatherData, ForecastData } from '../types/WeatherData'

vi.mock('axios')

describe('weatherService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubEnv('VITE_API_KEY', 'test-key')
  })

  describe('getGeo', () => {
    it('should return coordinates for a valid city', async () => {
      const mockData = [{ lat: 55.75, lon: 37.61, name: 'Moscow' }]
      vi.mocked(axios.get).mockResolvedValue({ data: mockData })

      const result = await weatherService.getGeo('Moscow')

      expect(result).toEqual({ lat: 55.75, lon: 37.61, name: 'Moscow' })
      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('geo/1.0/direct'), expect.objectContaining({
        params: expect.objectContaining({ q: 'Moscow', appid: expect.any(String) })
      }))
    })

    it('should throw error when city is not found', async () => {
      vi.mocked(axios.get).mockResolvedValue({ data: [] })

      await expect(weatherService.getGeo('UnknownCity')).rejects.toThrow('cityNotFound')
    })

    it('should throw auth error on 401', async () => {
        vi.mocked(axios.isAxiosError).mockReturnValue(true)
        vi.mocked(axios.get).mockRejectedValue({
            response: { status: 401 },
            message: 'Unauthorized'
        })

        await expect(weatherService.getGeo('Moscow')).rejects.toThrow('authErrorWeather')
    })
  })

  describe('fetchWeather', () => {
    const mockCoords: CityCoords = { lat: 55.75, lon: 37.61, name: 'Moscow' }

    it('should fetch weather for valid coordinates', async () => {
      const mockWeather = { main: { temp: 20 }, name: 'Moscow' } as unknown as CurrentWeatherData
      vi.mocked(axios.get).mockResolvedValue({ data: mockWeather })

      const result = await weatherService.fetchWeather(mockCoords)

      expect(result).toEqual(mockWeather)
    })

    it('should throw error for invalid coordinates', async () => {
      await expect(weatherService.fetchWeather({ lat: NaN, lon: 37.61, name: '' })).rejects.toThrow('Invalid coordinates')
    })

    it('should throw auth error on 401', async () => {
        vi.mocked(axios.isAxiosError).mockReturnValue(true)
        vi.mocked(axios.get).mockRejectedValue({
            response: { status: 401 },
            message: 'Unauthorized'
        })

        await expect(weatherService.fetchWeather(mockCoords)).rejects.toThrow('authErrorWeather')
    })
  })

  describe('getForecast', () => {
    const mockCoords: CityCoords = { lat: 55.75, lon: 37.61, name: 'Moscow' }

    it('should return forecast data for valid coordinates', async () => {
      const mockForecast = { list: [{ dt_txt: '2026-03-27 12:00:00', main: { temp: 15 }, weather: [{icon: '01d', description: 'clear'}] }] } as unknown as ForecastData
      vi.mocked(axios.get).mockResolvedValue({ data: mockForecast })

      const result = await weatherService.getForecast(mockCoords)

      expect(result).toEqual(mockForecast)
    })

    it('should return undefined if coordinates are missing', async () => {
      const result = await weatherService.getForecast(undefined)
      expect(result).toBeUndefined()
    })

    it('should throw auth error on 401', async () => {
      vi.mocked(axios.isAxiosError).mockReturnValue(true)
      vi.mocked(axios.get).mockRejectedValue({
        response: { status: 401 },
        message: 'Unauthorized'
      })

      await expect(weatherService.getForecast(mockCoords)).rejects.toThrow('authError')
    })
  })
})

