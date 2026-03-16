import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import axios from 'axios';
import { useStore } from '../useStore';

vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

// Reset store state between tests by clearing the persisted storage key
beforeEach(() => {
  localStorage.clear();
  // Reset zustand store by re-initialising via setCity
  act(() => {
    useStore.setState({
      city: '',
      weatherData: null,
      forecastData: null,
      loading: false,
      cityFound: true,
      cityImage: undefined,
    });
  });
  vi.clearAllMocks();
});

describe('useStore – initial state', () => {
  it('starts with empty city', () => {
    const { result } = renderHook(() => useStore());
    expect(result.current.city).toBe('');
  });

  it('starts with null weatherData', () => {
    const { result } = renderHook(() => useStore());
    expect(result.current.weatherData).toBeNull();
  });

  it('starts with null forecastData', () => {
    const { result } = renderHook(() => useStore());
    expect(result.current.forecastData).toBeNull();
  });

  it('starts with loading=false', () => {
    const { result } = renderHook(() => useStore());
    expect(result.current.loading).toBe(false);
  });

  it('starts with cityFound=true', () => {
    const { result } = renderHook(() => useStore());
    expect(result.current.cityFound).toBe(true);
  });
});

describe('useStore – setCity', () => {
  it('updates the city field', () => {
    const { result } = renderHook(() => useStore());
    act(() => {
      result.current.setCity('Berlin');
    });
    expect(result.current.city).toBe('Berlin');
  });
});

