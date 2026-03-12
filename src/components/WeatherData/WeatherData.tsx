import css from "./WeatherData.module.css";
import { GlassCard } from "@mawtech/glass-ui";
import { FaTemperatureHigh, FaWind, FaTachometerAlt } from "react-icons/fa";
import { WiHumidity } from "react-icons/wi";

import { Glow, GlowCapture } from "@codaworks/react-glow";
import { getWeatherIcon} from "../../helpers/weatherIcon.tsx";

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
        <GlowCapture>
            <div className={css.weatherDataContainer}>

                <div className={css.description}>
                    <Glow color="#fff">
                        <GlassCard className={`${css.prop} ${css.descriptionCard} `}>
                            {getWeatherIcon(data.weather[0].icon)}
                            <p>Описание</p>
                            <span>{data.weather[0].description}</span>
                        </GlassCard>
                    </Glow>
                </div>

                <div className={css.tempBlock}>
                    <Glow color="#fff">
                        <GlassCard className={`${css.prop} ${css.tempBlockCard} `}>
                            <FaTemperatureHigh size={48} />
                            <p>Температура</p>
                            <div>
                              <span>{Math.round(data.main.temp)}°C</span>
                              <small>
                                  Ощущается как: {data.main.feels_like ? Math.round(data.main.feels_like) : "--"}°C
                              </small>
                            </div>
                        </GlassCard>
                    </Glow>
                </div>

                <div className={css.humidity}>
                    <Glow color="#fff">
                        <GlassCard className={`${css.prop} ${css.humidityCard} `}>
                            <WiHumidity size={64} />
                            <p>Влажность</p>
                            <span>{data.main.humidity}%</span>
                        </GlassCard>
                    </Glow>
                </div>
                <div className={css.windSpeed}>
                    <Glow color="#fff">
                        <GlassCard className={`${css.prop} ${css.windSpeedCard} `}>
                            <FaWind size={48} />
                            <p>Скорость ветра</p>
                            <span>
                                {data.wind?.speed ? `${data.wind.speed} м/с` : "Недоступно"}
                </span>
                        </GlassCard>
                    </Glow>
                </div>

                <div className={css.pressure}>
                    <Glow color="#fff">
                        <GlassCard className={`${css.prop} ${css.pressureCard} `}>
                            <FaTachometerAlt size={48} />
                            <p>Давление</p>
                            <span>
                                {data.main.pressure ? `${data.main.pressure} гПа` : "Недоступно"}
                  </span>
                        </GlassCard>
                    </Glow>
                </div>


            </div>
        </GlowCapture>
    );
}
