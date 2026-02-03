import css from "./WeatherData.module.css";
import { GlowCapture, Glow } from "@codaworks/react-glow";
interface WeatherDataProps {
  data: {
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
    };
  };
}

export default function WeatherData({ data }: WeatherDataProps) {
  return (
    <div className={css.weatherDataContainer}>
      <GlowCapture>
        <div className={css.subContainer}>
          <Glow>
            <p className={css.prop}>
              Температура <span>{Math.round(data.main.temp)}°C</span>
            </p>
          </Glow>
          <Glow>
            <p className={css.prop + " " + css.humidity}>
              Влажность <span>{data.main.humidity}%</span>
            </p>
          </Glow>
        </div>
        <div className={css.subContainer}>
          <Glow>
            <p className={css.prop + " " + css.feelsLike}>
              Ощущаемая температура
              <span>
                {data.main.feels_like
                  ? `${Math.round(data.main.feels_like)}°C`
                  : "Недоступно"}
              </span>
            </p>
          </Glow>
        </div>
        <div className={css.subContainer}>
          <Glow>
            <p className={css.prop + " " + css.pressure}>
              Атмосферное давление
              <span>
                {data.main.pressure
                  ? `${data.main.pressure} гПа`
                  : "Недоступно"}
              </span>
            </p>
          </Glow>
          <Glow>
            <p className={css.prop + " " + css.windSpeed}>
              Скорость ветра
              <span>
                {data.wind?.speed ? `${data.wind.speed} м/с` : "Недоступно"}
              </span>
            </p>
          </Glow>
        </div>
        <Glow>
          <p className={css.prop + " " + css.description}>
            Описание <span>{data.weather[0].description}</span>
          </p>
        </Glow>
      </GlowCapture>
    </div>
  );
}
