<<<<<<< HEAD
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
=======
import { Search } from "lucide-react"
import InputWithIcon from "../AuthComponents/InputWithIcon"
import "./style.css"
import "./mobile.css"
import { useMediaQuery } from "@mui/material";

export default function SearchBar(props){
    const isMobile = useMediaQuery("(max-width:1024px)");

    return(
        <div className={`search-bar${isMobile ? "-mobile" : ""}`}>
            <InputWithIcon
            type={"text"}
            icon={<Search/>}
            placeholder={"Pesquisar por nome"}
            onInputChange={props.onInputChange}/>
        </div>
    )
}
>>>>>>> 2727715a7c272b18b94f7bfec33e58c919c6bfc4
