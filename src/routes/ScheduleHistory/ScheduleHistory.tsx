import { Dot, SearchIcon } from "lucide-react";
import InputWithIcon from "../../components/Inputs/InputWithIcon/InputWithIcon";
import classNames from "classnames";

import styles from "./ScheduleHistory.module.css";
import SmallerButton from "../../components/SmallerButton";
import InputCalendar from "../../components/Inputs/InputCalendar/InputCalendar";
import { useNavigate, useSearchParams } from "react-router-dom";
import RowWithHeaderTitle from "../../components/RowWithHeaderTitle/RowWithHeaderTitle";
import useSearchFilter from "../../hooks/useSearchFilter";
import { useQuery } from "@tanstack/react-query";
import { findUserAppointments } from "../../constants/schedule";
import type { Schedule } from "../../models/schedule";
import { format, parse } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function ScheduleHistory() {

    // postalCode does not exist at this endpoint
    const listOfAppointments = useQuery({
        queryKey: ['userAppointments'],
        queryFn: () => findUserAppointments(),
        select: (res) => res.data,
    })

    console.log("APPOINTMENTS HISTORY:", listOfAppointments.data);

    const [params] = useSearchParams()

    const parseDate = params.get("date") ? parse(params.get("date")!, "yyyy-MM-dd", new Date()) : undefined;

    console.log("SEARCH PARAMS:", params.get('date') ? format(params.get('date')!, 'dd-MM-yyyy') : 'No date parameter');

    const {
        filterSearch,
        setFilterSearch,
        filterInitialDate,
        setFilterInitialDate,
        filterFinalDate,
        setFilterFinalDate,
        filteredData,
        hasFilters,
        clearFilters,
    } = useSearchFilter(listOfAppointments.data ?? [], {
        searchName: (item) => [item.tipoAula, item.agendamentoStatus],
        dateFilter: (item) => item.data,
    });


    const data = filteredData.map((event) => ({
        id: event.agendamentoId,
        headerTitle: new Date(event.data).toLocaleString("pt-BR", { day: "2-digit", month: "long", year: "numeric" }),
        title: event.tipoAula,
        subtitle: event.agendamentoStatus !== "APROVADO" ?
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "8px" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <Dot color="#8BBE86" size={"30px"} />
                    <span>Status: Concluído</span>
                </div>
                <span>Endereço: {event.endereco.bairro}</span>
            </div>
            :
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "8px" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <Dot color="#D7AC00" size={"30px"} />
                    <span>Status: Pendente</span>
                </div>
                <span>Endereço: {event.endereco.bairro}</span>
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
                    />
                </div>
                <div className={styles.datePickerWrapper}>
                    <InputCalendar selectedDate={filterInitialDate} setSelectedDate={setFilterInitialDate} canGoPrev={true} paramData={params.get('date') ? format(parseDate!, 'dd/MM/yyyy', {locale: ptBR}) : undefined} />
                    <InputCalendar selectedDate={filterFinalDate} setSelectedDate={setFilterFinalDate} canGoPrev={true} paramData={params.get('date') ? format(parseDate!, 'dd/MM/yyyy', {locale: ptBR}) : undefined} />
                </div>
                {hasFilters && (
                    <div className={classNames(styles.searchButton)}>
                        <SmallerButton title="Limpar filtros" handleButtonClick={clearFilters} />
                    </div>
                )}
            </div>

            <RowWithHeaderTitle data={data} includeDetailsButton={true} buttonLabel="Ver Detalhes" handleDetailsClick={handleDetailsClick} />
        </div>
    );
}