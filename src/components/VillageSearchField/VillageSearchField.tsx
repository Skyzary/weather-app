import { useEffect } from "react";
import css from "./VillageSearchField.module.css";
import { CiSearch } from "react-icons/ci";
import { useStore } from "../../hooks/useStore.ts";
import * as React from "react";

export default function VillageSearchField() {
    const fetchWeather = useStore(state => state.fetchWeather);
    const city = useStore(state => state.city);
    const setCity = useStore(state => state.setCity);

    useEffect(() => {
        if (!city.trim()){
            return;
        }
        const handler = setTimeout(() => {
            fetchWeather(city);
        }, 500);
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
                    <input aria-label={'Поиск города'}
                        className={css.searchField}
                        type="text"
                        value={city}
                        onChange={handleInputChange}
                        placeholder="Введите название города или деревни"
                    />
                </label>
            </div>
        </header>
    )
}
