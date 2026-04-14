import css from "./WeatherData.module.css";
import { FaTemperatureHigh, FaWind, FaTachometerAlt } from "react-icons/fa";
import { WiHumidity } from "react-icons/wi";
import { Glow, GlowCapture } from "@codaworks/react-glow";
import { getWeatherIcon } from "../../helpers/weatherIcon.tsx";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { memo } from "react";
import { useTranslation } from "react-i18next";
import {useAnimate} from "../../hooks/useAnimate.ts";

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

function WeatherData({ data }: WeatherDataProps) {
  const { t } = useTranslation();
  const weather = data.weather?.[0];

 const humidity = useAnimate(data.main.humidity, 1000);


  return (
      <GlowCapture>
        <div className={css.weatherDataContainer}>
          <div className={css.tempBlock}>
            <Glow color="#fff">
              <div className={`${css.prop} ${css.tempBlockCard}`}>
                <div className={css.tempAndDesc}>
                  <div className={css.tempDetails}>
                    <FaTemperatureHigh size={48} className={css.tempIcon}/>
                    <p>{t('temperature')}</p>
                    <div>
                      <span>{Math.round(data.main.temp)}°C</span>
                      <small>
                        {data.main.feels_like != null ? t('feelsLike', { temp: Math.round(data.main.feels_like) }) : `--°C`}
                      </small>
                    </div>
                  </div>
                  <div className={css.descriptionDetails}>
                    {getWeatherIcon(weather?.icon)}
                    <p>{t('description')}</p>
                    <span>{weather?.description || t('noDescription')}</span>

                  </div>
                </div>
              </div>
            </Glow>
          </div>

          <div className={css.humidity}>
            <Glow color="#fff">
              <div className={`${css.prop} ${css.humidityCard}`}>
                <WiHumidity size={64} className={css.humidityIcon}/>
                <p>{t('humidity')}</p>
                <div className={css.circleWrapper}>
                  <CircularProgressbar
                      className={css.humidityCircle}
                      value={humidity}
                      text={`${humidity}%`}
                      strokeWidth={8}
                      styles={buildStyles({
                        trailColor: "rgba(255, 255, 255, 0.2)",
                        pathColor: "#fff",
                        textColor: "#fff",
                        textSize: "18px",
                        pathTransition: "none"
                      })}
                  />
                </div>
              </div>
            </Glow>
          </div>

          <div className={css.windSpeed}>
            <Glow color="#fff">
              <div className={`${css.prop} ${css.windSpeedCard}`}>
                <FaWind size={48} />
                <p>{t('windSpeed')}</p>
                <span>
                {data.wind?.speed != null ? `${data.wind.speed} ${t('ms')}` : t('unavailable')}
              </span>
              </div>
            </Glow>
          </div>

          <div className={css.pressure}>
            <Glow color="#fff">
              <div className={`${css.prop} ${css.pressureCard}`}>
                <FaTachometerAlt size={48} />
                <p>{t('pressure')}</p>
                <span>
                {data.main.pressure != null ? `${data.main.pressure} ${t('hpa')}` : t('unavailable')}
              </span>
              </div>
            </Glow>
          </div>
        </div>
      </GlowCapture>
  );
}

export default memo(WeatherData, (prev, next) => {
  return (
      prev.data.main.temp === next.data.main.temp &&
      prev.data.main.humidity === next.data.main.humidity &&
      prev.data.wind?.speed === next.data.wind?.speed &&
      prev.data.main.pressure === next.data.main.pressure &&
      prev.data.weather?.[0]?.description === next.data.weather?.[0]?.description
  );
});