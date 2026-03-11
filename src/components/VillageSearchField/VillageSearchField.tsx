import { useState, useEffect } from "react";
import css from "./VillageSearchField.module.css";
import { GlassInput } from "@mawtech/glass-ui"
import { FaSearch } from "react-icons/fa";

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
      <GlassInput
        className={css.searchField}
       inputSize='md'
        type="text"
        value={villageName}
        onChange={handleInputChange}
        rightIcon={<FaSearch onClick={handleSearch} className={css.searchIcon} size={'35px'} /> }
        placeholder="Введите название города или деревни"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
      />
  );
}
