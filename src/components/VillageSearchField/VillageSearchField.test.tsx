import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import VillageSearchField from './VillageSearchField'
import { useStore } from '../../hooks/useStore'

// Mock useStore
vi.mock('../../hooks/useStore')

describe('VillageSearchField', () => {
  const mockFetchWeather = vi.fn()
  const mockSetCity = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    vi.mocked(useStore).mockImplementation((selector: any) => {
      const state = {
        city: '',
        setCity: mockSetCity,
        fetchWeather: mockFetchWeather
      }
      return selector(state)
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should render input field', () => {
    render(<VillageSearchField />)
    expect(screen.getByPlaceholderText(/Введите название города/)).toBeInTheDocument()
  })

  it('should call setCity on input change', () => {
    render(<VillageSearchField />)
    
    const input = screen.getByPlaceholderText(/Введите название города/)
    fireEvent.change(input, { target: { value: 'Moscow' } })
    
    expect(mockSetCity).toHaveBeenCalledWith('Moscow')
  })

  it('should call fetchWeather after debounce period', () => {
    vi.mocked(useStore).mockImplementation((selector: any) => {
      const state = {
        city: 'Moscow',
        setCity: mockSetCity,
        fetchWeather: mockFetchWeather
      }
      return selector(state)
    })

    render(<VillageSearchField />)
    
    vi.advanceTimersByTime(800)
    
    expect(mockFetchWeather).toHaveBeenCalledWith('Moscow')
  })
})
