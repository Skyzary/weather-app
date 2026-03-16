import css from "./WeatherData.module.css";
import { FaTemperatureHigh, FaWind, FaTachometerAlt } from "react-icons/fa";
import { WiHumidity } from "react-icons/wi";
import { Glow, GlowCapture } from "@codaworks/react-glow";
import { getWeatherIcon } from "../../helpers/weatherIcon.tsx";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';


interface WeatherDataProps {
  data: {
    name: string;
    image?: {
      imageUrl: string;
      imageAlt: string;
    }
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
    <GlowCapture>
      <div className={css.weatherDataContainer}>
        <div className={css.cityImg}>
          <Glow color={"#FFF"}>

          </Glow>
        </div>
        <div className={css.tempBlock}>
          <Glow color="#fff">
            <div className={`${css.prop} ${css.tempBlockCard} `}>
              <div className={css.tempAndDesc}>
                <div className={css.tempDetails}>
                  <FaTemperatureHigh size={48} className={css.tempIcon}/>
                  <p>Температура</p>
                  <div>
                    <span>{Math.round(data.main.temp)}°C</span>
                    <small>
                      Ощущается как:{" "}
                      {data.main.feels_like
                        ? Math.round(data.main.feels_like)
                        : "--"}
                      °C
                    </small>
                  </div>
                </div>
                <div className={css.descriptionDetails}>
                  {getWeatherIcon(data.weather[0].icon)}
                  <p>Описание</p>
                  <span>{data.weather[0].description}</span>
                </div>
              </div>
            </div>
          </Glow>
        </div>

        <div className={css.humidity}>
          <Glow color="#fff">
            <div className={`${css.prop} ${css.humidityCard} `}>

                <WiHumidity size={64} className={css.humidityIcon}/>
                <p>Влажность</p>

              <div className={css.circleWrapper}>
                <CircularProgressbar
                  className={css.humidityCircle}
                  value={data.main.humidity}
                  text={`${data.main.humidity}%`}
                  strokeWidth={8}
                  styles={buildStyles({trailColor: "rgba(255, 255, 255, 0.2)", pathColor: "#fff", textColor: "#fff", textSize: "18px"})}
              />
              </div>
            </div>
          </Glow>
        </div>
        <div className={css.windSpeed}>
          <Glow color="#fff">
            <div className={`${css.prop} ${css.windSpeedCard} `}>
              <FaWind size={48} />
              <p>Скорость ветра</p>
              <span>
                {data.wind?.speed ? `${data.wind.speed} м/с` : "Недоступно"}
              </span>
            </div>
          </Glow>
        </div>

        <div className={css.pressure}>
          <Glow color="#fff">
            <div className={`${css.prop} ${css.pressureCard} `}>
              <FaTachometerAlt size={48} />
              <p>Давление</p>
              <span>
                {data.main.pressure
                  ? `${data.main.pressure} гПа`
                  : "Недоступно"}
              </span>
            </div>
          </Glow>
        </div>
      </div>
    </GlowCapture>
  );
}