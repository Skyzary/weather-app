import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ForecastSkeleton from './ForecastSkeleton';

describe('ForecastSkeleton', () => {
  it('renders the forecast section', () => {
    render(<ForecastSkeleton />);
    expect(document.querySelector('section')).toBeInTheDocument();
  });

  it('renders the title "Прогноз на 5 дней"', () => {
    render(<ForecastSkeleton />);
    expect(screen.getByText('Прогноз на 5 дней')).toBeInTheDocument();
  });

  it('renders exactly 5 skeleton cards', () => {
    const { container } = render(<ForecastSkeleton />);
    // Each skeleton card contains skeletonDate, skeletonIcon, skeletonTemp, skeletonDesc children
    const skeletonCards = container.querySelectorAll('[class*="skeletonCard"]');
    expect(skeletonCards).toHaveLength(5);
  });

  it('renders exactly 5 skeleton date elements', () => {
    const { container } = render(<ForecastSkeleton />);
    const skeletonDates = container.querySelectorAll('[class*="skeletonDate"]');
    expect(skeletonDates).toHaveLength(5);
  });

  it('renders exactly 5 skeleton icon elements', () => {
    const { container } = render(<ForecastSkeleton />);
    const skeletonIcons = container.querySelectorAll('[class*="skeletonIcon"]');
    expect(skeletonIcons).toHaveLength(5);
  });

  it('renders exactly 5 skeleton temperature elements', () => {
    const { container } = render(<ForecastSkeleton />);
    const skeletonTemps = container.querySelectorAll('[class*="skeletonTemp"]');
    expect(skeletonTemps).toHaveLength(5);
  });

  it('renders exactly 5 skeleton description elements', () => {
    const { container } = render(<ForecastSkeleton />);
    const skeletonDescs = container.querySelectorAll('[class*="skeletonDesc"]');
    expect(skeletonDescs).toHaveLength(5);
  });

  it('renders a skeleton container div', () => {
    const { container } = render(<ForecastSkeleton />);
    expect(container.querySelector('[class*="skeletonContainer"]')).toBeInTheDocument();
  });

  it('renders without any actual weather data (no temperature text)', () => {
    render(<ForecastSkeleton />);
    expect(screen.queryByText(/°C/)).not.toBeInTheDocument();
  });

  // Regression: should always show 5 cards, not more or fewer
  it('always renders exactly 5 placeholder cards regardless of re-renders', () => {
    const { container, rerender } = render(<ForecastSkeleton />);
    const countFirstRender = container.querySelectorAll('[class*="skeletonCard"]').length;
    rerender(<ForecastSkeleton />);
    const countSecondRender = container.querySelectorAll('[class*="skeletonCard"]').length;
    expect(countFirstRender).toBe(5);
    expect(countSecondRender).toBe(5);
  });
});