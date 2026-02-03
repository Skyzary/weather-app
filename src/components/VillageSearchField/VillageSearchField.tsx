import { useState, useEffect } from "react";
import css from "./VillageSearchField.module.css";
import { Glow, GlowCapture } from "@codaworks/react-glow";
interface VillageSearchFieldProps {
  onSearch: (villageName: string) => void;
}

export default function VillageSearchField({
  onSearch,
}: VillageSearchFieldProps) {
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
  };

  const handleSearch = () => {
    onSearch(villageName);
  };
  return (
    <div className={css.searchContainer}>
      <input
        className={css.searchField}
        type="text"
        value={villageName}
        onChange={handleInputChange}
        placeholder="Введите название города или деревни"
      />
      <GlowCapture>
        <Glow>
          <button onClick={handleSearch} className={css.searchBtn}>
            Поиск
          </button>
        </Glow>
      </GlowCapture>
    </div>
  );
}
