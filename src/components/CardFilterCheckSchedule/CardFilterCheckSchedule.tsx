import { SearchIcon } from "lucide-react";
import Button from "../Button/Button";
import InputWithIcon from "../Inputs/InputWithIcon/InputWithIcon";
import { SearchBar } from "../SearchBar/SearchBar";
import styles from "./CardFilterCheckSchedule.module.css"
import Select from "../Select/Select";

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
        <div className={styles.containerCardFilterCheckSchedule}>
            <div className={styles.cardFilter}>
                <InputWithIcon
                    type="text"
                    placeholder="Buscar aluno..."
                    icon={<SearchIcon />}
                    value={searchValue}
                    onInputChange={onSearchChange}
                />
                <Select
                    onSelectStatusChange={onSelectStatusChange}
                    values={[
                        { label: "Pendente", value: "PENDENTE_PERSONAL_APROVACAO" },
                        { label: "Aprovado", value: "APROVADO" },
                        { label: "Rejeitado", value: "CANCELADO_PERSONAL" },
                    ]}
                />  

                {/* // <select className={styles.selectStatus} name="" id="" value={selectStatusValue} onChange={(e) => onSelectStatusChange && onSelectStatusChange(e.target.value)}>
                //     <option value="" disabled>Todas as Solicitações</option>
                //     <option value="PENDENTE_PERSONAL_APROVACAO">Pendente</option>
                //     <option value="APROVADO">Aprovado</option>
                //     <option value="CANCELADO_PERSONAL">Rejeitado</option>
                // </select> */}

            </div>
            {hasFilters &&
                <div className={styles.divButtonFilter}>
                    <Button type="button" typeButton="other" title="Limpar filtro" classNameDiv={styles.buttonFilter} classNameVariable={styles.btnCheckSchedule} onClick={() => { onClear && onClear() }} />
                </div>
            }
        </div>
    )
}