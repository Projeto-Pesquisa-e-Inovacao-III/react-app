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