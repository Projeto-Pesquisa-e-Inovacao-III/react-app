import { useState } from "react";
import "./style.css";
import { Search } from "lucide-react";
import InputWithIcon from "../AuthComponents/InputWithIcon";

//todo: so here, we dont have any svg saved locally. might get 
export function SearchBar() {
    const [search, setSearch] = useState("");

    return (
        <div className="search-bar">
            <InputWithIcon type="text" placeholder="Pesquisar por nome" onInputChange={setSearch} icon={<Search />} />
        </div>  
    );
}
