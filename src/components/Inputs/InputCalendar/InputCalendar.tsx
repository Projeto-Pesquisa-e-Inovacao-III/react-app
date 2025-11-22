import { useState } from "react";
import MiniCalendar from "../../Calendars/MiniCalendar/CalendarMini";
import styles from "./InputCalendar.module.css"
import InputWithIcon from "../InputWithIcon/InputWithIcon";
import { Calendar } from "lucide-react";

type InputCalendarProps = {
    selectedDate: string;
    setSelectedDate: React.Dispatch<React.SetStateAction<string>> | ((date: string) => void);
    canGoPrev?: boolean;
}

export default function InputCalendar({ selectedDate, setSelectedDate, canGoPrev }: InputCalendarProps) {
    const [openCalendar, setOpenCalendar] = useState(false)

    function handleOpenCalendarInternal() {
        setOpenCalendar(true)

    }

    function handleCloseCalendar() {
        setOpenCalendar(false)
    }

    function handleDateSelect(date: string) {
        if (date != null && date !== "") {
            console.log("Data selecionada no InputCalendar:", date);
            const formattedDate = new Date(date + "T00:00:00").toLocaleDateString("pt-BR", {
                timeZone: "UTC"
            });
            setSelectedDate(formattedDate);
            handleCloseCalendar()
        }
    }

    return (
        <div className={styles.containerInputCalendar}>
            <div className={styles.lineFormModal}>
                <InputWithIcon value={selectedDate} onInputClick={handleOpenCalendarInternal} type="text" placeholder="Selecione a data" icon={<Calendar />} />
            </div>

            {openCalendar && (
                <>
                    <div className={styles.calendarOverlay} onClick={handleCloseCalendar}></div>
                    <div className={styles.miniCalendar}>
                        <svg
                            className={styles.calendarExitIcon}
                            width="20"
                            height="20"
                            viewBox="0 0 22 22"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            onClick={handleCloseCalendar}
                        >
                            <path d="M2 20L11 11M20 2L11 11M11 11L20 20M11 11L2 2" stroke="#858D9D" strokeWidth="3" />
                        </svg>
                        <MiniCalendar clickedDate={handleDateSelect} canGoPrev={canGoPrev} />
                    </div>
                </>
            )}
        </div>
    );
}