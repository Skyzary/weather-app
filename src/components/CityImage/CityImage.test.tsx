import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import CityImage from './CityImage'

describe('CityImage', () => {
  it('should render image with correct src and alt', () => {
    const props = {
      imageUrl: 'https://example.com/image.jpg',
      imageAlt: 'Test City'
    }

    render(<CityImage {...props} />)

    const imgs = screen.getAllByRole('img')
    expect(imgs.length).toBeGreaterThan(0)
    expect(imgs[0]).toHaveAttribute('src', props.imageUrl)
    expect(imgs[0]).toHaveAttribute('alt', props.imageAlt)
  })

  it('should render fallback image if imageUrl is missing', () => {
    render(<CityImage imageUrl="" imageAlt="Test" />)
    const imgs = screen.getAllByRole('img')
    expect(imgs.length).toBeGreaterThan(0)
    expect(imgs[0]).toHaveAttribute('src', '/bg.avif')
    expect(imgs[0]).toHaveAttribute('alt', 'Test')
  })

  it('should switch to fallback image on error', () => {
    const props = {
      imageUrl: 'https://example.com/bad-image.jpg',
      imageAlt: 'Test City'
    }

    render(<CityImage {...props} />)
    const imgs = screen.getAllByRole('img')
    const img = imgs[0]
    
    expect(img).toHaveAttribute('src', props.imageUrl)

    // Simulate image error
    fireEvent.error(img)

    expect(img).toHaveAttribute('src', '/bg.avif')
  })
})
