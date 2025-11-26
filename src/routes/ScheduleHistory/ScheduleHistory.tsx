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
import { findPersonalRequests, findUserAppointments } from "../../constants/schedule";
import type { Schedule } from "../../models/schedule";
import { format, parse } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function ScheduleHistory() {

    // postalCode does not exist at this endpoint
    const listOfAppointments = useQuery({
        queryKey: ['userAppointments'],
        queryFn: () => findPersonalRequests(),
        select: (res) => res.data,
    })

    const [params] = useSearchParams()

    const parseDate = params.get("date") ? parse(params.get("date")!, "yyyy-MM-dd", new Date()) : undefined;

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
    } = useSearchFilter(listOfAppointments.data?.content ?? [], {
        searchName: (item) => [item.tipoAula, item.status],
        dateFilter: (item) => item.dataInicio,
    });


    const data = filteredData.map((event) => ({
        id: event.agendamentoId,
        headerTitle: new Date(event.dataInicio).toLocaleString("pt-BR", { day: "2-digit", month: "long", year: "numeric" }),
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

                    {event.status === "APROVADO" || event.status === "PENDENTE_PERSONAL_CONCLUIR" &&
                        <>
                            <Dot color="#D7AC00" size={"30px"} />
                            <span>Status: pendente</span>
                        </>
                    }

                    {event.status.includes("CANCELADO") &&
                        <>
                            <Dot color="#c33" size={"30px"} />
                            <span>Status: cancelado</span>
                        </>
                    }

                    {
                        event.status === "AUSENCIA_CLIENTE" || event.status === "AUSENCIA_PERSONAL" &&
                        <>
                            <Dot color="#c33" size={"30px"} />
                            <span>Status: Ausência registrada</span>
                        </>
                    }
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
                    />
                </div>
                <div className={styles.datePickerWrapper}>
                    <InputCalendar selectedDate={filterInitialDate} setSelectedDate={setFilterInitialDate} canGoPrev={true} paramData={params.get('date') ? format(parseDate!, 'dd/MM/yyyy', { locale: ptBR }) : undefined} />
                    <InputCalendar selectedDate={filterFinalDate} setSelectedDate={setFilterFinalDate} canGoPrev={true} paramData={params.get('date') ? format(parseDate!, 'dd/MM/yyyy', { locale: ptBR }) : undefined} />
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