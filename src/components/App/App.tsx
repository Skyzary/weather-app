import VillageSearchField from "../VillageSearchField/VillageSearchField";
import WeatherData from "../WeatherData/WeatherData";
import { MoonLoader } from "react-spinners";
import css from "./App.module.css";
import "../../index.css";
import IziToast from "izitoast";
import { useEffect } from "react";
import { useStore } from "../../hooks/useStore";
import '@mawtech/glass-ui/styles.css';

export default function App() {
  const {
    weatherData,
    loading,
    cityFound,
    fetchWeather
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

  return (
      <div className={css.App}>
        <h1 className={css.appHeader}>Погода</h1>


        <VillageSearchField onSearch={fetchWeather} />

        {weatherData && (
            <h2 className={css.appHeader}>Погода в городе: {weatherData.name}</h2>
        )}

        {loading && (
            <div className={css.loader}>
              <MoonLoader size={50} color="#ffffff" />
            </div>
        )}


        {weatherData && !loading && <WeatherData data={weatherData} />}
      </div>
  );
}
