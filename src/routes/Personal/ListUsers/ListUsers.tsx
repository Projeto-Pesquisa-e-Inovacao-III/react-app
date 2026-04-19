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
import { useState, useEffect, useContext } from "react";
import { TypeContext } from "../../../App";

export default function ListUsers() {
    const isMobile = useMobile();

    const type = useContext(TypeContext);

    const { page, goToPage, animClass } = usePagination(0);

    const [filterSearch, setFilterSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(filterSearch);
        }, 700);

        return () => clearTimeout(timer);
    }, [filterSearch]);

    const { data: response, isLoading } = useQuery({
        queryKey: ["students", page, debouncedSearch],
        queryFn: () =>
            debouncedSearch.trim()
                ? searchStudent(page, 10, debouncedSearch)
                : listStudents(page, 10),
        enabled: !type?.type?.includes("aluno"),
    });

    const students = response?.data?.content ?? [];
    const pagination = response?.data?.page ?? null;

    // const { data: responseAdmin, isLoading: isLoadingAdmin } = useQuery({
    //     queryKey: ["students", page, debouncedSearch],
    //     queryFn: () =>
    //         debouncedSearch.trim()
    //             ? searchUsers(page, 10, debouncedSearch)
    //             : listUsers(page, 10),
    //     enabled: type === "admin",
    // });

    // const users = type === "personal" ? response?.data?.content : responseAdmin?.data?.content;
    // const pagination = type === "personal" ? response?.data?.page : responseAdmin?.data?.page;
    // const isLoading = type === "personal" ? isLoading : isLoadingAdmin;

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