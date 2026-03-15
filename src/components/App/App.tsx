import VillageSearchField from "../VillageSearchField/VillageSearchField";
import WeatherData from "../WeatherData/WeatherData";
import { MoonLoader } from "react-spinners";
import css from "./App.module.css";
import "../../index.css";
import IziToast from "izitoast";
import { useEffect } from "react";
import { useStore } from "../../hooks/useStore";
import '@mawtech/glass-ui/styles.css';
import Forecast from "../Forecast/Forecast.tsx";

export default function App() {
  const {
    weatherData,
    loading,
    cityFound,
    forecastData,
    foreCast
  } = useStore();

  useEffect(() => {
    if (!cityFound) {
      IziToast.error({
        title: "Ошибка",
        message: "Город не найден",
        position: "topCenter"
      });
    }
  }, [cityFound]);

  useEffect(() => {
        if (weatherData && weatherData.name) {
            foreCast(weatherData.name);
        }
    }, [weatherData, foreCast]);

  return (
      <div className={css.App}>


        <VillageSearchField/>

        {weatherData && (
            <h2 className={css.appHeader}>Погода в городе: {weatherData.name}</h2>
        )}

        {loading && (
            <div className={css.loader}>
              <MoonLoader size={50} color="#ffffff" />
            </div>
        )}


        {weatherData && !loading && <WeatherData data={weatherData} />}
        {forecastData && !loading && <Forecast forecastData={forecastData} />}
      </div>
  );
}
