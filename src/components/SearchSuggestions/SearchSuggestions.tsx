import type { CityCoords } from '../../types/WeatherData.ts';
import css from './SearchSuggestioons.module.css';

interface SearchSuggestionsProps {
  suggestions: CityCoords[];
  onSuggestionClick: (suggestion: CityCoords) => void;
  isVisible: boolean;
  selectedIndex?: number;
}
export default function SearchSuggestions({
  suggestions,
  onSuggestionClick,
  isVisible,
  selectedIndex,
}: SearchSuggestionsProps) {
  return (
    <ul className={css.searchSuggestions + (isVisible ? ' ' + css.isVisible : '')}>
      {suggestions.map((suggestion, index) => (
        <li
          className={css.searchSuggestion + (index === selectedIndex ? ' ' + css.isSelected : '')}
          key={`${suggestion.lat}-${suggestion.lon}-${suggestion.name}`}
        >
          <button
            type={'button'}
            onClick={() => {
              onSuggestionClick(suggestion);
            }}
            className={css.searchSuggestionButton}
          >
            <span className={css.searchSuggestionName}>{suggestion.name}</span>
            <span className={css.searchSuggestionCountry}>{suggestion.country}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
