import { SearchIcon } from "lucide-react";
import InputWithIcon from "../../components/Inputs/InputWithIcon/InputWithIcon";
import classNames from "classnames";

import styles from "./PlansHistory.module.css";
import SmallerButton from "../../components/SmallerButton";
import { PlansHistoryMock } from "./mocks/PlansHistoryMock";
import { useState } from "react";
import InputCalendar from "../../components/Inputs/InputCalendar/InputCalendar";
import { useNavigate } from "react-router-dom";
import RowWithHeaderTitle from "../../components/RowWithHeaderTitle/RowWithHeaderTitle";

export default function PlansHistory() {
    const [initialDateFilter, setInitialDateFilter] = useState<string>("");
    const [finalDateFilter, setFinalDateFilter] = useState<string>("");

    const nav = useNavigate();

    function handleDetailsClick() {
        nav('/plans-history-details');
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

            <RowWithHeaderTitle data={PlansHistoryMock} includeDetailsButton={true} buttonLabel="Ver Detalhes" handleDetailsClick={handleDetailsClick} />
        </div>
    );
}