import { SearchIcon } from "lucide-react";
import InputWithIcon from "../../components/Inputs/InputWithIcon/InputWithIcon";
import classNames from "classnames";

import styles from "./PlansHistory.module.css";
import SmallerButton from "../../components/SmallerButton";
import { PlansHistoryMock } from "./mocks/PlansHistoryMock";
import InputCalendar from "../../components/Inputs/InputCalendar/InputCalendar";
import { useNavigate } from "react-router-dom";
import RowWithHeaderTitle from "../../components/RowWithHeaderTitle/RowWithHeaderTitle";
import useSearchFilter from "../../hooks/useSearchFilter";

export default function PlansHistory() {
    const nav = useNavigate();

    function handleDetailsClick() {
        nav('/plans-history-details');
    }

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
    } = useSearchFilter(PlansHistoryMock, {
        searchName: (item) => [item.title],
        dateFilter: (item) => item.date,
    });


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
                    />
                </div>
                <div className={styles.datePickerWrapper}>
                    <InputCalendar selectedDate={filterInitialDate} setSelectedDate={setFilterInitialDate} />
                    <InputCalendar selectedDate={filterFinalDate} setSelectedDate={setFilterFinalDate} />
                </div>
                {hasFilters && (
                    <div className={classNames(styles.searchButton)}>
                        <SmallerButton title="Limpar filtros" handleButtonClick={clearFilters}/>
                    </div>
                )}
            </div>

            <RowWithHeaderTitle data={filteredData.sort((a, b) => a.date.localeCompare(b.date))} includeDetailsButton={true} buttonLabel="Ver Detalhes" handleDetailsClick={handleDetailsClick} />
        </div>
    );
}