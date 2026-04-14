import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { imageService } from './imageService'

vi.mock('axios')

describe('imageService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubEnv('VITE_UNSPLASH_ACCESS_KEY', 'test-unsplash-key')
  })

  it('should return optimized image URL and alt text for a valid city', async () => {
    const mockResponse = {
      data: {
        results: [{
          urls: { raw: 'https://images.unsplash.com/photo-123' },
          alt_description: 'Beautiful London'
        }]
      }
    }
    vi.mocked(axios.get).mockResolvedValue(mockResponse)

    const result = await imageService.getCityImage('London')

    expect(result).toBeDefined()
    if (result) {
      expect(result.imageUrl).toContain('fm=avif')
      expect(result.imageUrl).toContain('w=1200')
      expect(result.imageAlt).toBe('Beautiful London')
    }
    expect(axios.get).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
      params: expect.objectContaining({ query: 'London' })
    }))
  })

  it('should return undefined if no results found', async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: { results: [] } })

    const result = await imageService.getCityImage('UnknownPlace')

    expect(result).toBeUndefined()
  })

  it('should throw auth error from Unsplash on 401', async () => {
    vi.mocked(axios.isAxiosError).mockReturnValue(true)
    vi.mocked(axios.get).mockRejectedValue({
      response: { status: 401 },
      message: 'Unauthorized'
    })

    await expect(imageService.getCityImage('London')).rejects.toThrow('authErrorUnsplash')
  })

  it('should return undefined if city is empty', async () => {
    const result = await imageService.getCityImage('')
    expect(result).toBeUndefined()
    expect(axios.get).not.toHaveBeenCalled()
  })

  it('should throw auth error if API key is invalid', async () => {
    vi.mocked(axios.isAxiosError).mockReturnValue(true)
    vi.mocked(axios.get).mockRejectedValue({
      response: { status: 401 },
      message: 'Unauthorized'
    })
    await expect(imageService.getCityImage('London')).rejects.toThrow('authErrorUnsplash')
  })
})
