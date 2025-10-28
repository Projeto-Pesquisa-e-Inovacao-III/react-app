import UsersTable from "../../components/UsersTable/UsersTable";
import "./style.css"
import "./mobile.css"
import { useMediaQuery } from "@mui/material";
import { useState } from "react";
import { SearchBar } from "../../components/SearchBar/SearchBar";
import { LogoHeaderMobile } from "../../components/LogoHeaderMobile/LogoHeaderMobile";

export default function ListUsers() {
    const isMobile = useMediaQuery("(max-width:1024px)");

    const [pesquisa, setPesquisa] = useState("")

    return (
        <>
            {isMobile && <div className="logo-header-mobile">
                <LogoHeaderMobile />
            </div>}
            <div className={`list-user-container${isMobile ? "-mobile" : ""}`}>
                <h1>Usuários</h1>
                <p>Lista de usuários assinantes.</p>
                <br />
                <div className={`list-users-search-bar${isMobile ? "-mobile" : ""}`}>
                    <SearchBar search={pesquisa} setSearch={setPesquisa} />
                </div>
                <br />
                <UsersTable input={pesquisa} />
            </div>
        </>
    )
}