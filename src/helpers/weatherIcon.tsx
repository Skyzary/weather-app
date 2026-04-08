import {
    WiCloud,
    WiCloudy,
    WiDayCloudy,
    WiDayRain,
    WiDaySunny, WiFog,
    WiNightAltCloudy, WiNightAltRain,
    WiNightClear,
    WiShowers, WiSnow, WiThunderstorm
} from "react-icons/wi";
import {FaInfoCircle} from "react-icons/fa";
import type {ReactElement} from "react";

export const weatherIcons: Record<string, ReactElement> = {
    "01d": <WiDaySunny size={48}/>,
    "01n": <WiNightClear size={48}/>,
    "02d": <WiDayCloudy size={48}/>,
    "02n": <WiNightAltCloudy size={48}/>,
    "03d": <WiCloud size={48}/>,
    "03n": <WiCloud size={48}/>,
    "04d": <WiCloudy size={48}/>,
    "04n": <WiCloudy size={48}/>,
    "09d": <WiShowers size={48}/>,
    "09n": <WiShowers size={48}/>,
    "10d": <WiDayRain size={48}/>,
    "10n": <WiNightAltRain size={48}/>,
    "11d": <WiThunderstorm size={48}/>,
    "11n": <WiThunderstorm size={48}/>,
    "13d": <WiSnow size={48}/>,
    "13n": <WiSnow size={48}/>,
    "50d": <WiFog size={48}/>,
    "50n": <WiFog size={48}/>,
};
export const getWeatherIcon = (iconCode?: string) => {
    return (iconCode && weatherIcons[iconCode]) || <FaInfoCircle size={32} />;
};