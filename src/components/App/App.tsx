import VillageSearchField from "../VillageSearchField/VillageSearchField";
import WeatherData from "../WeatherData/WeatherData";
import css from "./App.module.css";
import "../../index.css";
import { useStore } from "../../hooks/useStore";
import '@mawtech/glass-ui/styles.css';
import Forecast from "../Forecast/Forecast.tsx";
import CityImage from "../CityImage/CityImage.tsx";
import ForecastSkeleton from "../Forecast/ForecastSkeleton.tsx";
import { useTranslation } from "react-i18next";
import LangSwitcher from "../LangSwitcher/LangSwitcher";

export default function App() {
  const { t } = useTranslation();
  const weatherData = useStore((state) => state.weatherData);
  const loading = useStore((state) => state.loading);
  const forecastData = useStore((state) => state.forecastData);
  const cityImage = useStore((state) => state.cityImage);
  const fetchWeather = useStore((state) => state.fetchWeather);



  const onLanguageChange = () => {
    if (weatherData?.name) {
      fetchWeather(weatherData.name);
    }
  };

  return (
    <div className={css.App}>
      <LangSwitcher onLanguageChange={onLanguageChange} />
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
