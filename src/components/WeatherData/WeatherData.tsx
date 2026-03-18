import css from "./WeatherData.module.css";
import { FaTemperatureHigh, FaWind, FaTachometerAlt } from "react-icons/fa";
import { WiHumidity } from "react-icons/wi";
import { Glow, GlowCapture } from "@codaworks/react-glow";
import { getWeatherIcon } from "../../helpers/weatherIcon.tsx";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useState, useEffect, useRef, memo } from "react";

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
  const weather = data.weather?.[0];
  const [humidity, setHumidity] = useState(0);

  const requestRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const displayValueRef = useRef(0);
  const isInitialMount = useRef(true);

  useEffect(() => {
    const targetValue = data.main.humidity;
    const startValue = displayValueRef.current;
    const duration = 1000;
    let timeoutId: number | undefined;

    const animate = (time: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = time;
      }

      if (startTimeRef.current !== null) {
        const elapsedTime = time - startTimeRef.current;
        const progress = Math.min(elapsedTime / duration, 1);
        const easeProgress = progress * (2 - progress);

        const currentValue = startValue + (targetValue - startValue) * easeProgress;
        displayValueRef.current = currentValue;
        setHumidity(Math.round(currentValue));

        if (progress < 1) {
          requestRef.current = requestAnimationFrame(animate);
        }
      }
    };

    const startAnimation = () => {
      startTimeRef.current = null;
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }
      requestRef.current = requestAnimationFrame(animate);
    };

    if (isInitialMount.current) {
      isInitialMount.current = false;
      timeoutId = setTimeout(startAnimation, 300);
    } else {
      startAnimation();
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [data.main.humidity]);

  return (
      <GlowCapture>
        <div className={css.weatherDataContainer}>
          <div className={css.tempBlock}>
            <Glow color="#fff">
              <div className={`${css.prop} ${css.tempBlockCard}`}>
                <div className={css.tempAndDesc}>
                  <div className={css.tempDetails}>
                    <FaTemperatureHigh size={48} className={css.tempIcon}/>
                    <p>Температура</p>
                    <div>
                      <span>{Math.round(data.main.temp)}°C</span>
                      <small>
                        Ощущается как: {data.main.feels_like != null ? Math.round(data.main.feels_like) : "--"}°C
                      </small>
                    </div>
                  </div>
                  <div className={css.descriptionDetails}>
                    {getWeatherIcon(weather?.icon)}
                    <p>Описание</p>
                    <span>{weather?.description || "Нет описания"}</span>
                  </div>
                </div>
              </div>
            </Glow>
          </div>

          <div className={css.humidity}>
            <Glow color="#fff">
              <div className={`${css.prop} ${css.humidityCard}`}>
                <WiHumidity size={64} className={css.humidityIcon}/>
                <p>Влажность</p>
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
                <p>Скорость ветра</p>
                <span>
                {data.wind?.speed != null ? `${data.wind.speed} м/с` : "Недоступно"}
              </span>
              </div>
            </Glow>
          </div>

          <div className={css.pressure}>
            <Glow color="#fff">
              <div className={`${css.prop} ${css.pressureCard}`}>
                <FaTachometerAlt size={48} />
                <p>Давление</p>
                <span>
                {data.main.pressure != null ? `${data.main.pressure} гПа` : "Недоступно"}
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