import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import VillageSearchField from './VillageSearchField'
import { useStore } from '../../hooks/useStore'
import type { Store } from '../../hooks/useStore'

// Mock useStore
vi.mock('../../hooks/useStore')

describe('VillageSearchField', () => {
  const mockFetchWeather = vi.fn()
  const mockSetCity = vi.fn()
  const mockSetSuggestions = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    vi.mocked(useStore).mockImplementation((selector: (state: Store) => unknown) => {
      const state = {
        city: '',
        setCity: mockSetCity,
        fetchWeather: mockFetchWeather,
        suggestions: [],
        setSuggestions: mockSetSuggestions
      }
      return selector(state as unknown as Store)
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should render input field and popular cities', () => {
    render(<VillageSearchField />)
    expect(screen.getByPlaceholderText(/enterCityName/)).toBeInTheDocument()
    expect(screen.getByText('Kyiv')).toBeInTheDocument()
    expect(screen.getByText('London')).toBeInTheDocument()
  })

  it('should call setCity on input change', () => {
    render(<VillageSearchField />)
    
    const input = screen.getByPlaceholderText(/enterCityName/)
    fireEvent.change(input, { target: { value: 'Kyiv' } })
    
    expect(mockSetCity).toHaveBeenCalledWith('Kyiv')
  })

  it('should call fetchWeather after debounce period when typing', async () => {
    vi.mocked(useStore).mockImplementation((selector: (state: Store) => unknown) => {
      const state = {
        city: 'Kyiv',
        setCity: mockSetCity,
        fetchWeather: mockFetchWeather,
        suggestions: [],
        setSuggestions: mockSetSuggestions
      }
      return selector(state as unknown as Store)
    })

    render(<VillageSearchField />)
    
    vi.advanceTimersByTime(800)
    
    expect(mockFetchWeather).toHaveBeenCalledWith('Kyiv')
  })

  it('should call fetchWeather when a popular city is clicked', () => {
    render(<VillageSearchField />)
    
    const kyivButton = screen.getByText('Kyiv')
    fireEvent.click(kyivButton)
    
    expect(mockSetCity).toHaveBeenCalledWith('Kyiv')
    expect(mockSetSuggestions).toHaveBeenCalledWith([])
    expect(mockFetchWeather).toHaveBeenCalledWith('Kyiv')
  })

  it('should handle keyboard navigation and selection', () => {
    const mockSuggestions = [
      { name: 'Kyiv', lat: 50.45, lon: 30.52, country: 'UA' },
      { name: 'London', lat: 51.5, lon: -0.12, country: 'GB' }
    ]

    vi.mocked(useStore).mockImplementation((selector: (state: Store) => unknown) => {
      const state = {
        city: 'Ky',
        setCity: mockSetCity,
        fetchWeather: mockFetchWeather,
        suggestions: mockSuggestions,
        setSuggestions: mockSetSuggestions
      }
      return selector(state as unknown as Store)
    })

    render(<VillageSearchField />)
    const input = screen.getByPlaceholderText(/enterCityName/)
    
    // Focus to make suggestions visible
    fireEvent.focus(input)
    
    // Arrow down to first item
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    // Arrow down to second item
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    // Enter to select second item (London)
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(mockSetCity).toHaveBeenCalledWith('London')
    expect(mockFetchWeather).toHaveBeenCalledWith(mockSuggestions[1])
  })
})
