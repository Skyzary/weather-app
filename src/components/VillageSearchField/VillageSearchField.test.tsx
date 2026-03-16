import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import VillageSearchField from './VillageSearchField';

const mockFetchWeather = vi.fn();

vi.mock('../../hooks/useStore.ts', () => ({
  useStore: () => ({
    fetchWeather: mockFetchWeather,
  }),
}));

vi.mock('react-icons/ci', () => ({
  CiSearch: () => <svg data-testid="search-icon" />,
}));

beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers();
  localStorage.clear();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('VillageSearchField rendering', () => {
  it('renders the "Weather App" title', () => {
    render(<VillageSearchField />);
    expect(screen.getByText('Weather App')).toBeInTheDocument();
  });

  it('renders a header element', () => {
    render(<VillageSearchField />);
    expect(document.querySelector('header')).toBeInTheDocument();
  });

  it('renders a text input with the correct placeholder', () => {
    render(<VillageSearchField />);
    expect(
      screen.getByPlaceholderText('Введите название города или деревни')
    ).toBeInTheDocument();
  });

  it('renders the search icon', () => {
    render(<VillageSearchField />);
    expect(screen.getByTestId('search-icon')).toBeInTheDocument();
  });

  it('renders an input of type text', () => {
    render(<VillageSearchField />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'text');
  });
});

describe('VillageSearchField localStorage restoration', () => {
  it('restores saved villageName from localStorage on mount', () => {
    localStorage.setItem('villageName', 'London');
    render(<VillageSearchField />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('London');
  });

  it('starts with empty input when localStorage has no saved city', () => {
    render(<VillageSearchField />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('');
  });
});

describe('VillageSearchField input change', () => {
  it('updates the input value when user types', () => {
    render(<VillageSearchField />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Paris' } });
    expect((input as HTMLInputElement).value).toBe('Paris');
  });

  it('can change input to a new value', () => {
    render(<VillageSearchField />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'London' } });
    expect((input as HTMLInputElement).value).toBe('London');
    fireEvent.change(input, { target: { value: 'Berlin' } });
    expect((input as HTMLInputElement).value).toBe('Berlin');
  });
});

describe('VillageSearchField debounced search', () => {
  it('does not call fetchWeather immediately on change', () => {
    render(<VillageSearchField />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Lon' } });
    expect(mockFetchWeather).not.toHaveBeenCalled();
  });

  it('calls fetchWeather after 500ms debounce', () => {
    render(<VillageSearchField />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'London' } });
    act(() => vi.advanceTimersByTime(500));
    expect(mockFetchWeather).toHaveBeenCalledWith('London');
  });

  it('debounces: only calls fetchWeather once for rapid changes', () => {
    render(<VillageSearchField />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'P' } });
    act(() => vi.advanceTimersByTime(100));
    fireEvent.change(input, { target: { value: 'Pa' } });
    act(() => vi.advanceTimersByTime(100));
    fireEvent.change(input, { target: { value: 'Par' } });
    act(() => vi.advanceTimersByTime(100));
    fireEvent.change(input, { target: { value: 'Pari' } });
    act(() => vi.advanceTimersByTime(100));
    fireEvent.change(input, { target: { value: 'Paris' } });
    act(() => vi.advanceTimersByTime(500));
    expect(mockFetchWeather).toHaveBeenCalledTimes(1);
    expect(mockFetchWeather).toHaveBeenCalledWith('Paris');
  });

  it('saves villageName to localStorage after debounce', () => {
    render(<VillageSearchField />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Berlin' } });
    act(() => vi.advanceTimersByTime(500));
    expect(localStorage.getItem('villageName')).toBe('Berlin');
  });

  it('does not call fetchWeather when input is empty (no value on mount)', () => {
    render(<VillageSearchField />);
    act(() => vi.advanceTimersByTime(600));
    expect(mockFetchWeather).not.toHaveBeenCalled();
  });

  it('does not call fetchWeather before 500ms has elapsed', () => {
    render(<VillageSearchField />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Tokyo' } });
    act(() => vi.advanceTimersByTime(499));
    expect(mockFetchWeather).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(1));
    expect(mockFetchWeather).toHaveBeenCalledWith('Tokyo');
  });

  // Regression: if a city was saved and component mounts, it should trigger fetchWeather after debounce
  it('triggers fetchWeather for the restored village name after debounce', () => {
    localStorage.setItem('villageName', 'Tokyo');
    render(<VillageSearchField />);
    act(() => vi.advanceTimersByTime(500));
    expect(mockFetchWeather).toHaveBeenCalledWith('Tokyo');
  });
});