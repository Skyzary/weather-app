import VillageSearchField from "../VillageSearchField/VillageSearchField";
import { useState } from "react";
import axios from "axios";
import WeatherData from "../WeatherData/WeatherData";
import { MoonLoader } from "react-spinners";
import css from "./App.module.css";
import "../../index.css";

interface requestParams {
  q: string;
  limit: number;
  appid: string;
}

interface CurrentWeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
    feels_like?: number;
    pressure?: number;
  };
  weather: {
    description: string;
    icon?: string;
  }[];
  wind?: {
    speed: number;
    deg?: number;
  };
}

export default function App() {
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState<CurrentWeatherData | null>(
    () => {
      const savedWeatherData = localStorage.getItem("weatherData");
      return savedWeatherData ? JSON.parse(savedWeatherData) : null;
    },
  );

  async function convertVillageNameToCoords(villageName: string) {
    const params: requestParams = {
      q: villageName,
      limit: 1,
      appid: import.meta.env.VITE_API_KEY,
    };
    try {
      setLoading(true);
      const response = await axios.get(
        "https://api.openweathermap.org/geo/1.0/direct",
        { params },
      );
      const cityName =
        response.data[0]?.local_names?.ru || response.data[0]?.name;
      return {
        name: cityName,
        lat: response.data[0].lat,
        lon: response.data[0].lon,
      };
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      return null;
    }
  }
  const handleVillageSearch = async (villageName: string) => {
    if (!villageName.trim()) {
      return;
    }
    const coords = await convertVillageNameToCoords(villageName);
    // Если coords не получены, выходим из функции
    if (!coords) return;

    const { lat, lon, name } = coords || { lat: 0, lon: 0, name: "" };
    console.log(`Village: ${name}, Latitude: ${lat}, Longitude: ${lon}`);
    const params = {
      lat: lat,
      lon: lon,
      appid: import.meta.env.VITE_API_KEY,
      units: "metric",
      lang: "ru",
    };
    try {
      const response = await axios.get(
        "https://api.openweathermap.org/data/2.5/weather",
        { params },
      );
      const weatherDataToSave: CurrentWeatherData = {
        name: name,
        main: response.data.main,
        weather: response.data.weather,
        wind: response.data.wind, // Пример добавления данных о ветре
      };
      setWeatherData(weatherDataToSave);
      localStorage.setItem("weatherData", JSON.stringify(weatherDataToSave));
      setLoading(false);
      return weatherDataToSave;
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setWeatherData(null);
      return null;
    }
  };
  return (
    <div className={css.App}>
      <h1 className={css.appHeader}>Погода</h1>
      <VillageSearchField onSearch={handleVillageSearch} />
      <h2 className={css.appHeader}>Погода в городе: {weatherData?.name}</h2>

      {loading && (
        <div className={css.loader}>
          <MoonLoader size={50} color="#ffffff" />
        </div>
      )}
      {weatherData && <WeatherData data={weatherData} />}
    </div>
  );
}
