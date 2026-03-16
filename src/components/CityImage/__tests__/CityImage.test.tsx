import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import CityImage from '../CityImage';

// @codaworks/react-glow uses DOM APIs not available in jsdom
vi.mock('@codaworks/react-glow', () => ({
  Glow: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  GlowCapture: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('CityImage', () => {
  it('renders null when imageUrl is empty string', () => {
    const { container } = render(<CityImage imageUrl="" imageAlt="test" />);
    expect(container.firstChild).toBeNull();
  });

  it('renders an img element when imageUrl is provided', () => {
    render(<CityImage imageUrl="https://example.com/city.jpg" imageAlt="Paris" />);
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
  });

  it('sets the correct src on the img element', () => {
    const url = 'https://example.com/city.jpg';
    render(<CityImage imageUrl={url} imageAlt="Paris" />);
    expect(screen.getByRole('img')).toHaveAttribute('src', url);
  });

  it('sets the correct alt text on the img element', () => {
    render(<CityImage imageUrl="https://example.com/city.jpg" imageAlt="A view of Paris" />);
    expect(screen.getByRole('img')).toHaveAttribute('alt', 'A view of Paris');
  });

  it('renders a wrapper div when imageUrl is provided', () => {
    const { container } = render(
      <CityImage imageUrl="https://example.com/city.jpg" imageAlt="Paris" />,
    );
    expect(container.firstChild).not.toBeNull();
  });

  it('does not render an img when imageUrl is an empty string (guard boundary)', () => {
    const { container } = render(<CityImage imageUrl="" imageAlt="some alt" />);
    const img = container.querySelector('img');
    expect(img).toBeNull();
  });
});