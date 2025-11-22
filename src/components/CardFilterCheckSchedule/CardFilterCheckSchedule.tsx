import Button from "../Button/Button";
import { SearchBar } from "../SearchBar/SearchBar";
import styles from "./CardFilterCheckSchedule.module.css"

type FilterProps = {
    onSearchChange?: (filter: string) => void;
    onSelectStatusChange?: (status: string) => void;
    searchValue?: string;
    selectStatusValue?: string;
    onClear?: () => void;
    hasFilters?: boolean;
}

export function CardFilterCheckSchedule({ onSearchChange, onSelectStatusChange, searchValue, selectStatusValue, onClear, hasFilters }: FilterProps) {

    return (
        <>
            <div className={styles.cardFilter}>
                <div className={styles.searchBarDiv}><SearchBar search={searchValue} setSearch={onSearchChange} /></div>
                <select className={styles.selectStatus} name="" id="" value={selectStatusValue} onChange={(e) => onSelectStatusChange && onSelectStatusChange(e.target.value)}>
                    <option value="" disabled>Selecione um status</option>
                    <option value="pending">Pendente</option>
                    <option value="done">Aprovado</option>
                    <option value="cancelled">Rejeitado</option>
                </select>
                {hasFilters &&
                    <div className={styles.divButtonFilter}>
                        <Button type="button" typeButton="other" title="Limpar filtro" classNameDiv={styles.buttonFilter} classNameVariable={styles.btnCheckSchedule} onClick={() => {onClear && onClear()}} />
                    </div>
                }

            </div>
        </>
    )
}