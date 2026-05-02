import { useEffect, useState } from 'react';
import css from './VillageSearchField.module.css';
import { CiSearch } from 'react-icons/ci';
import { useStore } from '../../hooks/useStore.ts';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import SearchSuggestions from '../SearchSuggestions/SearchSuggestions.tsx';
import type { CityCoords } from '../../types/WeatherData.ts';

const POPULAR_CITIES = ['Kyiv', 'London', 'Paris', 'New York', 'Tokyo'];

export default function VillageSearchField() {
  const { t } = useTranslation();
  const fetchWeather = useStore((state) => state.fetchWeather);
  const city = useStore((state) => state.city);
  const setCity = useStore((state) => state.setCity);
  const suggestions = useStore((state) => state.suggestions);
  const setSuggestions = useStore((state) => state.setSuggestions);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [prevSuggestions, setPrevSuggestions] = useState(suggestions);

  if (suggestions !== prevSuggestions) {
    setSelectedIndex(-1);
    setPrevSuggestions(suggestions);
  }

  useEffect(() => {
    if (!city.trim() || city.length < 2) {
      return;
    }

    const handler = setTimeout(() => {
      fetchWeather(city);
    }, 800);
    return () => clearTimeout(handler);
  }, [fetchWeather, city]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value);
  };

  const handleSuggestionClick = (suggestion: CityCoords) => {
    setCity(suggestion.name);
    setSuggestions([]);
    setIsVisible(false);
    setSelectedIndex(-1);
    fetchWeather(suggestion);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isVisible || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      handleSuggestionClick(suggestions[selectedIndex]);
    } else if (e.key === 'Escape') {
      setIsVisible(false);
    }
  };

  const handlePopularCityClick = (cityName: string) => {
    setCity(cityName);
    setSuggestions([]);
    setIsVisible(false);
    setSelectedIndex(-1);
    fetchWeather(cityName);
  };

  return (
    <header>
      <h1 className={css.title}>Weather App</h1>
      <div className={css.searchBox}>
        <div className={css.inputWrapper}>
          <CiSearch
            className={css.searchIcon}
            size={24}
          />
          <label>
            <input
              aria-label={t('searchCity')}
              className={css.searchField}
              type="text"
              value={city}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={t('enterCityName')}
              onFocus={() => setIsVisible(true)}
              onBlur={() => setTimeout(() => setIsVisible(false), 200)}
            />
          </label>
          <SearchSuggestions
            isVisible={isVisible}
            suggestions={suggestions}
            onSuggestionClick={handleSuggestionClick}
            selectedIndex={selectedIndex}
          />
        </div>
        <div className={css.popularCities}>
          {POPULAR_CITIES.map((popularCity) => (
            <button
              key={popularCity}
              className={css.popularCityButton}
              onClick={() => handlePopularCityClick(popularCity)}
            >
              {popularCity}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
