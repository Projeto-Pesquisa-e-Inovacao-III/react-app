import UsersTable from "../../../components/UsersTable/UsersTable";
import styles from "./ListUsers.module.css"
import useMobile from "../../../hooks/isMobile";
import classNames from "classnames";
import { listStudents } from "../../../constants/personal";
import useSearchFilter from "../../../hooks/useSearchFilter";
import InputWithIcon from "../../../components/Inputs/InputWithIcon/InputWithIcon";
import { SearchIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function ListUsers() {
    const isMobile = useMobile();

    const users = useQuery({
        queryKey: ["students"],
        queryFn: async () => {
            const response = await listStudents();
            return response.data;
        }
    });

    console.log(users.data);

    const { filteredData, filterSearch, setFilterSearch } = useSearchFilter(users.data ?? [], {
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
            <UsersTable input={filterSearch} users={filteredData} isLoading={users.isLoading} />
        </div>
    )
}