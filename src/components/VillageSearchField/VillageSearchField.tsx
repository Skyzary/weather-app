import { useState, useEffect } from "react";
import css from "./VillageSearchField.module.css";
import { CiSearch } from "react-icons/ci";
import {useStore} from "../../hooks/useStore.ts";
import * as React from "react";


export default function VillageSearchField() {
    const fetchWeather = useStore(state => state.fetchWeather)
    const [villageName, setVillageName] = useState(() => {
        const savedVillageName = localStorage.getItem("villageName");
        return savedVillageName || "";
    });
    useEffect(() => {
        if (!villageName.trim()){
            localStorage.setItem("villageName", "")
            return
        }
        const handler = setTimeout(() => {
            fetchWeather(villageName)
        }, 500);
        return () => clearTimeout(handler)
    }, [fetchWeather, villageName]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVillageName(e.target.value);
    }


    return (
        <header>
            <h1 className={css.title}>Weather App</h1>
            <div className={css.searchBox}>
                <CiSearch className={css.searchIcon} size={24}/>
                <label aria-label={'Поиск города'}>
                    <input
                        className={css.searchField}
                        type="text"
                        value={villageName}
                        onChange={handleInputChange}
                        placeholder="Введите название города или деревни"

                    />
                </label>
            </div>
        </header>
    )
}

