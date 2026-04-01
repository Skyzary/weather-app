import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import WeatherData from './WeatherData'

vi.mock('../../helpers/weatherIcon.tsx', () => ({
  getWeatherIcon: vi.fn(() => <div data-testid="weather-icon" />)
}))

// Mock CircularProgressbar to avoid SVG issues in jsdom
vi.mock('react-circular-progressbar', () => ({
  CircularProgressbar: vi.fn(({ value }) => <div data-testid="circular-progress">{value}%</div>),
  buildStyles: vi.fn()
}))

describe('WeatherData', () => {
  const mockData = {
    name: 'Moscow',
    main: {
      temp: 20.4,
      humidity: 65,
      feels_like: 18.2,
      pressure: 1012
    },
    weather: [{
      description: 'ясно',
      icon: '01d'
    }],
    wind: {
      speed: 5.5
    }
  }

  it('renders all weather information correctly', () => {
    render(<WeatherData data={mockData as any} />)

    expect(screen.getAllByText(/20°C/)[0]).toBeInTheDocument()
    expect(screen.getAllByText(/Ощущается как: 18°C/)[0]).toBeInTheDocument()
    expect(screen.getAllByText(/ясно/)[0]).toBeInTheDocument()
    expect(screen.getAllByText(/5.5 м\/с/)[0]).toBeInTheDocument()
    expect(screen.getAllByText(/1012 гПа/)[0]).toBeInTheDocument()
    expect(screen.getAllByTestId('weather-icon')[0]).toBeInTheDocument()
  })

  it('renders fallback values when data is missing', () => {
    const incompleteData = {
      ...mockData,
      main: { temp: 20, humidity: 50 },
      wind: undefined,
      weather: []
    }
    render(<WeatherData data={incompleteData as any} />)

    expect(screen.getAllByText(/Нет описания/)[0]).toBeInTheDocument()
    expect(screen.getAllByText(/Недоступно/)[0]).toBeInTheDocument()
  })
})
