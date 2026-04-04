import VillageSearchField from "../VillageSearchField/VillageSearchField";
import WeatherData from "../WeatherData/WeatherData";
import css from "./App.module.css";
import "../../index.css";
import IziToast from "izitoast";
import { useEffect } from "react";
import { useStore } from "../../hooks/useStore";
import '@mawtech/glass-ui/styles.css';
import Forecast from "../Forecast/Forecast.tsx";
import CityImage from "../CityImage/CityImage.tsx";
import ForecastSkeleton from "../Forecast/ForecastSkeleton.tsx";
import { useTranslation } from "react-i18next";

export default function App() {
  const { t, i18n } = useTranslation();
  const weatherData = useStore((state) => state.weatherData);
  const loading = useStore((state) => state.loading);
  const cityFound = useStore((state) => state.cityFound);
  const forecastData = useStore((state) => state.forecastData);
  const cityImage = useStore((state) => state.cityImage);
  const fetchWeather = useStore((state) => state.fetchWeather);

  useEffect(() => {
    if (!cityFound) {
      IziToast.error({
        title: t("error"),
        message: t("cityNotFound"),
        position: "topCenter"
      });
    }
  }, [cityFound, t]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    if (weatherData?.name) {
      fetchWeather(weatherData.name);
    }
  };

  const currentLang = i18n.language || 'en';

  return (
    <div className={css.App}>
      <div className={css.langSwitcher}>
        <button onClick={() => changeLanguage('en')} className={currentLang.startsWith('en') ? css.activeLang : ''}>EN</button>
        <button onClick={() => changeLanguage('fr')} className={currentLang.startsWith('fr') ? css.activeLang : ''}>FR</button>
        <button onClick={() => changeLanguage('ru')} className={currentLang.startsWith('ru') ? css.activeLang : ''}>RU</button>
      </div>
      <VillageSearchField />

      {weatherData && (
        <h2 className={css.appHeader}>{t('weatherInCity', { city: weatherData.name })}</h2>
      )}

      <div className={css.dataContainer}>
        {cityImage?.imageUrl && <CityImage imageUrl={cityImage.imageUrl} imageAlt={cityImage.imageAlt} />}
        {weatherData  && <WeatherData data={weatherData} />}
      </div>
      
      {loading && !forecastData && <ForecastSkeleton />}
      {forecastData && <Forecast forecastData={forecastData} />}
    </div>
  );
}
