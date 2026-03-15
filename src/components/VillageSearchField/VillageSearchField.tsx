import { useState, useEffect } from "react";
import css from "./VillageSearchField.module.css";
import { CiSearch } from "react-icons/ci";
import {useStore} from "../../hooks/useStore.ts";


export default function VillageSearchField() {
    const {fetchWeather} = useStore()
    const [villageName, setVillageName] = useState("");
    useEffect(() => {
        const savedVillageName = localStorage.getItem("villageName");
        if (savedVillageName) {
            setVillageName(savedVillageName);
        }
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVillageName(e.target.value);
        localStorage.setItem("villageName", e.target.value);
        setTimeout(() => {
            fetchWeather(e.target.value);
        }, 500);
    };


    return (
        <div className={css.searchBox}>
            <CiSearch className={css.searchIcon} size={24}/>
            <input
                className={css.searchField}
                type="text"
                value={villageName}
                onChange={(e) => handleInputChange(e)}
                placeholder="Введите название города или деревни"

            />
        </div>
    );

}
