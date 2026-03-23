import { useEffect } from "react";
import css from "./VillageSearchField.module.css";
import { CiSearch } from "react-icons/ci";
import { useStore } from "../../hooks/useStore.ts";
import * as React from "react";
import { useTranslation } from "react-i18next";

export default function VillageSearchField() {
    const { t } = useTranslation();
    const fetchWeather = useStore(state => state.fetchWeather);
    const city = useStore(state => state.city);
    const setCity = useStore(state => state.setCity);

    useEffect(() => {
        if (!city.trim() || city.length < 2){
            return;
        }

        const handler = setTimeout(() => {
            fetchWeather(city);
        }, 800);
        return () => clearTimeout(handler);
    }, [fetchWeather, city]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCity(e.target.value);
    }

    return (
        <header>
            <h1 className={css.title}>Weather App</h1>
            <div className={css.searchBox}>
                <CiSearch className={css.searchIcon} size={24}/>
                <label>
                    <input aria-label={t('searchCity')}
                        className={css.searchField}
                        type="text"
                        value={city}
                        onChange={handleInputChange}
                        placeholder={t('enterCityName')}
                    />
                </label>
            </div>
        </header>
    )
}
