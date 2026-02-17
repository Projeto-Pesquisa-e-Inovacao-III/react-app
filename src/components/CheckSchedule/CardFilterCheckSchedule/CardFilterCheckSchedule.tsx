import { Calendar, SearchIcon } from "lucide-react";
import Button from "../../Button/Button";
import InputWithIcon from "../../Inputs/InputWithIcon/InputWithIcon";
import styles from "./CardFilterCheckSchedule.module.css"
import Select from "../../Select/Select";
import { useRef, useState } from "react";
import CalendarMini, { type DateRange } from "../../Calendars/MiniCalendar/CalendarMini";
import useClickOutside from "../../../hooks/useClickOutside";
import useMobile from "../../../hooks/isMobile";

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

    selectedDateRange?: DateRange;
    setSelectedDateRange?: React.Dispatch<React.SetStateAction<DateRange>>;
}



export function CardFilterCheckSchedule({ onSearchChange, onSelectStatusChange, onSelectTypeClassChange, searchValue, selectStatusValue, selectTypeClassValue, onClear, hasFilters, onSelectLinesPerPageChange, selectLinesPerPageValue, selectedDateRange, setSelectedDateRange }: FilterProps) {
    const isMobile = useMobile()

    const [openSelectId, setOpenSelectId] = useState<string | null>(null);

    const [openCalendar, setOpenCalendar] = useState(false);

    console.log(selectedDateRange);

    const calendarRef = useRef<HTMLDivElement>(null);

    useClickOutside({
        ref: calendarRef,
        callback: () => setOpenCalendar(false)
    });
    return (
        <>
            {!isMobile && (
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

                        <div ref={calendarRef} className={styles.calendarWrapper}>

                            <div className={styles.verticalDivider}></div>

                            <Calendar
                                color="#707070"
                                className={styles.calendarIcon}
                                onClick={() => setOpenCalendar(!openCalendar)}
                            />

                            {openCalendar && (
                                <div className={styles.calendarDropdown}>
                                    <CalendarMini
                                        dateRange={true}
                                        selectedDateRange={selectedDateRange}
                                        setSelectedDateRange={setSelectedDateRange}
                                    />
                                </div>
                            )}

                        </div>


                    </div>
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
            )}

            {isMobile && (
                <div className={styles.containerCardFilterCheckSchedule}>
                    <InputWithIcon
                        type="text"
                        placeholder="Buscar aluno"
                        customClassName="bg-white! rounded-lg w-full!"
                        icon={<SearchIcon />}
                        value={searchValue}
                        onInputChange={onSearchChange}
                    />

                    <div className={styles.cardFilterMobile}>
                        <Select
                            onSelectStatusChange={onSelectStatusChange}
                            selectStatusValue={selectStatusValue}
                            selectPlaceholder="Status"
                            values={[
                                { label: "Pendente", value: "PENDENTE_PERSONAL_APROVACAO" },
                                { label: "Aprovado", value: "APROVADO" },
                                { label: "Rejeitado", value: "CANCELADO_PERSONAL" },
                            ]}
                            setOpenSelectId={setOpenSelectId}
                            openSelectId={openSelectId}
                            id="status"
                            dropDownClassName={styles.dropdownStatus}
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
                            dropDownClassName={styles.dropdownTipoAula}
                        />

                        <div ref={calendarRef} className={styles.calendarWrapper} onClick={() => setOpenCalendar(!openCalendar)}>

                            <div className={styles.calendarIconContainer}>
                                <Calendar
                                    color="#707070"
                                    className={styles.calendarIcon}
                                    
                                />
                            </div>
                            {openCalendar && (
                                <div className={styles.calendarDropdown}>
                                    <CalendarMini
                                        dateRange={true}
                                        selectedDateRange={selectedDateRange}
                                        setSelectedDateRange={setSelectedDateRange}
                                    />
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            )}

        </>
    )
}