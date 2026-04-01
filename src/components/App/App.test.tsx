import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'
import { useStore } from '../../hooks/useStore'

vi.mock('../../hooks/useStore')

// Mock child components to keep App tests focused
vi.mock('../VillageSearchField/VillageSearchField', () => ({ default: () => <div data-testid="search-field" /> }))
vi.mock('../WeatherData/WeatherData', () => ({ default: () => <div data-testid="weather-data" /> }))
vi.mock('../Forecast/Forecast', () => ({ default: () => <div data-testid="forecast" /> }))
vi.mock('../CityImage/CityImage', () => ({ default: () => <div data-testid="city-image" /> }))
vi.mock('../Forecast/ForecastSkeleton', () => ({ default: () => <div data-testid="skeleton" /> }))

describe('App Component', () => {
  it('renders search field by default', () => {
    vi.mocked(useStore).mockReturnValue(null) // Mock state for each hook call if necessary, or use a complex mock
    // Better approach for Zustand mock in tests:
    vi.mocked(useStore).mockImplementation((selector: any) => selector({
      weatherData: null,
      loading: false,
      forecastData: null,
      cityImage: null
    }))

    render(<App />)
    expect(screen.getByTestId('search-field')).toBeInTheDocument()
    expect(screen.queryByTestId('weather-data')).not.toBeInTheDocument()
  })

  it('renders weather data and image when available', () => {
    vi.mocked(useStore).mockImplementation((selector: any) => selector({
      weatherData: { name: 'Moscow' },
      loading: false,
      forecastData: [{ dt: 1 }],
      cityImage: { imageUrl: 'url' }
    }))

    render(<App />)
    expect(screen.getByText(/Погода в городе: Moscow/)).toBeInTheDocument()
    expect(screen.getByTestId('weather-data')).toBeInTheDocument()
    expect(screen.getByTestId('city-image')).toBeInTheDocument()
    expect(screen.getByTestId('forecast')).toBeInTheDocument()
  })

  it('renders skeleton when loading', () => {
    vi.mocked(useStore).mockImplementation((selector: any) => selector({
      weatherData: null,
      loading: true,
      forecastData: null,
      cityImage: null
    }))

    render(<App />)
    expect(screen.getByTestId('skeleton')).toBeInTheDocument()
  })
})
