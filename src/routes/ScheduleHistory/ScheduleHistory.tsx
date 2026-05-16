import { useState, useRef, useEffect } from "react";
import { Dot, SearchIcon, Calendar } from "lucide-react";
import InputWithIcon from "../../components/Inputs/InputWithIcon/InputWithIcon";
import classNames from "classnames";

import styles from "./ScheduleHistory.module.css";
import SmallerButton from "../../components/SmallerButton/SmallerButton";
import CalendarMini, { type DateRange } from "../../components/Calendars/MiniCalendar/CalendarMini";
import useClickOutside from "../../hooks/useClickOutside";
import { useNavigate, useSearchParams } from "react-router-dom";
import RowWithHeaderTitle from "../../components/RowWithHeaderTitle/RowWithHeaderTitle";
import { findPersonalRequests } from "../../constants/schedule";
import type { ScheduleAfterInserted } from "../../models/schedule";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { usePagination } from "../../hooks/usePagination";
import PaginatedList from "../../components/PaginatedList/PaginatedList";

export default function ScheduleHistory() {

    // postalCode does not exist at this endpoint
    // const listOfAppointments = useQuery({
    //     queryKey: ['userAppointments'],
    //     queryFn: () => findPersonalRequests(0),
    //     select: (res) => res.data,
    // })

    const [params] = useSearchParams()

    // const parseDate = params.get("date") ? parse(params.get("date")!, "yyyy-MM-dd", new Date()) : undefined;


    const navigate = useNavigate();

    function clearDateParam() {
        params.delete("date");
        navigate("/schedule-history");
        clearFilters();
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

    const { data: response, isLoading: filteredDataIsLoading } = useQuery({
        queryKey: ["scheduleHistoryPaginated", page, debouncedSearch, selectedDateRange?.start, selectedDateRange?.end],
        queryFn: () => findPersonalRequests(
            page,
            "10",
            selectedDateRange?.start ? format(selectedDateRange?.start, "yyyy-MM-dd'T'HH:mm:ss") : undefined,
            selectedDateRange?.end ? format(selectedDateRange?.end, "yyyy-MM-dd'T'HH:mm:ss") : undefined,
            undefined,
            undefined,
            debouncedSearch || undefined,
        ),
    });

    const appointmentsList = response?.data?.content ?? [];
    const pagination = response?.data?.page ?? null;

    const hasFilters = !!(filterSearch || selectedDateRange?.start || selectedDateRange?.end);

    function clearFilters() {
        setFilterSearch("");
        setSelectedDateRange({ start: "", end: "" });
    }



    const data = (appointmentsList as ScheduleAfterInserted[]).map((event) => ({
        id: event.agendamentoId,
        headerTitle: new Date(event.dataInicio).toLocaleString("pt-BR", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }),
        title: event.tipoAula,
        subtitle: event.status &&
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "8px" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                    {event.status === "CONCLUIDO" &&
                        <>
                            <Dot color="#8BBE86" size={"30px"} />
                            <span>Status: Concluído</span>
                        </>
                    }

                    {(event.status === "PENDENTE_PERSONAL_CONCLUIR") && (
                        <>
                            <Dot color="#D7AC00" size={"30px"} />
                            <span>Status: pendente</span>
                        </>
                    )}

                    {(event.status === "APROVADO") && (
                        <>
                            <Dot color="#D7AC00" size={"30px"} />
                            <span>Status: marcado</span>
                        </>
                    )}


                    {(event.status === "PENDENTE_PERSONAL_APROVACAO" || event.status === "PENDENTE_CLIENTE_APROVACAO") &&
                        <>
                            <Dot color="#D7AC00" size={"30px"} />
                            <span>Status: em análise</span>
                        </>
                    }

                    {event.status.includes("CANCELADO") &&
                        <>
                            <Dot color="#c33" size={"30px"} />
                            <span>Status: cancelado</span>
                        </>
                    }

                    {(event.status === "AUSENCIA_CLIENTE" || event.status === "AUSENCIA_PERSONAL") && (
                        <>
                            <Dot color="#c33" size={"30px"} />
                            <span>Status: Ausência registrada</span>
                        </>
                    )}

                </div>
                <span>Endereço: {event.endereco.cep.logradouro}, {event.endereco.numero} - {event.endereco.cep.bairro}</span>
            </div>
    }));

    const nav = useNavigate();

    function handleDetailsClick(id: number) {
        nav('/schedule-details/?id=' + id);
    }

    return (
        <div className={classNames(styles.container)}>
            <div className={classNames(styles.title)}>
                <h1>Histórico de Agendamentos</h1>
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
                                    classname="absolute bottom-8"
                                />
                            )}
                        </div>
                    )}
                </div>
                {hasFilters && (
                    <div className={classNames(styles.searchButton)}>
                        <SmallerButton title="Limpar filtros" handleButtonClick={clearDateParam} />
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
                <RowWithHeaderTitle data={data} includeDetailsButton={true} buttonLabel="Ver Detalhes" handleDetailsClick={handleDetailsClick} isLoading={filteredDataIsLoading} />
            </PaginatedList>

            {appointmentsList.length === 0 && !filteredDataIsLoading && (
                <div className="flex justify-center items-center mt-10 my-5 gap-5">
                    <span className="flex items-center justify-center w-full h-1 bg-gray-400"></span>
                    <span className="text-slate-500 w-1/2 text-center">Não há agendamentos para exibir</span>
                    <span className="flex items-center justify-center w-full h-1 bg-gray-400"></span>
                </div>
            )}

        </div>
    );
}