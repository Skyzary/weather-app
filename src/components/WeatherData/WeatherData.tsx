import css from "./WeatherData.module.css";
import { GlassCard } from "@mawtech/glass-ui";
import { FaTemperatureHigh, FaWind, FaTachometerAlt, FaInfoCircle } from "react-icons/fa";
import {
  WiHumidity,
  WiDaySunny,
  WiNightClear,
  WiDayCloudy,
  WiNightAltCloudy,
  WiCloud,
  WiCloudy,
  WiShowers,
  WiDayRain,
  WiNightAltRain,
  WiThunderstorm,
  WiSnow,
  WiFog,
} from "react-icons/wi";

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

const weatherIcons: Record<string, React.ReactElement<string | React.SVGProps<SVGSVGElement> >> = {
  "01d": <WiDaySunny size={64} />,
  "01n": <WiNightClear size={64} />,
  "02d": <WiDayCloudy size={64} />,
  "02n": <WiNightAltCloudy size={64} />,
  "03d": <WiCloud size={64} />,
  "03n": <WiCloud size={64} />,
  "04d": <WiCloudy size={64} />,
  "04n": <WiCloudy size={64} />,
  "09d": <WiShowers size={64} />,
  "09n": <WiShowers size={64} />,
  "10d": <WiDayRain size={64} />,
  "10n": <WiNightAltRain size={64} />,
  "11d": <WiThunderstorm size={64} />,
  "11n": <WiThunderstorm size={64} />,
  "13d": <WiSnow size={64} />,
  "13n": <WiSnow size={64} />,
  "50d": <WiFog size={64} />,
  "50n": <WiFog size={64} />,
};

const getWeatherIcon = (iconCode?: string) => {
  return (iconCode && weatherIcons[iconCode]) || <FaInfoCircle size={48} />;
};

export default function WeatherData({ data }: WeatherDataProps) {
  return (
    <div className={css.weatherDataContainer}>
      <div className={css.subContainer}>
        <GlassCard>
          <div className={css.prop}>
            <FaTemperatureHigh size={48} style={{ paddingLeft: "10px" }} />
            <p>Температура</p>
            <span>{Math.round(data.main.temp)}°C</span>
          </div>
        </GlassCard>

        <GlassCard>
          <div className={css.prop + " " + css.humidity}>
            <WiHumidity size={64} />
            <p>Влажность</p>
            <span>{data.main.humidity}%</span>
          </div>
        </GlassCard>
      </div>
      <div className={css.subContainer}>
        <GlassCard>
          <div className={css.prop + " " + css.feelsLike}>
            <FaTemperatureHigh size={48} style={{ paddingLeft: "10px" }} />
            <p>Ощущаемая температура</p>
            <span>
              {data.main.feels_like
                ? `${Math.round(data.main.feels_like)}°C`
                : "Недоступно"}
            </span>
          </div>
        </GlassCard>
      </div>
      <div className={css.subContainer}>
        <GlassCard>
          <div className={css.prop + " " + css.pressure}>
            <FaTachometerAlt size={48} />
            <p>Атмосферное давление</p>
            <span>
              {data.main.pressure
                ? `${data.main.pressure} гПа`
                : "Недоступно"}
            </span>
          </div>
        </GlassCard>

        <GlassCard>
          <div className={css.prop + " " + css.windSpeed}>
            <FaWind size={48} />
            <p>Скорость ветра</p>
            <span>
              {data.wind?.speed ? `${data.wind.speed} м/с` : "Недоступно"}
            </span>
          </div>
        </GlassCard>
      </div>

      <GlassCard>
        <div className={css.prop + " " + css.description}>
          {getWeatherIcon(data.weather[0].icon)}
          <p>Описание</p>
          <span>{data.weather[0].description}</span>
        </div>
      </GlassCard>
    </div>
  );
}
