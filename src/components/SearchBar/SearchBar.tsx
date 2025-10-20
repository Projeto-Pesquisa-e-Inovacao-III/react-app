import { useState } from "react";
import "./style.css";

export function SearchBar() {
    const [search, setSearch] = useState("");

    return (
        <div className="search-bar">
            <img src="/searchIcon.svg" alt="Pesquisar" className="search-icon" />
            <input
                type="text"
                placeholder="Pesquisar por nome"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="search-input"
            />
        </div>  
    );
}
