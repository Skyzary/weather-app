import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useStore } from './useStore'
import { weatherService } from '../services/weatherService'
import { imageService } from '../services/imageService'

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
    const mockCoords = { lat: 51.5, lon: -0.12, name: 'London' }
    const mockWeather = { main: { temp: 15 }, name: 'London' }
    const mockImage = { imageUrl: 'url', imageAlt: 'alt' }
    const mockForecast = { list: [] }

    vi.mocked(weatherService.getGeo).mockResolvedValue(mockCoords)
    vi.mocked(weatherService.fetchWeather).mockResolvedValue(mockWeather as any)
    vi.mocked(imageService.getCityImage).mockResolvedValue(mockImage)
    vi.mocked(weatherService.getForecast).mockResolvedValue(mockForecast as any)

    await useStore.getState().fetchWeather('London')

    const state = useStore.getState()
    expect(state.weatherData).toEqual(mockWeather)
    expect(state.cityFound).toBe(true)
    expect(state.loading).toBe(false)
  })

  it('should handle city not found', async () => {
    vi.mocked(weatherService.getGeo).mockResolvedValue(undefined)

    await useStore.getState().fetchWeather('UnknownCity')

    const state = useStore.getState()
    expect(state.cityFound).toBe(false)
    expect(state.weatherData).toBeNull()
    expect(state.loading).toBe(false)
  })
})
