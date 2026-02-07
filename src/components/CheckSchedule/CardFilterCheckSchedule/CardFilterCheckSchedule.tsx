import { SearchIcon } from "lucide-react";
import Button from "../../Button/Button";
import InputWithIcon from "../../Inputs/InputWithIcon/InputWithIcon";
import styles from "./CardFilterCheckSchedule.module.css"
import Select from "../../Select/Select";
import { useState } from "react";

type FilterProps = {
    onSearchChange?: (filter: string) => void;
    onSelectStatusChange?: (status: string) => void;
    selectStatusValue?: string;
    onSelectTypeAulaChange?: (tipoAula: string) => void;
    selectTypeAulaValue?: string;
    searchValue?: string;
    onClear?: () => void;
    hasFilters?: boolean;
}

export function CardFilterCheckSchedule({ onSearchChange, onSelectStatusChange, onSelectTypeAulaChange, searchValue, selectStatusValue, selectTypeAulaValue, onClear, hasFilters }: FilterProps) {
    const [openSelectId, setOpenSelectId] = useState<string | null>(null);

    return (
        <div className={styles.containerCardFilterCheckSchedule}>
            <div className={styles.cardFilter}>
                <InputWithIcon
                    type="text"
                    placeholder="Buscar aluno"
                    icon={<SearchIcon />}
                    value={searchValue}
                    onInputChange={onSearchChange}
                />
                <Select
                    onSelectStatusChange={onSelectStatusChange}
                    selectStatusValue={selectStatusValue}
                    selectPlaceholder="Selecionar status"
                    values={[
                        { label: "Pendente", value: "PENDENTE_PERSONAL_APROVACAO" },
                        { label: "Aprovado", value: "APROVADO" },
                        { label: "Rejeitado", value: "CANCELADO_PERSONAL" },
                    ]}
                    setOpenSelectId={setOpenSelectId}
                    openSelectId={openSelectId}
                    id="status"
                />
                <Select
                    onSelectStatusChange={onSelectTypeAulaChange}
                    selectStatusValue={selectTypeAulaValue}
                    selectPlaceholder="Tipo de agendamento"
                    values={[
                        { label: "Presencial", value: "PRESENCIAL" },
                        { label: "Residencial", value: "RESIDENCIAL" },
                        { label: "Funcional", value: "FUNCIONAL" },
                    ]}
                    setOpenSelectId={setOpenSelectId}
                    openSelectId={openSelectId}
                    id="tipoAula"
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
                    <Button
                        type="button"
                        typeButton="other"
                        title="Limpar filtro"
                        classNameDiv={styles.buttonFilter} classNameVariable={styles.btnCheckSchedule}
                        onClick={() => {
                            onClear?.();
                        }} />
                </div>
            }
        </div>
    )
}