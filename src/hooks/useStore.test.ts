import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { useStore } from './useStore';

const mock = new MockAdapter(axios);

// Suppress console.error noise in tests
beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
  mock.reset();
  // Reset the store to initial state between tests
  useStore.setState({
    city: '',
    weatherData: null,
    forecastData: null,
    loading: false,
    cityFound: true,
    cityImage: undefined,
  });
  localStorage.clear();
});

const mockGeoResponse = [
  {
    name: 'London',
    lat: 51.5074,
    lon: -0.1278,
    localNames: { ru: 'Лондон' },
  },
];

const mockWeatherResponse = {
  name: 'London',
  main: { temp: 15, humidity: 70, feels_like: 14, pressure: 1013 },
  weather: [{ description: 'облачно', icon: '04d' }],
  wind: { speed: 5, deg: 270 },
};

const mockForecastResponse = {
  list: [
    {
      dt: 1700000000,
      main: { temp: 14, feels_like: 13, temp_min: 12, temp_max: 16, pressure: 1015, humidity: 65 },
      weather: [{ id: 800, main: 'Clear', description: 'ясно', icon: '01d' }],
      dt_txt: '2023-11-14 12:00:00',
      wind: { speed: 4, deg: 200, gust: 6 },
    },
    {
      dt: 1700086400,
      main: { temp: 12, feels_like: 11, temp_min: 10, temp_max: 14, pressure: 1016, humidity: 70 },
      weather: [{ id: 801, main: 'Clouds', description: 'небольшая облачность', icon: '02d' }],
      dt_txt: '2023-11-15 12:00:00',
      wind: { speed: 5, deg: 210, gust: 7 },
    },
    // Entry without 12:00:00 - should be filtered out
    {
      dt: 1700050000,
      main: { temp: 10, feels_like: 9, temp_min: 8, temp_max: 12, pressure: 1014, humidity: 72 },
      weather: [{ id: 800, main: 'Clear', description: 'ясно', icon: '01n' }],
      dt_txt: '2023-11-14 06:00:00',
      wind: { speed: 3, deg: 180, gust: 5 },
    },
  ],
  city: { name: 'London', coord: { lat: 51.5, lon: -0.1 }, country: 'GB' },
};

const mockUnsplashResponse = {
  results: [
    { urls: { regular: 'https://example.com/london.jpg' }, alt_description: 'London cityscape' },
  ],
};

describe('useStore initial state', () => {
  it('has empty city initially', () => {
    expect(useStore.getState().city).toBe('');
  });

  it('has null weatherData initially', () => {
    expect(useStore.getState().weatherData).toBeNull();
  });

  it('has null forecastData initially', () => {
    expect(useStore.getState().forecastData).toBeNull();
  });

  it('has loading false initially', () => {
    expect(useStore.getState().loading).toBe(false);
  });

  it('has cityFound true initially', () => {
    expect(useStore.getState().cityFound).toBe(true);
  });
});

describe('useStore setCity', () => {
  it('updates the city in the store', () => {
    useStore.getState().setCity('Paris');
    expect(useStore.getState().city).toBe('Paris');
  });

  it('can set city to empty string', () => {
    useStore.getState().setCity('Paris');
    useStore.getState().setCity('');
    expect(useStore.getState().city).toBe('');
  });
});

describe('useStore fetchWeather', () => {
  it('does nothing when city is empty string', async () => {
    await useStore.getState().fetchWeather('');
    expect(useStore.getState().weatherData).toBeNull();
    expect(useStore.getState().loading).toBe(false);
  });

  it('sets weatherData on successful fetch', async () => {
    mock.onGet('https://api.openweathermap.org/geo/1.0/direct').reply(200, mockGeoResponse);
    mock.onGet('https://api.openweathermap.org/data/2.5/weather').reply(200, mockWeatherResponse);
    mock.onGet('https://api.unsplash.com/search/photos').reply(200, mockUnsplashResponse);

    await useStore.getState().fetchWeather('London');

    expect(useStore.getState().weatherData).toEqual(mockWeatherResponse);
    expect(useStore.getState().cityFound).toBe(true);
    expect(useStore.getState().loading).toBe(false);
  });

  it('sets the Russian city name from localNames.ru', async () => {
    mock.onGet('https://api.openweathermap.org/geo/1.0/direct').reply(200, mockGeoResponse);
    mock.onGet('https://api.openweathermap.org/data/2.5/weather').reply(200, mockWeatherResponse);
    mock.onGet('https://api.unsplash.com/search/photos').reply(200, mockUnsplashResponse);

    await useStore.getState().fetchWeather('London');
    expect(useStore.getState().city).toBe('Лондон');
  });

  it('falls back to geo name when localNames.ru is absent', async () => {
    const geoNoRu = [{ name: 'Berlin', lat: 52.52, lon: 13.4, localNames: {} }];
    mock.onGet('https://api.openweathermap.org/geo/1.0/direct').reply(200, geoNoRu);
    mock.onGet('https://api.openweathermap.org/data/2.5/weather').reply(200, mockWeatherResponse);
    mock.onGet('https://api.unsplash.com/search/photos').reply(200, mockUnsplashResponse);

    await useStore.getState().fetchWeather('Berlin');
    expect(useStore.getState().city).toBe('Berlin');
  });

  it('sets cityFound to false when geo returns empty array', async () => {
    mock.onGet('https://api.openweathermap.org/geo/1.0/direct').reply(200, []);

    await useStore.getState().fetchWeather('NonExistentCity12345');

    expect(useStore.getState().cityFound).toBe(false);
    expect(useStore.getState().weatherData).toBeNull();
    expect(useStore.getState().loading).toBe(false);
  });

  it('sets cityFound to false and clears data on network error', async () => {
    mock.onGet('https://api.openweathermap.org/geo/1.0/direct').networkError();

    await useStore.getState().fetchWeather('London');

    expect(useStore.getState().cityFound).toBe(false);
    expect(useStore.getState().weatherData).toBeNull();
    expect(useStore.getState().loading).toBe(false);
  });

  it('sets loading to true during fetch and false after', async () => {
    let loadingDuringFetch = false;
    mock.onGet('https://api.openweathermap.org/geo/1.0/direct').reply(() => {
      loadingDuringFetch = useStore.getState().loading;
      return [200, mockGeoResponse];
    });
    mock.onGet('https://api.openweathermap.org/data/2.5/weather').reply(200, mockWeatherResponse);
    mock.onGet('https://api.unsplash.com/search/photos').reply(200, mockUnsplashResponse);

    await useStore.getState().fetchWeather('London');

    expect(loadingDuringFetch).toBe(true);
    expect(useStore.getState().loading).toBe(false);
  });
});

