import UsersTable from "../../../components/UsersTable/UsersTable";
import styles from "./ListUsers.module.css"
import useMobile from "../../../hooks/isMobile";
import classNames from "classnames";
import { listStudents, searchStudent } from "../../../constants/personal";
import InputWithIcon from "../../../components/Inputs/InputWithIcon/InputWithIcon";
import { SearchIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { usePagination } from "../../../hooks/usePagination";
import PaginatedList from "../../../components/PaginatedList/PaginatedList";
import { useState } from "react";

export default function ListUsers() {
    const isMobile = useMobile();

    const { page, goToPage, animClass } = usePagination(0);

    const [filterSearch, setFilterSearch] = useState("");

    const { data: response, isLoading } = useQuery({
        queryKey: ["students", page, filterSearch],
        queryFn: () =>
            filterSearch.trim()
                ? searchStudent(page, 10, filterSearch)
                : listStudents(page, 10),
    });

    const students = response?.data?.content ?? [];
    const pagination = response?.data?.page ?? null;

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