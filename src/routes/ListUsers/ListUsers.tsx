import UsersTable from "../../components/UsersTable/UsersTable";
import styles from "./style.module.css"
import { useMediaQuery } from "@mui/material";
import { useState } from "react";
import { SearchBar } from "../../components/SearchBar/SearchBar";

export default function ListUsers() {
    const isMobile = useMediaQuery("(max-width:1024px)");

    const [pesquisa, setPesquisa] = useState("")

    return (
        <div className={isMobile ? styles.listUserContainerMobile : styles.listUserContainer}>
            <h1>Usuários</h1>
            <p>Lista de usuários assinantes.</p>
            <br />
            <div className={isMobile ? styles.listUsersSearchBarMobile : styles.listUsersSearchBar}>
                <SearchBar search={pesquisa} setSearch={setPesquisa} />
            </div>
            <br />
            <UsersTable input={pesquisa} />
        </div>
    )
}