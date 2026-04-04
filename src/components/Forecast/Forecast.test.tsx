import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Forecast from './Forecast'

vi.mock('../../helpers/weatherIcon.tsx', () => ({
  getWeatherIcon: vi.fn(() => <div data-testid="weather-icon" />)
}))

describe('Forecast', () => {
  const mockForecastData = [
    {
      dt: 1,
      dt_txt: '2026-03-27 12:00:00',
      main: { temp: 15 },
      weather: [{ description: 'ясно', icon: '01d' }]
    },
    {
      dt: 2,
      dt_txt: '2026-03-28 12:00:00',
      main: { temp: 18 },
      weather: [{ description: 'облачно', icon: '03d' }]
    }
  ]

  it('renders forecast items correctly', () => {
    render(<Forecast forecastData={mockForecastData as any} />)

    expect(screen.getByText('forecast5Days')).toBeInTheDocument()
    // 2 days * 2 copies due to react-glow = 4
    expect(screen.getAllByTestId('weather-icon')).toHaveLength(4)
    expect(screen.getAllByText(/15°C/)[0]).toBeInTheDocument()
    expect(screen.getAllByText(/18°C/)[0]).toBeInTheDocument()
    expect(screen.getAllByText('ясно')[0]).toBeInTheDocument()
    expect(screen.getAllByText('облачно')[0]).toBeInTheDocument()
  })

  it('returns null if forecastData is empty', () => {
    const { container } = render(<Forecast forecastData={[]} />)
    expect(container.firstChild).toBeNull()
  })
})
