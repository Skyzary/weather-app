import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useStore } from './useStore'
import { weatherService } from '../services/weatherService'
import { imageService } from '../services/imageService'
import iziToast from 'izitoast'
import type { CurrentWeatherData, ForecastData, CityCoords } from '../types/WeatherData'

vi.mock('../services/weatherService')
vi.mock('../services/imageService')
vi.mock('izitoast')

describe('useStore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useStore.setState({
      city: '',
      weatherData: null,
      forecastData: null,
      loading: false,
      cityFound: true,
      cityImage: undefined
    })
  })

  it('should update city', () => {
    useStore.getState().setCity('London')
    expect(useStore.getState().city).toBe('London')
  })

  it('should fetch weather and update state correctly', async () => {
    const mockCoords = { lat: 51.5, lon: -0.12, name: 'London' } as CityCoords
    const mockWeather = { main: { temp: 15 }, name: 'London', weather: [{description: 'clear', icon: '01d'}] } as unknown as CurrentWeatherData
    const mockImage = { imageUrl: 'url', imageAlt: 'alt' }
    const mockForecast = { list: [] } as unknown as ForecastData

    vi.mocked(weatherService.getGeo).mockResolvedValue(mockCoords)
    vi.mocked(weatherService.fetchWeather).mockResolvedValue(mockWeather)
    vi.mocked(imageService.getCityImage).mockResolvedValue(mockImage)
    vi.mocked(weatherService.getForecast).mockResolvedValue(mockForecast)

    await useStore.getState().fetchWeather('London')

    const state = useStore.getState()
    expect(state.weatherData).toEqual(mockWeather)
    expect(state.cityFound).toBe(true)
    expect(state.loading).toBe(false)
  })

  it('should handle city not found error from service', async () => {
    vi.mocked(weatherService.getGeo).mockRejectedValue(new Error('cityNotFound'))

    await useStore.getState().fetchWeather('UnknownCity')

    const state = useStore.getState()
    expect(state.cityFound).toBe(false)
    expect(state.weatherData).toBeNull()
    expect(state.loading).toBe(false)
    expect(iziToast.error).toHaveBeenCalledWith(expect.objectContaining({
      message: expect.stringContaining('cityNotFound')
    }))
  })

  it('should handle auth error from service', async () => {
    vi.mocked(weatherService.getGeo).mockRejectedValue(new Error('authErrorWeather'))

    await useStore.getState().fetchWeather('London')

    const state = useStore.getState()
    expect(state.cityFound).toBe(false)
    expect(iziToast.error).toHaveBeenCalledWith(expect.objectContaining({
      message: expect.stringContaining('authErrorWeather')
    }))
  })
})
