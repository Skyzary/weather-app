import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import App from './App';

// Mock izitoast to prevent DOM manipulation errors
vi.mock('izitoast', () => ({
  default: {
    error: vi.fn(),
    success: vi.fn(),
    info: vi.fn(),
  },
}));

// Mock @mawtech/glass-ui styles import
vi.mock('@mawtech/glass-ui/styles.css', () => ({}));

// Mock child components
vi.mock('../VillageSearchField/VillageSearchField', () => ({
  default: () => <div data-testid="village-search-field" />,
}));

vi.mock('../WeatherData/WeatherData', () => ({
  default: ({ data }: { data: { name: string } }) => (
    <div data-testid="weather-data">{data.name}</div>
  ),
}));

vi.mock('../Forecast/Forecast.tsx', () => ({
  default: ({ forecastData }: { forecastData: unknown[] }) => (
    <div data-testid="forecast" data-count={forecastData.length} />
  ),
}));

vi.mock('../Forecast/ForecastSkeleton.tsx', () => ({
  default: () => <div data-testid="forecast-skeleton" />,
}));

vi.mock('../CityImage/CityImage.tsx', () => ({
  default: ({ imageUrl }: { imageUrl: string }) => (
    <img data-testid="city-image" src={imageUrl} alt="city" />
  ),
}));

const mockForeCast = vi.fn();
const mockUseStoreState = {
  weatherData: null as null | { name: string; main: { temp: number; humidity: number }; weather: { description: string; icon: string }[] },
  loading: false,
  cityFound: true,
  forecastData: null as null | unknown[],
  foreCast: mockForeCast,
  cityImage: undefined as undefined | { imageUrl: string; imageAlt: string },
};

vi.mock('../../hooks/useStore', () => ({
  useStore: () => mockUseStoreState,
}));

import IziToast from 'izitoast';

beforeEach(() => {
  vi.clearAllMocks();
  // Reset store state
  mockUseStoreState.weatherData = null;
  mockUseStoreState.loading = false;
  mockUseStoreState.cityFound = true;
  mockUseStoreState.forecastData = null;
  mockUseStoreState.cityImage = undefined;
});

describe('App component rendering', () => {
  it('renders the VillageSearchField component', () => {
    render(<App />);
    expect(screen.getByTestId('village-search-field')).toBeInTheDocument();
  });

  it('does not render weather data header when weatherData is null', () => {
    render(<App />);
    expect(screen.queryByText(/Погода в городе/)).not.toBeInTheDocument();
  });

  it('renders weather city header when weatherData is set', () => {
    mockUseStoreState.weatherData = {
      name: 'London',
      main: { temp: 15, humidity: 70 },
      weather: [{ description: 'cloudy', icon: '04d' }],
    };
    render(<App />);
    expect(screen.getByText('Погода в городе: London')).toBeInTheDocument();
  });

  it('does not render WeatherData when weatherData is null', () => {
    render(<App />);
    expect(screen.queryByTestId('weather-data')).not.toBeInTheDocument();
  });

  it('renders WeatherData when weatherData is provided and not loading', () => {
    mockUseStoreState.weatherData = {
      name: 'Paris',
      main: { temp: 20, humidity: 60 },
      weather: [{ description: 'sunny', icon: '01d' }],
    };
    mockUseStoreState.loading = false;
    render(<App />);
    expect(screen.getByTestId('weather-data')).toBeInTheDocument();
  });

  it('does not render WeatherData when loading is true', () => {
    mockUseStoreState.weatherData = {
      name: 'Paris',
      main: { temp: 20, humidity: 60 },
      weather: [{ description: 'sunny', icon: '01d' }],
    };
    mockUseStoreState.loading = true;
    render(<App />);
    expect(screen.queryByTestId('weather-data')).not.toBeInTheDocument();
  });

  it('renders ForecastSkeleton when loading is true', () => {
    mockUseStoreState.loading = true;
    render(<App />);
    expect(screen.getByTestId('forecast-skeleton')).toBeInTheDocument();
  });

  it('does not render ForecastSkeleton when loading is false', () => {
    mockUseStoreState.loading = false;
    render(<App />);
    expect(screen.queryByTestId('forecast-skeleton')).not.toBeInTheDocument();
  });

  it('renders Forecast component when forecastData is set and not loading', () => {
    mockUseStoreState.forecastData = [{}, {}, {}];
    mockUseStoreState.loading = false;
    render(<App />);
    expect(screen.getByTestId('forecast')).toBeInTheDocument();
  });

  it('does not render Forecast when forecastData is null', () => {
    mockUseStoreState.forecastData = null;
    render(<App />);
    expect(screen.queryByTestId('forecast')).not.toBeInTheDocument();
  });

  it('does not render Forecast when loading is true even if forecastData exists', () => {
    mockUseStoreState.forecastData = [{}, {}];
    mockUseStoreState.loading = true;
    render(<App />);
    expect(screen.queryByTestId('forecast')).not.toBeInTheDocument();
  });

  it('renders CityImage when cityImage is set with imageUrl and not loading', () => {
    mockUseStoreState.cityImage = { imageUrl: 'https://example.com/city.jpg', imageAlt: 'city' };
    mockUseStoreState.loading = false;
    render(<App />);
    expect(screen.getByTestId('city-image')).toBeInTheDocument();
  });

  it('does not render CityImage when loading is true', () => {
    mockUseStoreState.cityImage = { imageUrl: 'https://example.com/city.jpg', imageAlt: 'city' };
    mockUseStoreState.loading = true;
    render(<App />);
    expect(screen.queryByTestId('city-image')).not.toBeInTheDocument();
  });

  it('does not render CityImage when imageUrl is empty', () => {
    mockUseStoreState.cityImage = { imageUrl: '', imageAlt: 'city' };
    mockUseStoreState.loading = false;
    render(<App />);
    expect(screen.queryByTestId('city-image')).not.toBeInTheDocument();
  });
});

describe('App useEffect: city not found toast', () => {
  it('calls IziToast.error when cityFound is false', () => {
    mockUseStoreState.cityFound = false;
    render(<App />);
    expect(IziToast.error).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Ошибка' })
    );
  });

  it('does not call IziToast.error when cityFound is true', () => {
    mockUseStoreState.cityFound = true;
    render(<App />);
    expect(IziToast.error).not.toHaveBeenCalled();
  });
});

describe('App useEffect: foreCast trigger', () => {
  it('calls foreCast with city name when weatherData has a name', () => {
    mockUseStoreState.weatherData = {
      name: 'Tokyo',
      main: { temp: 25, humidity: 80 },
      weather: [{ description: 'sunny', icon: '01d' }],
    };
    render(<App />);
    expect(mockForeCast).toHaveBeenCalledWith('Tokyo');
  });

  it('does not call foreCast when weatherData is null', () => {
    mockUseStoreState.weatherData = null;
    render(<App />);
    expect(mockForeCast).not.toHaveBeenCalled();
  });

  it('does not call foreCast when weatherData has no name', () => {
    mockUseStoreState.weatherData = {
      name: '',
      main: { temp: 20, humidity: 60 },
      weather: [{ description: 'sunny', icon: '01d' }],
    };
    render(<App />);
    expect(mockForeCast).not.toHaveBeenCalled();
  });
});