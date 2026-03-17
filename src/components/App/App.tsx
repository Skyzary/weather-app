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

export default function App() {
  const weatherData = useStore((state) => state.weatherData);
  const loading = useStore((state) => state.loading);
  const cityFound = useStore((state) => state.cityFound);
  const forecastData = useStore((state) => state.forecastData);
  const cityImage = useStore((state) => state.cityImage);

  useEffect(() => {
    if (!cityFound) {
      IziToast.error({
        title: "Ошибка",
        message: "Город не найден",
        position: "topCenter"
      });
    }
  }, [cityFound]);


  return (
    <div className={css.App}>
      <VillageSearchField />

      {weatherData && (
        <h2 className={css.appHeader}>Погода в городе: {weatherData.name}</h2>
      )}



      <div className={css.dataContainer}>
        {cityImage && cityImage.imageUrl && !loading && (
          <CityImage imageUrl={cityImage.imageUrl} imageAlt={cityImage.imageAlt} />
        )}
        {weatherData && !loading && <WeatherData data={weatherData} />}
      </div>
      
      {loading && <ForecastSkeleton />}
      {forecastData && !loading && <Forecast forecastData={forecastData} />}
    </div>
  );
}
