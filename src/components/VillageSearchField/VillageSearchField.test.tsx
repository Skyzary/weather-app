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

  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    vi.mocked(useStore).mockImplementation((selector: (state: Store) => unknown) => {
      const state = {
        city: '',
        setCity: mockSetCity,
        fetchWeather: mockFetchWeather,
      }
      return selector(state as unknown as Store)
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should render input field', () => {
    render(<VillageSearchField />)
    expect(screen.getByPlaceholderText(/enterCityName/)).toBeInTheDocument()
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
      }
      return selector(state as unknown as Store)
    })

    render(<VillageSearchField />)
    
    vi.advanceTimersByTime(800)
    
    expect(mockFetchWeather).toHaveBeenCalledWith('Kyiv')
  })
})
