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

  return (
    <div className={css.langSwitcher}>
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
  );
}
