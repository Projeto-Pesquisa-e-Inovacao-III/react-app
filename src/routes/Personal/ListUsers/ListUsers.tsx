import UsersTable from "../../../components/UsersTable/UsersTable";
import styles from "./ListUsers.module.css"
import useMobile from "../../../hooks/isMobile";
import classNames from "classnames";
import { listStudents } from "../../../constants/personal";
import useSearchFilter from "../../../hooks/useSearchFilter";
import InputWithIcon from "../../../components/Inputs/InputWithIcon/InputWithIcon";
import { SearchIcon } from "lucide-react";
import type { ListStudents } from "../../../models/students";
import { useQuery } from "@tanstack/react-query";
import { usePagination } from "../../../hooks/usePagination";
import PaginatedList from "../../../components/PaginatedList/PaginatedList";

export default function ListUsers() {
    const isMobile = useMobile();

    const { page, goToPage, animClass } = usePagination(0);

    const { data: response, isLoading } = useQuery({
        queryKey: ["students", page],
        queryFn: () => listStudents(page, 10),
    });

    const students: ListStudents = response?.data?.content ?? [];
    const pagination = response?.data?.page ?? null;

    const { filterSearch, setFilterSearch } = useSearchFilter(students, {
        searchName: (item: ListStudents[number]) => [item.nome],
    });

    return (
        <div className={classNames(styles.listUserContainer, { [styles.listUserContainerMobile]: isMobile })}>
            <h1>Usuários</h1>
            <div className={classNames(styles.listUsersSearchBar, { [styles.listUsersSearchBarMobile]: isMobile })}>
                <InputWithIcon
                    type="text"
                    placeholder="Buscar..."
                    icon={<SearchIcon />}
                    value={filterSearch}
                    onInputChange={setFilterSearch}
                />
            </div>

            <PaginatedList
                key={page}
                page={page}
                animClass={animClass}
                pagination={pagination}
                onPageChange={goToPage}
            >
                <UsersTable input={filterSearch} users={students} isLoading={isLoading} />
            </PaginatedList>
        </div>
    )
}