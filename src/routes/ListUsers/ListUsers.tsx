import UsersTable from "../../components/UsersTable/UsersTable";
import UserHeaderDesktop from "../../components/UserHeader/UserHeaderDesktop/UserHeaderDesktop";
import "./style.css"
import "./mobile.css"
import { useMediaQuery } from "@mui/material";
import UserHeaderMobile from "../../components/UserHeader/UserHeaderMobile/UserHeaderMobile";
import { useState } from "react";
import { SearchBar } from "../../components/SearchBar/SearchBar";

export default function ListUsers() {
    const isMobile = useMediaQuery("(max-width:1024px)");

    const Header = isMobile ? UserHeaderMobile : UserHeaderDesktop;

    const [pesquisa, setPesquisa] = useState("")

    return(
        <>
            {!isMobile && <Header type="personal"/>}
            <div className={`list-user-container${isMobile ? "-mobile" : ""}`}>
                <h1>Usuários</h1>
                <p>Lista de usuários assinantes.</p>
                <br/>
                <div className={`list-users-search-bar${isMobile ? "-mobile" : ""}`}>
                    <SearchBar search={pesquisa} setSearch={setPesquisa}/>
                </div>
                <br/>
                <UsersTable input={pesquisa}/>
            </div>
            {isMobile && <div className="header-mobile"><Header type="personal"/></div>}
        </>
    )
}