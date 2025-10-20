import SearchBar from "../../components/SearchBar/SearchBar";
import UsersTable from "../../components/UsersTable/UsersTables";
import UserHeaderDesktop from "../../components/UserHeader/UserHeaderDesktop/UserHeaderDesktop";
import "./style.css"
import "./mobile.css"
import { useMediaQuery } from "@mui/material";
import UserHeaderMobile from "../../components/UserHeader/UserHeaderMobile/UserHeaderMobile";
import { useState } from "react";

export default function ListUsers() {
    const isMobile = useMediaQuery("(max-width:1024px)");

    const Header = isMobile ? UserHeaderMobile : UserHeaderDesktop;

    const [pesquisa, setPesquisa] = useState("")

    return(
        <>
            {!isMobile && <Header />}
            <div className={`list-user-container${isMobile ? "-mobile" : ""}`}>
                <h1>Usuários</h1>
                <p>Lista de usuários assinantes.</p>
                <br/>
                <SearchBar onInputChange={setPesquisa}/>
                <br/>
                <UsersTable input={pesquisa}/>
            </div>
            {isMobile && <div className="header-mobile"><Header /></div>}
        </>
    )
}