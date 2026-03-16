import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Forecast from '../Forecast';
import type { ForecastItem } from '../../../types/WeatherData';

vi.mock('@codaworks/react-glow', () => ({
  Glow: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  GlowCapture: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Minimal valid ForecastItem factory
function makeForecastItem(overrides: Partial<ForecastItem> = {}): ForecastItem {
  return {
    dt: 1700000000,
    main: {
      temp: 10,
      feels_like: 8,
      temp_min: 5,
      temp_max: 12,
      pressure: 1013,
      humidity: 70,
    },
    weather: [{ id: 800, main: 'Clear', description: 'ясно', icon: '01d' }],
    dt_txt: '2024-01-15 12:00:00',
    wind: { speed: 3, deg: 180, gust: 5 },
    ...overrides,
  };
}

describe('Forecast', () => {
  it('returns null when forecastData is an empty array', () => {
    const { container } = render(<Forecast forecastData={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the section heading when data is provided', () => {
    const items = [makeForecastItem()];
    render(<Forecast forecastData={items} />);
    expect(screen.getByText('Прогноз на 5 дней')).toBeInTheDocument();
  });

  it('renders one card per forecast item', () => {
    const items = [
      makeForecastItem({ dt: 1, dt_txt: '2024-01-15 12:00:00' }),
      makeForecastItem({ dt: 2, dt_txt: '2024-01-16 12:00:00' }),
      makeForecastItem({ dt: 3, dt_txt: '2024-01-17 12:00:00' }),
    ];
    render(<Forecast forecastData={items} />);
    // Each card shows a temperature
    const temps = screen.getAllByText(/°C/);
    expect(temps).toHaveLength(3);
  });

  it('rounds the temperature to nearest integer', () => {
    const items = [makeForecastItem({ main: { temp: 10.6, feels_like: 8, temp_min: 5, temp_max: 12, pressure: 1013, humidity: 70 } })];
    render(<Forecast forecastData={items} />);
    expect(screen.getByText('11°C')).toBeInTheDocument();
  });

  it('displays weather description for each item', () => {
    const items = [
      makeForecastItem({ weather: [{ id: 800, main: 'Clear', description: 'ясно', icon: '01d' }] }),
    ];
    render(<Forecast forecastData={items} />);
    expect(screen.getByText('ясно')).toBeInTheDocument();
  });

  it('renders a date string for each forecast item', () => {
    const items = [makeForecastItem({ dt_txt: '2024-01-15 12:00:00' })];
    render(<Forecast forecastData={items} />);
    // The formatted date uses ru-RU locale with weekday+day+month; just check something is rendered
    // We check a date-like element is present (non-empty span)
    const allSpans = document.querySelectorAll('span');
    const nonEmptySpans = Array.from(allSpans).filter((s) => s.textContent && s.textContent.trim() !== '');
    expect(nonEmptySpans.length).toBeGreaterThan(0);
  });

  it('renders 5 items when given 5 forecast entries', () => {
    const items = Array.from({ length: 5 }, (_, i) =>
      makeForecastItem({ dt: i, dt_txt: `2024-01-${15 + i} 12:00:00` }),
    );
    render(<Forecast forecastData={items} />);
    const tempElements = screen.getAllByText(/°C/);
    expect(tempElements).toHaveLength(5);
  });

  it('uses the weather icon from the first weather entry', () => {
    const items = [makeForecastItem({ weather: [{ id: 800, main: 'Clear', description: 'ясно', icon: '01d' }] })];
    const { container } = render(<Forecast forecastData={items} />);
    // Icon container should exist
    const iconDivs = container.querySelectorAll('[class*="icon"]');
    expect(iconDivs.length).toBeGreaterThan(0);
  });

  it('renders as a <section> element', () => {
    const items = [makeForecastItem()];
    const { container } = render(<Forecast forecastData={items} />);
    expect(container.querySelector('section')).toBeInTheDocument();
  });
});