import UsersTable from "../../components/UsersTable/UsersTable";
import styles from "./ListUsers.module.css"
import { useEffect, useState } from "react";
import { SearchBar } from "../../components/SearchBar/SearchBar";
import useMobile from "../../hooks/isMobile";
import classNames from "classnames";
import { listStudents } from "../../constants/personal";

export default function ListUsers() {
    const isMobile = useMobile();


    const [pesquisa, setPesquisa] = useState("")

    function fetchUsers() {
        listStudents()
            .then(response => {
                console.log(response.data);
                setUsers(response.data);
            }).catch(error => {
                console.error("Error fetching users:", error);
            });
    }

    const [users, setUsers] = useState([
        { nome: "João Silva", idade: 25 },
        { nome: "Maria Souza", idade: 30 },
        { nome: "Pedro Oliveira", idade: 22 }
    ]);

    useEffect(() => {
        fetchUsers();
    }, [])

    return (
        <div className={classNames(styles.listUserContainer, { [styles.listUserContainerMobile]: isMobile })}>
            <h1>Usuários</h1>
            <p>Lista de usuários assinantes.</p>
            <br />
            <div className={classNames(styles.listUsersSearchBar, { [styles.listUsersSearchBarMobile]: isMobile })}>
                <SearchBar search={pesquisa} setSearch={setPesquisa} />
            </div>
            <br />
            <UsersTable input={pesquisa} users={users} />
        </div>
    )
}