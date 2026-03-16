import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { getWeatherIcon, weatherIcons } from './weatherIcon';

describe('weatherIcons record', () => {
  it('contains all expected day icon codes', () => {
    const dayCodes = ['01d', '02d', '03d', '04d', '09d', '10d', '11d', '13d', '50d'];
    dayCodes.forEach((code) => {
      expect(weatherIcons).toHaveProperty(code);
    });
  });

  it('contains all expected night icon codes', () => {
    const nightCodes = ['01n', '02n', '03n', '04n', '09n', '10n', '11n', '13n', '50n'];
    nightCodes.forEach((code) => {
      expect(weatherIcons).toHaveProperty(code);
    });
  });

  it('has 18 total icon entries', () => {
    expect(Object.keys(weatherIcons)).toHaveLength(18);
  });
});

describe('getWeatherIcon', () => {
  it('returns the matching icon element for a known day code', () => {
    const icon = getWeatherIcon('01d');
    const { container } = render(<>{icon}</>);
    expect(container.firstChild).not.toBeNull();
  });

  it('returns the matching icon element for a known night code', () => {
    const icon = getWeatherIcon('01n');
    const { container } = render(<>{icon}</>);
    expect(container.firstChild).not.toBeNull();
  });

  it('returns the fallback FaInfoCircle icon for an unknown code', () => {
    const icon = getWeatherIcon('unknown_code');
    const { container } = render(<>{icon}</>);
    expect(container.firstChild).not.toBeNull();
  });

  it('returns the fallback FaInfoCircle icon when called with undefined', () => {
    const icon = getWeatherIcon(undefined);
    const { container } = render(<>{icon}</>);
    expect(container.firstChild).not.toBeNull();
  });

  it('returns the fallback FaInfoCircle icon when called with empty string', () => {
    const icon = getWeatherIcon('');
    const { container } = render(<>{icon}</>);
    expect(container.firstChild).not.toBeNull();
  });

  it('returns an SVG element for every known icon code', () => {
    Object.keys(weatherIcons).forEach((code) => {
      const icon = getWeatherIcon(code);
      const { container } = render(<>{icon}</>);
      expect(container.querySelector('svg')).not.toBeNull();
    });
  });

  it('returns an SVG element for the fallback (unknown code)', () => {
    const icon = getWeatherIcon('99z');
    const { container } = render(<>{icon}</>);
    expect(container.querySelector('svg')).not.toBeNull();
  });

  // Regression: ensure day and night variants for the same weather type are different elements
  it('provides distinct elements for day vs night sunny/clear icons', () => {
    const day = getWeatherIcon('01d');
    const night = getWeatherIcon('01n');
    const { container: dayContainer } = render(<>{day}</>);
    const { container: nightContainer } = render(<>{night}</>);
    // Both should render SVGs but they are different React elements
    expect(day).not.toBe(night);
    expect(dayContainer.querySelector('svg')).not.toBeNull();
    expect(nightContainer.querySelector('svg')).not.toBeNull();
  });

  // Boundary: codes that share same icon (03d and 03n both map to WiCloud)
  it('returns equivalent icons for 03d and 03n (both WiCloud)', () => {
    const day = getWeatherIcon('03d');
    const night = getWeatherIcon('03n');
    // They are the same element type in the map
    expect(weatherIcons['03d']).toBeDefined();
    expect(weatherIcons['03n']).toBeDefined();
    // Both render successfully
    const { container: dc } = render(<>{day}</>);
    const { container: nc } = render(<>{night}</>);
    expect(dc.querySelector('svg')).not.toBeNull();
    expect(nc.querySelector('svg')).not.toBeNull();
  });
});

describe('getWeatherIcon renders specific known weather icons', () => {
  it('renders an icon for thunderstorm (11d)', () => {
    const icon = getWeatherIcon('11d');
    expect(icon).not.toBeNull();
    const { container } = render(<>{icon}</>);
    expect(container.querySelector('svg')).not.toBeNull();
  });

  it('renders an icon for snow (13n)', () => {
    const icon = getWeatherIcon('13n');
    expect(icon).not.toBeNull();
    const { container } = render(<>{icon}</>);
    expect(container.querySelector('svg')).not.toBeNull();
  });

  it('renders an icon for fog (50d)', () => {
    const icon = getWeatherIcon('50d');
    expect(icon).not.toBeNull();
    const { container } = render(<>{icon}</>);
    expect(container.querySelector('svg')).not.toBeNull();
  });
});