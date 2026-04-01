import UsersTable from "../../../components/UsersTable/UsersTable";
import styles from "./ListUsers.module.css"
import useMobile from "../../../hooks/isMobile";
import classNames from "classnames";
import { listStudents } from "../../../constants/personal";
import useSearchFilter from "../../../hooks/useSearchFilter";
import InputWithIcon from "../../../components/Inputs/InputWithIcon/InputWithIcon";
import { SearchIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { ListStudents } from "../../../models/students";
import { useInfinitePagination } from "../../../hooks/useInfinitePagination";



export default function ListUsers() {
    const isMobile = useMobile();

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, loadMoreRef, isLoading } = useInfinitePagination<ListStudents[number]>({
        queryKey: ["students"],
        queryFn: async (page) => {
            const { data } = await listStudents(page);
            console.log("API response:", data);
            return data;
        }
    });

    const { filteredData, filterSearch, setFilterSearch } = useSearchFilter(data ?? [], {
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
            <UsersTable input={filterSearch} users={filteredData} isLoading={isLoading} />

            {/* TBD: Make sure this element is at the end of the scrolling list! */}
            <div ref={loadMoreRef} style={{ height: "20px", display: "flex", justifyContent: "center" }}>
                {isFetchingNextPage && <span>Carregando mais usuários...</span>}
            </div>
        </div>
    )
}