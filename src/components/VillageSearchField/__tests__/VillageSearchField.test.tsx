import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import VillageSearchField from '../VillageSearchField';

// Mock the useStore hook
const mockFetchWeather = vi.fn();

vi.mock('../../../hooks/useStore', () => ({
  useStore: () => ({
    fetchWeather: mockFetchWeather,
  }),
}));

describe('VillageSearchField', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
    mockFetchWeather.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the "Weather App" heading', () => {
    render(<VillageSearchField />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Weather App');
  });

  it('renders a text input with correct placeholder', () => {
    render(<VillageSearchField />);
    const input = screen.getByPlaceholderText('Введите название города или деревни');
    expect(input).toBeInTheDocument();
  });

  it('input has type="text"', () => {
    render(<VillageSearchField />);
    const input = screen.getByPlaceholderText('Введите название города или деревни');
    expect(input).toHaveAttribute('type', 'text');
  });

  it('loads saved village name from localStorage on mount', () => {
    localStorage.setItem('villageName', 'Moscow');
    render(<VillageSearchField />);
    const input = screen.getByPlaceholderText(
      'Введите название города или деревни',
    ) as HTMLInputElement;
    expect(input.value).toBe('Moscow');
  });

  it('starts empty when localStorage has no saved name', () => {
    render(<VillageSearchField />);
    const input = screen.getByPlaceholderText(
      'Введите название города или деревни',
    ) as HTMLInputElement;
    expect(input.value).toBe('');
  });

  it('updates input value when user types', () => {
    render(<VillageSearchField />);
    const input = screen.getByPlaceholderText(
      'Введите название города или деревни',
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Paris' } });
    expect(input.value).toBe('Paris');
  });

  it('calls fetchWeather after debounce delay (500ms)', async () => {
    render(<VillageSearchField />);
    const input = screen.getByPlaceholderText('Введите название города или деревни');

    fireEvent.change(input, { target: { value: 'Berlin' } });

    // Not yet called before 500ms
    expect(mockFetchWeather).not.toHaveBeenCalled();

    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    expect(mockFetchWeather).toHaveBeenCalledWith('Berlin');
  });

  it('does NOT call fetchWeather before the debounce delay elapses', () => {
    render(<VillageSearchField />);
    const input = screen.getByPlaceholderText('Введите название города или деревни');

    fireEvent.change(input, { target: { value: 'London' } });
    vi.advanceTimersByTime(499);

    expect(mockFetchWeather).not.toHaveBeenCalled();
  });

  it('cancels previous debounce timer when user continues typing', async () => {
    render(<VillageSearchField />);
    const input = screen.getByPlaceholderText('Введите название города или деревни');

    fireEvent.change(input, { target: { value: 'L' } });
    vi.advanceTimersByTime(300);

    fireEvent.change(input, { target: { value: 'London' } });
    vi.advanceTimersByTime(300);

    // Total 600ms but second timer not yet expired (only 300ms after second change)
    expect(mockFetchWeather).not.toHaveBeenCalled();

    await act(async () => {
      vi.advanceTimersByTime(200);
    });

    // Now 500ms after the second change - should be called once with final value
    expect(mockFetchWeather).toHaveBeenCalledTimes(1);
    expect(mockFetchWeather).toHaveBeenCalledWith('London');
  });

  it('saves the village name to localStorage after debounce', async () => {
    render(<VillageSearchField />);
    const input = screen.getByPlaceholderText('Введите название города или деревни');

    fireEvent.change(input, { target: { value: 'Tokyo' } });

    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    expect(localStorage.getItem('villageName')).toBe('Tokyo');
  });

  it('does not call fetchWeather when input is empty', async () => {
    render(<VillageSearchField />);
    const input = screen.getByPlaceholderText('Введите название города или деревни');

    // Change to empty (no-op by the guard in the effect)
    fireEvent.change(input, { target: { value: '' } });

    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    expect(mockFetchWeather).not.toHaveBeenCalled();
  });

  it('renders inside a <header> element', () => {
    const { container } = render(<VillageSearchField />);
    expect(container.querySelector('header')).toBeInTheDocument();
  });
});