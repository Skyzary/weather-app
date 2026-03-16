import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ForecastSkeleton from '../ForecastSkeleton';

describe('ForecastSkeleton', () => {
  it('renders the section heading', () => {
    render(<ForecastSkeleton />);
    expect(screen.getByText('Прогноз на 5 дней')).toBeInTheDocument();
  });

  it('renders exactly 5 skeleton cards', () => {
    const { container } = render(<ForecastSkeleton />);
    // Each skeleton card contains skeletonDate, skeletonIcon, skeletonTemp, skeletonDesc
    // We detect cards by skeletonDate presence (one per card)
    const skeletonCards = container.querySelectorAll('[class*="skeletonCard"]');
    expect(skeletonCards).toHaveLength(5);
  });

  it('each skeleton card contains 4 placeholder elements', () => {
    const { container } = render(<ForecastSkeleton />);
    const skeletonCards = container.querySelectorAll('[class*="skeletonCard"]');
    skeletonCards.forEach((card) => {
      expect(card.children).toHaveLength(4);
    });
  });

  it('renders inside a <section> element', () => {
    const { container } = render(<ForecastSkeleton />);
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('renders an h3 heading element', () => {
    render(<ForecastSkeleton />);
    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toBeInTheDocument();
  });

  it('renders skeleton container wrapper', () => {
    const { container } = render(<ForecastSkeleton />);
    const wrapper = container.querySelector('[class*="skeletonContainer"]');
    expect(wrapper).toBeInTheDocument();
  });
});