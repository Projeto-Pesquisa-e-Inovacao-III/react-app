import { Calendar, SearchIcon } from "lucide-react";
import Button from "../../Button/Button";
import InputWithIcon from "../../Inputs/InputWithIcon/InputWithIcon";
import styles from "./CardFilterCheckSchedule.module.css"
import Select from "../../Select/Select";
import { useRef, useState, useEffect } from "react";
import CalendarMini, { type DateRange } from "../../Calendars/MiniCalendar/CalendarMini";
import useClickOutside from "../../../hooks/useClickOutside";
import useMobile from "../../../hooks/isMobile";
import SmallerButton from "../../SmallerButton/SmallerButton";

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

    const calendarRef = useRef<HTMLDivElement>(null);

    const [localSearch, setLocalSearch] = useState(searchValue || "");

    useEffect(() => {
        const timer = setTimeout(() => {
            onSearchChange(localSearch);
        }, 700);
        return () => clearTimeout(timer);
    }, [localSearch, onSearchChange]);

    useEffect(() => {
        if (searchValue === "") {
            setLocalSearch("");
        }
    }, [searchValue]);

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
                            value={localSearch}
                            onInputChange={setLocalSearch}
                        />
                        <Select
                            onSelectStatusChange={onSelectStatusChange}
                            selectStatusValue={selectStatusValue}
                            selectPlaceholder="Selecionar status"
                            values={[
                                { label: "Pendente personal", value: "PENDENTE_PERSONAL_APROVACAO" },
                                { label: "Pendente aluno", value: "PENDENTE_CLIENTE_APROVACAO" },
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
                                color={`${selectedDateRange?.start && selectedDateRange?.end ? "#093a5d" : "#707070"}`}
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

                                    {selectedDateRange?.start && selectedDateRange?.end && (
                                        <SmallerButton
                                            title="Resetar filtro"
                                            handleButtonClick={() => {
                                                if (setSelectedDateRange) {
                                                    setSelectedDateRange({ start: "", end: "" });
                                                }
                                                setOpenCalendar(false);
                                            }}
                                            classname="absolute bottom-0"
                                        />
                                    )}
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
                            { label: "13", value: "13" },
                            { label: "14", value: "14" },
                            { label: "15", value: "15" },
                            { label: "16", value: "16" },
                            { label: "17", value: "17" },
                            { label: "18", value: "18" },
                            { label: "19", value: "19" },
                            { label: "20", value: "20" },
                            { label: "21", value: "21" },
                            { label: "22", value: "22" },
                            { label: "23", value: "23" },
                            { label: "24", value: "24" },
                            { label: "25", value: "25" },
                            { label: "26", value: "26" },
                            { label: "27", value: "27" },
                            { label: "28", value: "28" },
                            { label: "29", value: "29" },
                            { label: "30", value: "30" },

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
                        value={localSearch}
                        onInputChange={setLocalSearch}
                    />

                    <div className={styles.cardFilterMobile}>
                        <Select
                            onSelectStatusChange={onSelectStatusChange}
                            selectStatusValue={selectStatusValue}
                            selectPlaceholder="Status"
                            values={[
                                { label: "Pendente personal", value: "PENDENTE_PERSONAL_APROVACAO" },
                                { label: "Pendente aluno", value: "PENDENTE_CLIENTE_APROVACAO" },
                                { label: "Aprovado", value: "APROVADO" },
                                { label: "Rejeitado", value: "CANCELADO_PERSONAL" },
                            ]}
                            setOpenSelectId={setOpenSelectId}
                            openSelectId={openSelectId}
                            id="status"
                            dropDownClassName={styles.dropdownStatus}
                            containerClassName={styles.containerSelect}
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
                            containerClassName={styles.containerSelect}
                        />

                        <div ref={calendarRef} className={styles.calendarWrapper}>

                            <div className={styles.calendarIconContainer} onClick={() => setOpenCalendar(!openCalendar)}>
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

                                    <SmallerButton
                                        title="Resetar filtro"
                                        handleButtonClick={() => {
                                            if (setSelectedDateRange) {
                                                setSelectedDateRange({ start: "", end: "" });
                                            }
                                            setOpenCalendar(false);
                                        }}
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