describe('useStore fetchImage', () => {
  it('sets cityImage with url and alt from Unsplash on success', async () => {
    mock.onGet('https://api.unsplash.com/search/photos').reply(200, mockUnsplashResponse);

    await useStore.getState().fetchImage('London');

    expect(useStore.getState().cityImage).toEqual({
      imageUrl: 'https://example.com/london.jpg',
      imageAlt: 'London cityscape',
    });
  });

  it('does nothing when city is empty string', async () => {
    await useStore.getState().fetchImage('');
    expect(useStore.getState().cityImage).toBeUndefined();
  });

  it('sets cityImage to undefined on fetch error', async () => {
    mock.onGet('https://api.unsplash.com/search/photos').networkError();
    useStore.setState({ cityImage: { imageUrl: 'old-url', imageAlt: 'old-alt' } });

    await useStore.getState().fetchImage('London');
    expect(useStore.getState().cityImage).toBeUndefined();
  });

  it('sets imageUrl to empty string when results array is empty', async () => {
    mock.onGet('https://api.unsplash.com/search/photos').reply(200, { results: [] });

    await useStore.getState().fetchImage('UnknownCity');
    expect(useStore.getState().cityImage).toEqual({ imageUrl: '', imageAlt: 'UnknownCity' });
  });
});

describe('useStore foreCast', () => {
  it('does nothing when city is empty string', async () => {
    await useStore.getState().foreCast('');
    expect(useStore.getState().forecastData).toBeNull();
  });

  it('sets forecastData with only 12:00:00 readings', async () => {
    mock.onGet('https://api.openweathermap.org/data/2.5/forecast').reply(200, mockForecastResponse);

    await useStore.getState().foreCast('London');

    const forecastData = useStore.getState().forecastData;
    expect(forecastData).not.toBeNull();
    expect(forecastData!.length).toBe(2);
    expect(forecastData!.every((item) => item.dt_txt.includes('12:00:00'))).toBe(true);
  });

  it('sets loading to false after forecast fetch', async () => {
    mock.onGet('https://api.openweathermap.org/data/2.5/forecast').reply(200, mockForecastResponse);

    await useStore.getState().foreCast('London');
    expect(useStore.getState().loading).toBe(false);
  });

  it('sets loading to false on error and does not throw', async () => {
    mock.onGet('https://api.openweathermap.org/data/2.5/forecast').networkError();

    await useStore.getState().foreCast('London');
    expect(useStore.getState().loading).toBe(false);
  });

  it('filters out non-noon readings, keeping only noon entries', async () => {
    const responseWith3Entries = {
      list: [
        { dt: 1, main: { temp: 10, feels_like: 9, temp_min: 8, temp_max: 12, pressure: 1010, humidity: 60 }, weather: [{ id: 800, main: 'Clear', description: 'ясно', icon: '01d' }], dt_txt: '2023-11-14 00:00:00', wind: { speed: 3, deg: 0, gust: 4 } },
        { dt: 2, main: { temp: 15, feels_like: 14, temp_min: 13, temp_max: 17, pressure: 1012, humidity: 55 }, weather: [{ id: 800, main: 'Clear', description: 'ясно', icon: '01d' }], dt_txt: '2023-11-14 12:00:00', wind: { speed: 5, deg: 180, gust: 7 } },
        { dt: 3, main: { temp: 13, feels_like: 12, temp_min: 11, temp_max: 15, pressure: 1011, humidity: 58 }, weather: [{ id: 800, main: 'Clear', description: 'ясно', icon: '01d' }], dt_txt: '2023-11-14 18:00:00', wind: { speed: 4, deg: 90, gust: 6 } },
      ],
      city: { name: 'London', coord: { lat: 51.5, lon: -0.1 }, country: 'GB' },
    };
    mock.onGet('https://api.openweathermap.org/data/2.5/forecast').reply(200, responseWith3Entries);

    await useStore.getState().foreCast('London');
    expect(useStore.getState().forecastData).toHaveLength(1);
    expect(useStore.getState().forecastData![0].dt_txt).toBe('2023-11-14 12:00:00');
  });
});