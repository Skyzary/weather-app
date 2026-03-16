import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import WeatherData from './WeatherData';

vi.mock('@codaworks/react-glow', () => ({
  Glow: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  GlowCapture: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('react-circular-progressbar', () => ({
  CircularProgressbar: ({ value, text }: { value: number; text: string }) => (
    <div data-testid="circular-progressbar" data-value={value}>{text}</div>
  ),
  buildStyles: () => ({}),
}));

vi.mock('react-circular-progressbar/dist/styles.css', () => ({}));

vi.mock('../../helpers/weatherIcon.tsx', () => ({
  getWeatherIcon: (_icon?: string) => <svg data-testid="weather-icon" />,
}));

vi.mock('react-icons/fa', () => ({
  FaTemperatureHigh: () => <svg data-testid="temp-icon" />,
  FaWind: () => <svg data-testid="wind-icon" />,
  FaTachometerAlt: () => <svg data-testid="pressure-icon" />,
}));

vi.mock('react-icons/wi', () => ({
  WiHumidity: () => <svg data-testid="humidity-icon" />,
}));

const baseWeatherData = {
  name: 'London',
  main: {
    temp: 15.6,
    humidity: 72,
    feels_like: 14.2,
    pressure: 1013,
  },
  weather: [{ description: 'облачно с прояснениями', icon: '04d' }],
  wind: { speed: 5.5 },
};

describe('WeatherData rendering', () => {
  it('renders a weather icon via getWeatherIcon', () => {
    render(<WeatherData data={baseWeatherData} />);
    expect(screen.getByTestId('weather-icon')).toBeInTheDocument();
  });

  it('renders the rounded temperature', () => {
    render(<WeatherData data={baseWeatherData} />);
    expect(screen.getByText('16°C')).toBeInTheDocument();
  });

  it('renders the weather description', () => {
    render(<WeatherData data={baseWeatherData} />);
    expect(screen.getByText('облачно с прояснениями')).toBeInTheDocument();
  });

  it('renders the feels_like temperature rounded', () => {
    render(<WeatherData data={baseWeatherData} />);
    // 14.2 rounds to 14
    expect(screen.getByText(/14/)).toBeInTheDocument();
  });

  it('renders "--" when feels_like is undefined', () => {
    const data = { ...baseWeatherData, main: { ...baseWeatherData.main, feels_like: undefined } };
    render(<WeatherData data={data} />);
    expect(screen.getByText(/--/)).toBeInTheDocument();
  });

  it('renders the humidity as a circular progressbar', () => {
    render(<WeatherData data={baseWeatherData} />);
    const progressbar = screen.getByTestId('circular-progressbar');
    expect(progressbar).toBeInTheDocument();
    expect(progressbar).toHaveAttribute('data-value', '72');
    expect(progressbar.textContent).toBe('72%');
  });

  it('renders wind speed when provided', () => {
    render(<WeatherData data={baseWeatherData} />);
    expect(screen.getByText('5.5 м/с')).toBeInTheDocument();
  });

  it('renders "Недоступно" when wind speed is undefined', () => {
    const data = { ...baseWeatherData, wind: undefined };
    render(<WeatherData data={data} />);
    const unavailableElements = screen.getAllByText('Недоступно');
    expect(unavailableElements.length).toBeGreaterThanOrEqual(1);
  });

  it('renders pressure when provided', () => {
    render(<WeatherData data={baseWeatherData} />);
    expect(screen.getByText('1013 гПа')).toBeInTheDocument();
  });

  it('renders "Недоступно" for pressure when it is undefined', () => {
    const data = { ...baseWeatherData, main: { ...baseWeatherData.main, pressure: undefined } };
    render(<WeatherData data={data} />);
    const unavailableElements = screen.getAllByText('Недоступно');
    expect(unavailableElements.length).toBeGreaterThanOrEqual(1);
  });

  it('renders the temperature label', () => {
    render(<WeatherData data={baseWeatherData} />);
    expect(screen.getByText('Температура')).toBeInTheDocument();
  });

  it('renders the humidity label', () => {
    render(<WeatherData data={baseWeatherData} />);
    expect(screen.getByText('Влажность')).toBeInTheDocument();
  });

  it('renders the wind speed label', () => {
    render(<WeatherData data={baseWeatherData} />);
    expect(screen.getByText('Скорость ветра')).toBeInTheDocument();
  });

  it('renders the pressure label', () => {
    render(<WeatherData data={baseWeatherData} />);
    expect(screen.getByText('Давление')).toBeInTheDocument();
  });
});

describe('WeatherData temperature rounding', () => {
  it('rounds temperature down correctly', () => {
    const data = { ...baseWeatherData, main: { ...baseWeatherData.main, temp: 20.3 } };
    render(<WeatherData data={data} />);
    expect(screen.getByText('20°C')).toBeInTheDocument();
  });

  it('rounds negative temperature correctly', () => {
    const data = { ...baseWeatherData, main: { ...baseWeatherData.main, temp: -3.7 } };
    render(<WeatherData data={data} />);
    expect(screen.getByText('-4°C')).toBeInTheDocument();
  });

  it('handles zero temperature', () => {
    const data = { ...baseWeatherData, main: { ...baseWeatherData.main, temp: 0 } };
    render(<WeatherData data={data} />);
    expect(screen.getByText('0°C')).toBeInTheDocument();
  });
});

describe('WeatherData icons', () => {
  it('renders temperature icon', () => {
    render(<WeatherData data={baseWeatherData} />);
    expect(screen.getByTestId('temp-icon')).toBeInTheDocument();
  });

  it('renders humidity icon', () => {
    render(<WeatherData data={baseWeatherData} />);
    expect(screen.getByTestId('humidity-icon')).toBeInTheDocument();
  });

  it('renders wind icon', () => {
    render(<WeatherData data={baseWeatherData} />);
    expect(screen.getByTestId('wind-icon')).toBeInTheDocument();
  });

  it('renders pressure icon', () => {
    render(<WeatherData data={baseWeatherData} />);
    expect(screen.getByTestId('pressure-icon')).toBeInTheDocument();
  });
});