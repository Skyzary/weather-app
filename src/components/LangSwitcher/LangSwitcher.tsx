import css from "./LangSwitcher.module.css";
import { useTranslation } from "react-i18next";

interface LangSwitcherProps {
  onLanguageChange?: (lng: string) => void;
}

export default function LangSwitcher({ onLanguageChange }: LangSwitcherProps) {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    if (onLanguageChange) {
      onLanguageChange(lng);
    }
  };

  const languages = [
    { code: 'en', label: 'EN' },
    { code: 'fr', label: 'FR' },
    { code: 'ru', label: 'RU' },
    { code: 'uk', label: 'UA' },
  ];

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    changeLanguage(e.target.value);
  };

  return (
    <div className={css.langSwitcher}>
      <div className={css.desktopSwitcher}>
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={currentLang.startsWith(lang.code) ? css.activeLang : ''}
          >
            {lang.label}
          </button>
        ))}
      </div>
      <div className={css.mobileSwitcher}>
        <select value={currentLang.split('-')[0]} onChange={handleSelectChange} className={css.selectLang}>
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
