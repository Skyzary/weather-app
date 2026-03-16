import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import IziToastMock from 'izitoast';
import App from '../App';

// --- Mocks ---

vi.mock('@codaworks/react-glow', () => ({
  Glow: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  GlowCapture: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('react-circular-progressbar', () => ({
  CircularProgressbar: ({ text }: { text: string }) => <div>{text}</div>,
  buildStyles: () => ({}),
}));

vi.mock('izitoast', () => ({
  default: { error: vi.fn(), success: vi.fn() },
}));

vi.mock('@mawtech/glass-ui/styles.css', () => ({}));

const mockForeCast = vi.fn();
const mockFetchWeather = vi.fn();

// Default store state – no data loaded
const defaultStoreState = {
  weatherData: null,
  loading: false,
  cityFound: true,
  forecastData: null,
  foreCast: mockForeCast,
  fetchWeather: mockFetchWeather,
  cityImage: undefined,
};

// Allow tests to override store state
let storeState = { ...defaultStoreState };

vi.mock('../../../hooks/useStore', () => ({
  useStore: () => storeState,
}));

beforeEach(() => {
  storeState = { ...defaultStoreState };
  mockForeCast.mockClear();
  mockFetchWeather.mockClear();
  localStorage.clear();
});

describe('App', () => {
  it('renders the search field component', () => {
    render(<App />);
    expect(screen.getByPlaceholderText('Введите название города или деревни')).toBeInTheDocument();
  });

  it('does not show weather heading when weatherData is null', () => {
    render(<App />);
    expect(screen.queryByText(/Погода в городе/)).toBeNull();
  });

  it('shows weather heading with city name when weatherData is present', () => {
    storeState = {
      ...defaultStoreState,
      weatherData: {
        name: 'London',
        main: { temp: 15, humidity: 70, feels_like: 12, pressure: 1010 },
        weather: [{ description: 'облачно', icon: '04d' }],
        wind: { speed: 5 },
      },
    };
    render(<App />);
    expect(screen.getByText('Погода в городе: London')).toBeInTheDocument();
  });

  it('renders ForecastSkeleton when loading=true', () => {
    storeState = { ...defaultStoreState, loading: true };
    render(<App />);
    expect(screen.getByText('Прогноз на 5 дней')).toBeInTheDocument();
    // ForecastSkeleton renders skeleton cards
    const skeletonCards = document.querySelectorAll('[class*="skeletonCard"]');
    expect(skeletonCards.length).toBeGreaterThan(0);
  });

  it('does not render ForecastSkeleton when loading=false', () => {
    storeState = { ...defaultStoreState, loading: false };
    render(<App />);
    // No skeleton cards
    const skeletonCards = document.querySelectorAll('[class*="skeletonCard"]');
    expect(skeletonCards.length).toBe(0);
  });

  it('renders Forecast when forecastData is present and not loading', () => {
    storeState = {
      ...defaultStoreState,
      loading: false,
      forecastData: [
        {
          dt: 1,
          main: { temp: 10, feels_like: 8, temp_min: 5, temp_max: 12, pressure: 1013, humidity: 70 },
          weather: [{ id: 800, main: 'Clear', description: 'ясно', icon: '01d' }],
          dt_txt: '2024-01-15 12:00:00',
          wind: { speed: 3, deg: 180, gust: 5 },
        },
      ],
    };
    render(<App />);
    // Forecast component renders '°C' temperature
    expect(screen.getAllByText(/°C/).length).toBeGreaterThanOrEqual(1);
  });

  it('calls foreCast when weatherData with a name is available', () => {
    storeState = {
      ...defaultStoreState,
      weatherData: {
        name: 'Paris',
        main: { temp: 20, humidity: 60 },
        weather: [{ description: 'sunny', icon: '01d' }],
      },
    };
    render(<App />);
    expect(mockForeCast).toHaveBeenCalledWith('Paris');
  });

  it('does not call foreCast when weatherData is null', () => {
    render(<App />);
    expect(mockForeCast).not.toHaveBeenCalled();
  });

  it('renders CityImage when cityImage is present and not loading', () => {
    storeState = {
      ...defaultStoreState,
      loading: false,
      weatherData: {
        name: 'Rome',
        main: { temp: 22, humidity: 55 },
        weather: [{ description: 'clear', icon: '01d' }],
      },
      cityImage: { imageUrl: 'https://example.com/rome.jpg', imageAlt: 'Rome' },
    };
    render(<App />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'https://example.com/rome.jpg');
  });

  it('does not render CityImage when cityImage is undefined', () => {
    storeState = { ...defaultStoreState, cityImage: undefined };
    render(<App />);
    expect(screen.queryByRole('img')).toBeNull();
  });

  it('shows IziToast error when cityFound becomes false', () => {
    const mockedIzi = vi.mocked(IziToastMock);
    storeState = { ...defaultStoreState, cityFound: false };
    render(<App />);
    expect(mockedIzi.error).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Ошибка', message: 'Город не найден' }),
    );
  });
});