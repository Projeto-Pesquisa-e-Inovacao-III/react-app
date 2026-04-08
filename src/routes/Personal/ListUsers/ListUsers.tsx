import UsersTable from "../../../components/UsersTable/UsersTable";
import styles from "./ListUsers.module.css"
import useMobile from "../../../hooks/isMobile";
import classNames from "classnames";
import { listStudents } from "../../../constants/personal";
import useSearchFilter from "../../../hooks/useSearchFilter";
import InputWithIcon from "../../../components/Inputs/InputWithIcon/InputWithIcon";
import { SearchIcon } from "lucide-react";
import type { ListStudents } from "../../../models/students";
import { useInfinitePagination } from "../../../hooks/useInfinitePagination";



export default function ListUsers() {
    const isMobile = useMobile();

    const { data, isFetchingNextPage, loadMoreRef, isLoading } = useInfinitePagination<ListStudents[number]>({
        queryKey: ["students"],
        queryFn: async (page) => {
            const response = await listStudents(page);
            console.log("Full response:", response);
            console.log("response.data:", response.data);
            return response.data;
        }
    });

    console.log("data", data)


        const {
            filterSearch,
            setFilterSearch
        } = useSearchFilter(data ?? [], {
            searchName: (item: ListStudents[number]) => [item.nome],
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

            <UsersTable input={filterSearch} users={data ?? []} isLoading={isLoading} />

            <div ref={loadMoreRef} style={{ height: "20px", display: "flex", justifyContent: "center" }}>
                {isFetchingNextPage && <span>Carregando mais usuários...</span>}
            </div>
        </div>
    )
}