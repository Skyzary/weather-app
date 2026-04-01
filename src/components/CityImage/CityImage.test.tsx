import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
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

  it('should return null if imageUrl is missing', () => {
    const { container } = render(<CityImage imageUrl="" imageAlt="Test" />)
    expect(container.firstChild).toBeNull()
  })
})
