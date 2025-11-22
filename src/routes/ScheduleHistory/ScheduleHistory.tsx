import { Dot, SearchIcon } from "lucide-react";
import InputWithIcon from "../../components/Inputs/InputWithIcon/InputWithIcon";
import classNames from "classnames";

import styles from "./ScheduleHistory.module.css";
import SmallerButton from "../../components/SmallerButton";
import InputCalendar from "../../components/Inputs/InputCalendar/InputCalendar";
import { useNavigate } from "react-router-dom";
import RowWithHeaderTitle from "../../components/RowWithHeaderTitle/RowWithHeaderTitle";
import useSearchFilter from "../../hooks/useSearchFilter";

export default function ScheduleHistory() {
    // const [initialDateFilter, setInitialDateFilter] = useState<string>("");
    // const [finalDateFilter, setFinalDateFilter] = useState<string>("");

    const eventsMock = [
        { id: 0, title: "Funcional", date: "2025-11-11T00:00:00", hour: "11:00:00", address: "Rua A, 123", status: "concluido" },
        { id: 0, title: "Funcional", date: "2025-11-11T00:00:00", hour: "11:00:00", address: "Rua A, 123", status: "concluido" },
        { id: 1, title: "Personal", date: "2025-11-21T00:00:00", hour: "10:00:00", address: "Rua B, 456", status: "pendente" },
    ];

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
    } = useSearchFilter(eventsMock, {
        searchName: (item) => [item.title, item.status],
        dateFilter: (item) => item.date,
    });


    const data = filteredData.map((event) => ({
        headerTitle: new Date(event.date).toLocaleString("pt-BR", { day: "2-digit", month: "long", year: "numeric" }),
        title: event.title,
        subtitle: event.status === "concluido" ?
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "8px" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <Dot color="#8BBE86" size={"30px"} />
                    <span>Status: Concluído</span>
                </div>
                <span>Endereço: {event.address}</span>
            </div>
            :
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "8px" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <Dot color="#D7AC00" size={"30px"} />
                    <span>Status: Pendente</span>
                </div>
                <span>Endereço: {event.address}</span>
            </div>
    }));

    const nav = useNavigate();

    function handleDetailsClick() {
        nav('/schedule-details');
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
                    <InputCalendar selectedDate={filterInitialDate} setSelectedDate={setFilterInitialDate} canGoPrev={true} />
                    <InputCalendar selectedDate={filterFinalDate} setSelectedDate={setFilterFinalDate} canGoPrev={true} />
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