import "./style.css";
import { Search } from "lucide-react";
import InputWithIcon from "../Inputs/InputWithIcon/InputWithIcon";

export function SearchBar({search, setSearch}) {
    return (
        <div className="search-bar">
            <img src="/searchIcon.png" alt="Pesquisar" className="search-icon" />
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
