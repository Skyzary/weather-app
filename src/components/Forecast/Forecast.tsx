import css from "./Forecast.module.css";
import {GlowCapture, Glow} from "@codaworks/react-glow";
import type {ForecastItem} from "../../types/WeatherData";
import {getWeatherIcon} from "../../helpers/weatherIcon.tsx";




export default function Forecast ({forecastData}: {forecastData: ForecastItem[]}){
const formatDate = (dateString: string) =>{
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {weekday: 'long', day: 'numeric', month: 'long'})
    }
    if(!forecastData.length){
        return null;
    }
    return(
        <section className={css.forecastSection}>
            <h3 className={css.forecastTitle}>Прогноз на 5 дней</h3>
            <GlowCapture>
                <Glow>
                <div className = {css.forecastContainer}>
                    {forecastData.map((day) => (
                        <div key={day.dt} className={css.dayItem}>
                            <span className={css.date}>{formatDate(day.dt_txt)}</span>
                            <div className={css.icon}>
                                {getWeatherIcon(day.weather[0].icon)}
                            </div>
                            <span className={css.temp}>{Math.round(day.main.temp)}°C</span>
                            <span className={css.desc}>{day.weather[0].description}</span>
                        </div>
                    ))}
                </div>
                </Glow>

            </GlowCapture>
        </section>
    )
}