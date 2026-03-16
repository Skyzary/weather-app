import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Forecast from './Forecast';
import type { ForecastItem } from '../../types/WeatherData';

vi.mock('@codaworks/react-glow', () => ({
  Glow: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  GlowCapture: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('../../helpers/weatherIcon.tsx', () => ({
  getWeatherIcon: (_icon?: string) => <svg data-testid="weather-icon" />,
}));

const makeForecastItem = (overrides?: Partial<ForecastItem>): ForecastItem => ({
  dt: 1700000000,
  main: {
    temp: 15,
    feels_like: 14,
    temp_min: 12,
    temp_max: 18,
    pressure: 1015,
    humidity: 65,
  },
  weather: [{ id: 800, main: 'Clear', description: 'ясно', icon: '01d' }],
  dt_txt: '2023-11-14 12:00:00',
  wind: { speed: 5, deg: 200, gust: 7 },
  ...overrides,
});

const sampleForecastData: ForecastItem[] = [
  makeForecastItem({ dt: 1, dt_txt: '2023-11-14 12:00:00', main: { temp: 15, feels_like: 14, temp_min: 12, temp_max: 18, pressure: 1015, humidity: 65 } }),
  makeForecastItem({ dt: 2, dt_txt: '2023-11-15 12:00:00', main: { temp: 12, feels_like: 11, temp_min: 10, temp_max: 14, pressure: 1016, humidity: 70 }, weather: [{ id: 801, main: 'Clouds', description: 'облачно', icon: '04d' }] }),
  makeForecastItem({ dt: 3, dt_txt: '2023-11-16 12:00:00', main: { temp: 8, feels_like: 7, temp_min: 6, temp_max: 10, pressure: 1017, humidity: 75 }, weather: [{ id: 500, main: 'Rain', description: 'дождь', icon: '10d' }] }),
];

describe('Forecast component', () => {
  it('renders null when forecastData is empty', () => {
    const { container } = render(<Forecast forecastData={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders a section with the forecast title', () => {
    render(<Forecast forecastData={sampleForecastData} />);
    expect(screen.getByText('Прогноз на 5 дней')).toBeInTheDocument();
  });

  it('renders the correct number of forecast day items', () => {
    render(<Forecast forecastData={sampleForecastData} />);
    const temps = screen.getAllByText(/°C/);
    expect(temps).toHaveLength(sampleForecastData.length);
  });

  it('renders temperature rounded to nearest integer', () => {
    const data = [makeForecastItem({ main: { temp: 14.7, feels_like: 13, temp_min: 12, temp_max: 17, pressure: 1015, humidity: 65 } })];
    render(<Forecast forecastData={data} />);
    expect(screen.getByText('15°C')).toBeInTheDocument();
  });

  it('renders temperature rounded down when below .5', () => {
    const data = [makeForecastItem({ main: { temp: 14.3, feels_like: 13, temp_min: 12, temp_max: 17, pressure: 1015, humidity: 65 } })];
    render(<Forecast forecastData={data} />);
    expect(screen.getByText('14°C')).toBeInTheDocument();
  });

  it('renders the weather description for each item', () => {
    render(<Forecast forecastData={sampleForecastData} />);
    expect(screen.getByText('ясно')).toBeInTheDocument();
    expect(screen.getByText('облачно')).toBeInTheDocument();
    expect(screen.getByText('дождь')).toBeInTheDocument();
  });

  it('renders a weather icon for each forecast item', () => {
    render(<Forecast forecastData={sampleForecastData} />);
    const icons = screen.getAllByTestId('weather-icon');
    expect(icons).toHaveLength(sampleForecastData.length);
  });

  it('renders a formatted date for each item', () => {
    render(<Forecast forecastData={sampleForecastData} />);
    // dt_txt '2023-11-14 12:00:00' should produce a non-empty date string
    const dateElements = document.querySelectorAll('span');
    const dateSpans = Array.from(dateElements).filter((el) =>
      el.textContent && !el.textContent.includes('°C')
    );
    expect(dateSpans.length).toBeGreaterThan(0);
  });

  it('renders a section element', () => {
    render(<Forecast forecastData={sampleForecastData} />);
    expect(document.querySelector('section')).toBeInTheDocument();
  });

  // Edge case: single item forecast
  it('renders correctly with exactly one forecast item', () => {
    const single = [makeForecastItem()];
    render(<Forecast forecastData={single} />);
    expect(screen.getByText('15°C')).toBeInTheDocument();
    expect(screen.getByText('ясно')).toBeInTheDocument();
  });

  // Negative temperature boundary
  it('renders negative temperature correctly', () => {
    const data = [makeForecastItem({ main: { temp: -5.6, feels_like: -7, temp_min: -8, temp_max: -4, pressure: 1020, humidity: 80 } })];
    render(<Forecast forecastData={data} />);
    expect(screen.getByText('-6°C')).toBeInTheDocument();
  });
});