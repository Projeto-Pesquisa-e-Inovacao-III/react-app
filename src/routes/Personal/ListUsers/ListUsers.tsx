import UsersTable from "../../../components/UsersTable/UsersTable";
import styles from "./ListUsers.module.css"
import { useEffect, useState } from "react";
import { SearchBar } from "../../../components/SearchBar/SearchBar";
import useMobile from "../../../hooks/isMobile";
import classNames from "classnames";
import { listStudents } from "../../../constants/personal";
import useSearchFilter from "../../../hooks/useSearchFilter";
import InputWithIcon from "../../../components/Inputs/InputWithIcon/InputWithIcon";
import { SearchIcon } from "lucide-react";

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

    const { filteredData, filterSearch, setFilterSearch } = useSearchFilter(users, {
        searchName: (item) => [item.nome],
    });


    return (
        <div className={classNames(styles.listUserContainer, { [styles.listUserContainerMobile]: isMobile })}>
            <h1>Usuários</h1>
            {/* <p>Lista de usuários assinantes.</p> */}
            <div className={classNames(styles.listUsersSearchBar, { [styles.listUsersSearchBarMobile]: isMobile })}>
                <InputWithIcon
                    type="text"
                    placeholder="Buscar..."
                    icon={<SearchIcon />}
                    value={filterSearch}
                    onInputChange={setFilterSearch}
                />
            </div>
            <UsersTable input={filterSearch} users={filteredData} />
        </div>
    )
}