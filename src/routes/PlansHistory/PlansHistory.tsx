import { useState, useRef, useEffect } from "react";
import { SearchIcon, Calendar } from "lucide-react";
import InputWithIcon from "../../components/Inputs/InputWithIcon/InputWithIcon";
import classNames from "classnames";

import styles from "./PlansHistory.module.css";
import { useNavigate } from "react-router-dom";
import RowWithHeaderTitle from "../../components/RowWithHeaderTitle/RowWithHeaderTitle";
import { getUserPlansHistory } from "../../constants/products";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { usePagination } from "../../hooks/usePagination";
import PaginatedList from "../../components/PaginatedList/PaginatedList";
import SmallerButton from "../../components/SmallerButton/SmallerButton";
import CalendarMini, { type DateRange } from "../../components/Calendars/MiniCalendar/CalendarMini";
import useClickOutside from "../../hooks/useClickOutside";
import { useQuery } from "@tanstack/react-query";

type UserPlan = {
    id: number;
    dataCompra: string;
    produtoExibicao: {
        titulo: string;
        subtitulo: string;
    };
};


export default function PlansHistory() {
    const nav = useNavigate();

    function handleDetailsClick(id: number) {
        nav('/plans-history-details?id=' + id);
    }

    const [filterSearch, setFilterSearch] = useState<string>("");
    const [debouncedSearch, setDebouncedSearch] = useState<string>("");
    const [selectedDateRange, setSelectedDateRange] = useState<DateRange>({ start: "", end: "" });
    const [openCalendar, setOpenCalendar] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(filterSearch);
        }, 700);

        return () => clearTimeout(timer);
    }, [filterSearch]);

    const calendarRef = useRef<HTMLDivElement>(null);

    useClickOutside({
        ref: calendarRef,
        callback: () => setOpenCalendar(false)
    });

    const { page, goToPage, animClass } = usePagination(0);

    const { data: response, isLoading } = useQuery({
        queryKey: ["user-plans", page, debouncedSearch, selectedDateRange?.start, selectedDateRange?.end],
        queryFn: () => getUserPlansHistory(
            page,
            "10",
            selectedDateRange?.start && selectedDateRange?.end? format(selectedDateRange?.start, "yyyy-MM-dd'T'HH:mm:ss") : undefined,
            selectedDateRange?.end && selectedDateRange?.start? format(selectedDateRange?.end, "yyyy-MM-dd'T'HH:mm:ss") : undefined,
            debouncedSearch || undefined
        ),
    });

    const dataList: UserPlan[] = response?.data?.content ?? [];
    const pagination = response?.data?.page ?? null;

    const hasFilters = !!(filterSearch || selectedDateRange?.start || selectedDateRange?.end);

    function clearFilters() {
        setFilterSearch("");
        setSelectedDateRange({ start: "", end: "" });
    }

    return (
        <div className={classNames(styles.container)}>
            <div className={classNames(styles.title)}>
                <h1>Histórico de Compras</h1>

            </div>

            <div className={classNames(styles.search)}>
                <div className={classNames(styles.searchInput)}>
                    <InputWithIcon
                        type="text"
                        placeholder="Buscar..."
                        icon={<SearchIcon />}
                        value={filterSearch}
                        onInputChange={setFilterSearch}
                        classNameInput="!rounded-lg"
                    />
                </div>
                <div ref={calendarRef} className={styles.calendarWrapper}>
                    <Calendar
                        color={`${selectedDateRange?.start && selectedDateRange?.end ? "#093a5d" : "#707070"}`}
                        className={styles.calendarIcon}
                        onClick={() => setOpenCalendar(!openCalendar)}
                    />
                    {openCalendar && (
                        <div className={styles.calendarDropdown}>
                            <CalendarMini
                                dateRange={true}
                                selectedDateRange={selectedDateRange}
                                setSelectedDateRange={setSelectedDateRange}
                            />
                            {selectedDateRange?.start && selectedDateRange?.end && (
                                <SmallerButton
                                    title="Resetar filtro"
                                    handleButtonClick={() => {
                                        if (setSelectedDateRange) {
                                            setSelectedDateRange({ start: "", end: "" });
                                        }
                                        setOpenCalendar(false);
                                    }}
                                    classname="mt-2"
                                />
                            )}
                        </div>
                    )}
                </div>
                {hasFilters && (
                    <div className={classNames(styles.searchButton)}>
                        <SmallerButton title="Limpar filtros" handleButtonClick={clearFilters} />
                    </div>
                )}
            </div>

            <PaginatedList
                key={page}
                page={page}
                animClass={animClass}
                pagination={pagination}
                onPageChange={goToPage}
            >
                {dataList && dataList.length > 0 ? (
                    dataList.sort((a, b) => a.dataCompra.localeCompare(b.dataCompra)).map((item) => (
                        <RowWithHeaderTitle
                            key={item.id}
                            data={[
                                {
                                    headerTitle: format(parseISO(item.dataCompra), "dd 'de' MMMM 'de' yyyy", { locale: ptBR }),
                                    title: item.produtoExibicao.titulo,
                                    subtitle: item.produtoExibicao.subtitulo,
                                    id: item.id
                                }
                            ]}
                            includeDetailsButton={true}
                            buttonLabel="Ver Detalhes"
                            handleDetailsClick={() => handleDetailsClick(item.id)}
                            isLoading={isLoading}
                        />
                    ))
                ) : isLoading ? (
                    [...Array(1)].map((_, index) => (
                        <RowWithHeaderTitle
                            key={`skeleton-${index}`}
                            data={[{ headerTitle: '', title: '', subtitle: '', id: index }]}
                            isLoading={true}
                        />
                    ))
                ) : null}
            </PaginatedList>

            {dataList.length === 0 && !isLoading && (
                <div className="flex justify-center items-center mt-10 my-5 gap-5">
                    <span className="flex items-center justify-center w-full h-1 bg-gray-400"></span>
                    <span className="text-slate-500 w-1/2 text-center">Não há planos para exibir</span>
                    <span className="flex items-center justify-center w-full h-1 bg-gray-400"></span>
                </div>
            )}

        </div>
    );
}