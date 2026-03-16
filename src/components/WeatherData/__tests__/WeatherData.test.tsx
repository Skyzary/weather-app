import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import WeatherData from '../WeatherData';

vi.mock('@codaworks/react-glow', () => ({
  Glow: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  GlowCapture: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// react-circular-progressbar uses SVG which jsdom handles, but we mock it for simplicity
vi.mock('react-circular-progressbar', () => ({
  CircularProgressbar: ({ value, text }: { value: number; text: string }) => (
    <div data-testid="circular-progressbar" data-value={value}>
      {text}
    </div>
  ),
  buildStyles: () => ({}),
}));

const baseData = {
  name: 'Moscow',
  main: {
    temp: 5.4,
    humidity: 80,
    feels_like: 2.1,
    pressure: 1012,
  },
  weather: [{ description: 'пасмурно', icon: '04d' }],
  wind: { speed: 7 },
};

describe('WeatherData', () => {
  it('renders the rounded temperature', () => {
    render(<WeatherData data={baseData} />);
    expect(screen.getByText('5°C')).toBeInTheDocument();
  });

  it('rounds temperature correctly (ceil)', () => {
    const data = { ...baseData, main: { ...baseData.main, temp: 10.6 } };
    render(<WeatherData data={data} />);
    expect(screen.getByText('11°C')).toBeInTheDocument();
  });

  it('renders feels_like temperature', () => {
    render(<WeatherData data={baseData} />);
    // feels_like: 2.1 rounds to 2; it appears inside the <small> tag
    const small = document.querySelector('small');
    expect(small?.textContent).toMatch(/2/);
  });

  it('shows "--" for feels_like when not provided', () => {
    const data = { ...baseData, main: { temp: 5, humidity: 80 } };
    render(<WeatherData data={data} />);
    expect(screen.getByText(/--/)).toBeInTheDocument();
  });

  it('renders weather description', () => {
    render(<WeatherData data={baseData} />);
    expect(screen.getByText('пасмурно')).toBeInTheDocument();
  });

  it('renders humidity value in the circular progressbar', () => {
    render(<WeatherData data={baseData} />);
    const progressbar = screen.getByTestId('circular-progressbar');
    expect(progressbar).toHaveAttribute('data-value', '80');
  });

  it('renders humidity percentage text', () => {
    render(<WeatherData data={baseData} />);
    expect(screen.getByText('80%')).toBeInTheDocument();
  });

  it('renders wind speed when provided', () => {
    render(<WeatherData data={baseData} />);
    expect(screen.getByText('7 м/с')).toBeInTheDocument();
  });

  it('shows "Недоступно" for wind speed when wind is undefined', () => {
    const data = { ...baseData, wind: undefined };
    render(<WeatherData data={data} />);
    // wind speed section
    const unavailableElements = screen.getAllByText('Недоступно');
    expect(unavailableElements.length).toBeGreaterThanOrEqual(1);
  });

  it('renders pressure value when provided', () => {
    render(<WeatherData data={baseData} />);
    expect(screen.getByText('1012 гПа')).toBeInTheDocument();
  });

  it('shows "Недоступно" for pressure when pressure is undefined', () => {
    const data = { ...baseData, main: { temp: 5, humidity: 80, feels_like: 2 } };
    render(<WeatherData data={data} />);
    const unavailableElements = screen.getAllByText('Недоступно');
    expect(unavailableElements.length).toBeGreaterThanOrEqual(1);
  });

  it('renders the "Температура" label', () => {
    render(<WeatherData data={baseData} />);
    expect(screen.getByText('Температура')).toBeInTheDocument();
  });

  it('renders the "Влажность" label', () => {
    render(<WeatherData data={baseData} />);
    expect(screen.getByText('Влажность')).toBeInTheDocument();
  });

  it('renders the "Скорость ветра" label', () => {
    render(<WeatherData data={baseData} />);
    expect(screen.getByText('Скорость ветра')).toBeInTheDocument();
  });

  it('renders the "Давление" label', () => {
    render(<WeatherData data={baseData} />);
    expect(screen.getByText('Давление')).toBeInTheDocument();
  });

  it('renders without crashing when wind.speed is 0', () => {
    const data = { ...baseData, wind: { speed: 0 } };
    render(<WeatherData data={data} />);
    // speed 0 is falsy so shows Недоступно
    expect(screen.getAllByText('Недоступно').length).toBeGreaterThanOrEqual(1);
  });
});