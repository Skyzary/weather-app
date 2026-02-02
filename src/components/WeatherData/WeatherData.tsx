import css from "./WeatherData.module.css";
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
    }[];
    wind?: {
      speed: number;
    };
  };
}

export default function WeatherData({ data }: WeatherDataProps) {
  return (
    <div className={css.weatherDataContainer}>
      <div className={css.subContainer}>
        <p className={css.prop}>
          Температура <span>{Math.round(data.main.temp)}°C</span>
        </p>
        <p className={css.prop}>
          Влажность <span>{data.main.humidity}%</span>
        </p>
      </div>
      <div className={css.subContainer}>
        <p className={css.prop}>
          Ощущаемая температура
          <span>
            {data.main.feels_like
              ? `${Math.round(data.main.feels_like)}°C`
              : "Недоступно"}
          </span>
        </p>
      </div>
      <div className={css.subContainer}>
        <p className={css.prop}>
          Атмосферное давление
          <span>
            {data.main.pressure ? `${data.main.pressure} гПа` : "Недоступно"}
          </span>
        </p>
        <p className={css.prop}>
          Скорость ветра
          <span>
            {data.wind?.speed ? `${data.wind.speed} м/с` : "Недоступно"}
          </span>
        </p>
      </div>
      <p className={css.prop}>
        Описание <span>{data.weather[0].description}</span>
      </p>
    </div>
  );
}