describe('useStore – fetchWeather', () => {
  it('does nothing when city string is empty', async () => {
    const { result } = renderHook(() => useStore());
    await act(async () => {
      await result.current.fetchWeather('');
    });
    expect(mockedAxios.get).not.toHaveBeenCalled();
    expect(result.current.loading).toBe(false);
  });

  it('sets cityFound=false when geo API returns empty array', async () => {
    mockedAxios.get = vi.fn().mockResolvedValueOnce({ data: [] });

    const { result } = renderHook(() => useStore());
    await act(async () => {
      await result.current.fetchWeather('UnknownCity');
    });

    expect(result.current.cityFound).toBe(false);
    expect(result.current.weatherData).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('sets weatherData on successful fetch', async () => {
    const geoResponse = {
      data: [{ lat: 55.75, lon: 37.61, name: 'Moscow', localNames: { ru: 'Москва' } }],
    };
    const weatherResponse = {
      data: {
        name: 'Moscow',
        main: { temp: 10, humidity: 60 },
        weather: [{ description: 'ясно', icon: '01d' }],
        wind: { speed: 3 },
      },
    };
    // fetchImage will be called too – give it a safe mock
    mockedAxios.get = vi
      .fn()
      .mockResolvedValueOnce(geoResponse)
      .mockResolvedValueOnce(weatherResponse)
      .mockResolvedValueOnce({ data: { results: [] } }); // fetchImage

    const { result } = renderHook(() => useStore());
    await act(async () => {
      await result.current.fetchWeather('Moscow');
    });

    expect(result.current.cityFound).toBe(true);
    expect(result.current.weatherData).toMatchObject({
      main: { temp: 10 },
    });
    expect(result.current.loading).toBe(false);
  });

  it('sets cityFound=false on network error', async () => {
    mockedAxios.get = vi.fn().mockRejectedValueOnce(new Error('Network Error'));

    const { result } = renderHook(() => useStore());
    await act(async () => {
      await result.current.fetchWeather('AnyCity');
    });

    expect(result.current.cityFound).toBe(false);
    expect(result.current.weatherData).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('sets loading=true then loading=false after fetch', async () => {
    let resolveFn!: (v: unknown) => void;
    const pending = new Promise((res) => { resolveFn = res; });
    mockedAxios.get = vi.fn().mockReturnValueOnce(pending);

    const { result } = renderHook(() => useStore());
    let fetchPromise: Promise<void>;
    act(() => {
      fetchPromise = result.current.fetchWeather('Paris');
    });

    expect(result.current.loading).toBe(true);

    await act(async () => {
      resolveFn({ data: [] }); // empty geo → cityFound=false path
      await fetchPromise;
    });

    expect(result.current.loading).toBe(false);
  });
});

describe('useStore – foreCast', () => {
  it('does nothing when city string is empty', async () => {
    const { result } = renderHook(() => useStore());
    await act(async () => {
      await result.current.foreCast('');
    });
    expect(mockedAxios.get).not.toHaveBeenCalled();
  });

  it('filters forecast list to only 12:00:00 entries', async () => {
    const list = [
      { dt: 1, main: { temp: 5, feels_like: 3, temp_min: 1, temp_max: 7, pressure: 1000, humidity: 70 }, weather: [{ id: 800, main: 'Clear', description: 'clear', icon: '01d' }], dt_txt: '2024-01-15 09:00:00', wind: { speed: 2, deg: 0, gust: 3 } },
      { dt: 2, main: { temp: 8, feels_like: 6, temp_min: 2, temp_max: 10, pressure: 1000, humidity: 65 }, weather: [{ id: 800, main: 'Clear', description: 'clear', icon: '01d' }], dt_txt: '2024-01-15 12:00:00', wind: { speed: 2, deg: 0, gust: 3 } },
      { dt: 3, main: { temp: 6, feels_like: 4, temp_min: 1, temp_max: 8, pressure: 1000, humidity: 68 }, weather: [{ id: 800, main: 'Clear', description: 'clear', icon: '01d' }], dt_txt: '2024-01-15 15:00:00', wind: { speed: 2, deg: 0, gust: 3 } },
      { dt: 4, main: { temp: 9, feels_like: 7, temp_min: 3, temp_max: 11, pressure: 1000, humidity: 62 }, weather: [{ id: 800, main: 'Clear', description: 'clear', icon: '01d' }], dt_txt: '2024-01-16 12:00:00', wind: { speed: 2, deg: 0, gust: 3 } },
    ];
    mockedAxios.get = vi.fn().mockResolvedValueOnce({ data: { list } });

    const { result } = renderHook(() => useStore());
    await act(async () => {
      await result.current.foreCast('Moscow');
    });

    // Only the two entries with 12:00:00 should be kept
    expect(result.current.forecastData).toHaveLength(2);
    expect(result.current.forecastData![0].dt).toBe(2);
    expect(result.current.forecastData![1].dt).toBe(4);
  });

  it('sets loading=false after forecast fetch error', async () => {
    mockedAxios.get = vi.fn().mockRejectedValueOnce(new Error('Network Error'));

    const { result } = renderHook(() => useStore());
    await act(async () => {
      await result.current.foreCast('Moscow');
    });

    expect(result.current.loading).toBe(false);
  });
});

describe('useStore – fetchImage', () => {
  it('does nothing when city string is empty', async () => {
    const { result } = renderHook(() => useStore());
    await act(async () => {
      await result.current.fetchImage('');
    });
    expect(mockedAxios.get).not.toHaveBeenCalled();
  });

  it('sets cityImage when Unsplash returns a result', async () => {
    mockedAxios.get = vi.fn().mockResolvedValueOnce({
      data: {
        results: [
          { urls: { regular: 'https://example.com/paris.jpg' }, alt_description: 'Paris skyline' },
        ],
      },
    });

    const { result } = renderHook(() => useStore());
    await act(async () => {
      await result.current.fetchImage('Paris');
    });

    expect(result.current.cityImage).toEqual({
      imageUrl: 'https://example.com/paris.jpg',
      imageAlt: 'Paris skyline',
    });
  });

  it('sets imageUrl to empty string and alt to city name when results array is empty', async () => {
    mockedAxios.get = vi.fn().mockResolvedValueOnce({ data: { results: [] } });

    const { result } = renderHook(() => useStore());
    await act(async () => {
      await result.current.fetchImage('SmallTown');
    });

    expect(result.current.cityImage).toEqual({ imageUrl: '', imageAlt: 'SmallTown' });
  });

  it('sets cityImage to undefined on API error', async () => {
    mockedAxios.get = vi.fn().mockRejectedValueOnce(new Error('Unsplash error'));

    const { result } = renderHook(() => useStore());
    await act(async () => {
      await result.current.fetchImage('ErrorCity');
    });

    expect(result.current.cityImage).toBeUndefined();
  });
});