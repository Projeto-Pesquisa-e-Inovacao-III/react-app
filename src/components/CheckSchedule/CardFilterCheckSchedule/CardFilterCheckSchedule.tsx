import { Calendar, SearchIcon } from "lucide-react";
import Button from "../../Button/Button";
import InputWithIcon from "../../Inputs/InputWithIcon/InputWithIcon";
import styles from "./CardFilterCheckSchedule.module.css"
import Select from "../../Select/Select";
import { useState } from "react";
import CalendarMini, { type DateRange } from "../../Calendars/MiniCalendar/CalendarMini";

type FilterProps = {
    onSearchChange: (filter: string) => void;
    onSelectStatusChange: React.Dispatch<React.SetStateAction<string>>;
    selectStatusValue?: string;
    onSelectTypeClassChange: React.Dispatch<React.SetStateAction<string>>;
    selectTypeClassValue?: string;
    onSelectLinesPerPageChange: React.Dispatch<React.SetStateAction<string>>;
    selectLinesPerPageValue?: string;
    searchValue?: string;
    onClear?: () => void;
    hasFilters?: boolean;
}



export function CardFilterCheckSchedule({ onSearchChange, onSelectStatusChange, onSelectTypeClassChange, searchValue, selectStatusValue, selectTypeClassValue, onClear, hasFilters, onSelectLinesPerPageChange, selectLinesPerPageValue }: FilterProps) {
    const [openSelectId, setOpenSelectId] = useState<string | null>(null);

    const [openCalendar, setOpenCalendar] = useState(false);

    const [selectedDateRange, setSelectedDateRange] = useState<DateRange>({
        start: "",
        end: "",
    });


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
                    onSelectStatusChange={onSelectTypeClassChange}
                    selectStatusValue={selectTypeClassValue}
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

                <div className="relative flex items-center gap-2">
                    <div className="border w-0.5 border-gray-300 h-full"></div>
                    <Calendar color="#707070" className="cursor-pointer" onClick={() => setOpenCalendar(!openCalendar)} />

                    {openCalendar && (
                        <div className="absolute top-10 z-50 max-w-3xl w-80">
                            <CalendarMini
                                dateRange={true}
                                selectedDateRange={selectedDateRange}
                                setSelectedDateRange={setSelectedDateRange}
                            />
                        </div>
                    )}
                </div>
                {/* // <select className={styles.selectStatus} name="" id="" value={selectStatusValue} onChange={(e) => onSelectStatusChange && onSelectStatusChange(e.target.value)}>
                //     <option value="" disabled>Todas as Solicitações</option>
                //     <option value="PENDENTE_PERSONAL_APROVACAO">Pendente</option>
                //     <option value="APROVADO">Aprovado</option>
                //     <option value="CANCELADO_PERSONAL">Rejeitado</option>
                // </select> */}

            </div>
            <div>
                <Select
                    onSelectStatusChange={onSelectLinesPerPageChange}
                    selectStatusValue={selectLinesPerPageValue}
                    fixedText="Linhas por página:"
                    showSelectAll={false}
                    showSearchInput={false}
                    values={[
                        { label: "5", value: "5" },
                        { label: "6", value: "6" },
                        { label: "7", value: "7" },
                        { label: "8", value: "8" },
                        { label: "9", value: "9" },
                        { label: "10", value: "10" },
                        { label: "11", value: "11" },
                        { label: "12", value: "12" },

                    ]}
                    setOpenSelectId={setOpenSelectId}
                    openSelectId={openSelectId}
                    defaultValue={selectLinesPerPageValue}
                    id="linhasPorPagina"
                />
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