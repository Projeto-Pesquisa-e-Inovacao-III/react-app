import { Dot, SearchIcon } from "lucide-react";
import InputWithIcon from "../../components/Inputs/InputWithIcon/InputWithIcon";
import classNames from "classnames";

import styles from "./ScheduleHistory.module.css";
import SmallerButton from "../../components/SmallerButton";
import { useEffect, useState } from "react";
import InputCalendar from "../../components/Inputs/InputCalendar/InputCalendar";
import { useNavigate } from "react-router-dom";
import RowWithHeaderTitle from "../../components/RowWithHeaderTitle/RowWithHeaderTitle";

export default function ScheduleHistory() {
    const [initialDateFilter, setInitialDateFilter] = useState<string>("");
    const [finalDateFilter, setFinalDateFilter] = useState<string>("");

    useEffect(() => {
        console.log("Filtro de data inicial:", initialDateFilter);
    }, [initialDateFilter]);

    useEffect(() => {
        console.log("Filtro de data final:", finalDateFilter);
    }, [finalDateFilter]);

    const eventsMock = [
        { id: 0, title: "Funcional", date: "2025-10-11", hour: "11:00:00", address: "Rua A, 123", status: "completed" },
        { id: 1, title: "Personal", date: "2025-10-22", hour: "10:00:00", address: "Rua B, 456", status: "pending" },
    ];

    const data = eventsMock.map((event) => ({
        headerTitle: new Date(event.date).toLocaleString("pt-BR", { day: "2-digit", month: "long", year: "numeric" }),
        title: event.title,
        subtitle: event.status === "completed" ?
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
        nav('/plans-history-details');
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
                    />
                </div>
                <div className={styles.datePickerWrapper}>
                    <InputCalendar selectedDate={initialDateFilter} setSelectedDate={setInitialDateFilter} />
                    <InputCalendar selectedDate={finalDateFilter} setSelectedDate={setFinalDateFilter} />
                </div>
                <div className={classNames(styles.searchButton)}>
                    <SmallerButton title="Filtrar" />
                </div>
            </div>

            <RowWithHeaderTitle data={data} includeDetailsButton={true} buttonLabel="Ver Detalhes" handleDetailsClick={handleDetailsClick} />
        </div>
    );
}