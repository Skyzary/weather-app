import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { getWeatherIcon, weatherIcons } from '../weatherIcon';

describe('weatherIcons map', () => {
  it('contains entries for all standard day icon codes', () => {
    const dayCodes = ['01d', '02d', '03d', '04d', '09d', '10d', '11d', '13d', '50d'];
    dayCodes.forEach((code) => {
      expect(weatherIcons).toHaveProperty(code);
    });
  });

  it('contains entries for all standard night icon codes', () => {
    const nightCodes = ['01n', '02n', '03n', '04n', '09n', '10n', '11n', '13n', '50n'];
    nightCodes.forEach((code) => {
      expect(weatherIcons).toHaveProperty(code);
    });
  });

  it('has 18 total entries covering all OWM icon codes', () => {
    expect(Object.keys(weatherIcons)).toHaveLength(18);
  });
});

describe('getWeatherIcon', () => {
  it('returns the matching icon element for a known icon code', () => {
    const { container } = render(<>{getWeatherIcon('01d')}</>);
    expect(container.firstChild).not.toBeNull();
  });

  it('returns different elements for day and night variants of the same condition', () => {
    const dayIcon = getWeatherIcon('01d');
    const nightIcon = getWeatherIcon('01n');
    // They are different React elements (different types)
    expect(dayIcon).not.toEqual(nightIcon);
  });

  it('returns the fallback FaInfoCircle icon for an unknown icon code', () => {
    const { container } = render(<>{getWeatherIcon('unknown_code')}</>);
    expect(container.firstChild).not.toBeNull();
  });

  it('returns the fallback icon when iconCode is undefined', () => {
    const { container } = render(<>{getWeatherIcon(undefined)}</>);
    expect(container.firstChild).not.toBeNull();
  });

  it('returns the fallback icon when iconCode is an empty string', () => {
    const { container } = render(<>{getWeatherIcon('')}</>);
    expect(container.firstChild).not.toBeNull();
  });

  it('returns valid React elements for every known icon code', () => {
    Object.keys(weatherIcons).forEach((code) => {
      const { container } = render(<>{getWeatherIcon(code)}</>);
      expect(container.firstChild).not.toBeNull();
    });
  });

  it('the fallback icon for an unknown code is not the same as a known icon', () => {
    const known = getWeatherIcon('01d');
    const fallback = getWeatherIcon('99x');
    expect(known).not.toEqual(fallback);
  });
});