import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import CityImage from './CityImage';

// Mock @codaworks/react-glow to avoid issues with the library in jsdom
vi.mock('@codaworks/react-glow', () => ({
  Glow: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  GlowCapture: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('CityImage', () => {
  it('renders an img element with the correct src', () => {
    render(<CityImage imageUrl="https://example.com/london.jpg" imageAlt="London" />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'https://example.com/london.jpg');
  });

  it('renders an img element with the correct alt text', () => {
    render(<CityImage imageUrl="https://example.com/london.jpg" imageAlt="London cityscape" />);
    const img = screen.getByAltText('London cityscape');
    expect(img).toBeInTheDocument();
  });

  it('returns null when imageUrl is an empty string', () => {
    const { container } = render(<CityImage imageUrl="" imageAlt="London" />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the card wrapper div', () => {
    const { container } = render(
      <CityImage imageUrl="https://example.com/city.jpg" imageAlt="City" />
    );
    expect(container.firstChild).not.toBeNull();
  });

  it('renders the image inside a container', () => {
    render(<CityImage imageUrl="https://example.com/city.jpg" imageAlt="City view" />);
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img.tagName).toBe('IMG');
  });

  it('uses the imageAlt prop as alt attribute correctly', () => {
    const altText = 'A beautiful panoramic view of Paris';
    render(<CityImage imageUrl="https://example.com/paris.jpg" imageAlt={altText} />);
    expect(screen.getByAltText(altText)).toBeInTheDocument();
  });

  // Edge case: imageUrl with spaces or special characters should still render
  it('renders when imageUrl contains query parameters', () => {
    const url = 'https://example.com/image.jpg?w=800&q=80';
    render(<CityImage imageUrl={url} imageAlt="City" />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', url);
  });

  // Regression: component should not render img if imageUrl is falsy
  it('does not render img when imageUrl is empty (regression)', () => {
    render(<CityImage imageUrl="" imageAlt="test" />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});