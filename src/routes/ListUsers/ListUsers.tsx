import UsersTable from "../../components/UsersTable/UsersTable";
import styles from "./ListUsers.module.css"
import { useMediaQuery } from "@mui/material";
import { useState } from "react";
import { SearchBar } from "../../components/SearchBar/SearchBar";
import useMobile from "../../hooks/isMobile";
import classNames from "classnames";

export default function ListUsers() {
    const isMobile = useMobile();


    const [pesquisa, setPesquisa] = useState("")

    return (
        <div className={classNames(styles.listUserContainer, { [styles.listUserContainerMobile]: isMobile })}>
            <h1>Usuários</h1>
            <p>Lista de usuários assinantes.</p>
            <br />
            <div className={classNames(styles.listUsersSearchBar, { [styles.listUsersSearchBarMobile]: isMobile })}>
                <SearchBar search={pesquisa} setSearch={setPesquisa} />
            </div>
            <br />
            <UsersTable input={pesquisa} />
        </div>
    )
}