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
import { getUsers } from "../../../constants/admin";
import Select from "../../../components/Select/Select";

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


    const [students, setStudents] = useState<[]>([]);

    const { data: response, isLoading } = useQuery({
        queryKey: ["students", page, debouncedSearch],
        queryFn: () =>
            debouncedSearch.trim()
                ? searchStudent(page, 10, debouncedSearch)
                : listStudents(page, 10),
        enabled: !!type?.type && type?.type?.includes("personal") && !type?.type?.includes("admin")
    });

    useEffect(() => {
        if (response?.data?.content) {
            setStudents(response.data.content);
        }
    }, [response]);

    const pagination = response?.data?.page ?? null;
    
    const [filterRole, setFilterRole] = useState<string>("");

    const { data: responseAdmin, isLoading: isLoadingAdmin } = useQuery({
        queryKey: ["users", page, debouncedSearch, filterRole],
        queryFn: () => getUsers(page, 10, debouncedSearch.trim(), undefined, filterRole || undefined),
        enabled: type?.type?.includes("admin"),
    });

    const users = responseAdmin?.data?.content ?? [];
    const paginationAdmin = responseAdmin?.data?.page ?? null;

    const [openSelectId, setOpenSelectId] = useState<string | null>(null);


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
                {type?.type?.includes("admin") && (
                    <Select
                        onSelectStatusChange={setFilterRole}
                        selectStatusValue={filterRole}
                        selectPlaceholder="Filtrar por role"
                        values={[
                            { label: "Aluno", value: "ALUNO" },
                            { label: "Personal", value: "PERSONAL" },
                            { label: "Admin", value: "ADMIN" },
                        ]}
                        setOpenSelectId={setOpenSelectId}
                        openSelectId={openSelectId}
                        id="role"
                        showSearchInput={false}
                    />
                )}
            </div>

            <PaginatedList
                key={page}
                page={page}
                animClass={animClass}
                pagination={type?.type?.includes("admin") ? paginationAdmin : pagination}
                onPageChange={goToPage}
            >
                <UsersTable input={filterSearch} users={type?.type?.includes("admin") ? users : students} isLoading={type?.type?.includes("admin") ? isLoadingAdmin : isLoading} />
            </PaginatedList>
        </div>
    )
}