import FullCalendar from "@fullcalendar/react";
import InteractionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import styles from "./CalendarMini.module.css";
import { useEffect, useRef, useState } from "react";

export type DateRange = {
    start: string;
    end: string;
};

type Props = {
    clickedDate?: React.Dispatch<React.SetStateAction<string>> | ((date: string) => void);
    dateRange?: boolean;
    selectedDateRange?: DateRange;
    setSelectedDateRange?: React.Dispatch<React.SetStateAction<DateRange>>;
};

export default function CalendarMini({ clickedDate, dateRange, selectedDateRange, setSelectedDateRange }: Props) {
    const [newEventDate, setNewEventDate] = useState<string>("");

    useEffect(() => {
        clickedDate?.(newEventDate);
    }, [newEventDate, clickedDate]);

    const calendarRef = useRef<HTMLDivElement>(null);

    return (
        <div ref={calendarRef} className={styles.miniContainerCalendar}>
            <div className={styles.miniWrapperStyledCalendar}>
                <FullCalendar
                    plugins={[dayGridPlugin, InteractionPlugin]}
                    initialView="dayGridMonth"
                    locale={"pt-br"}
                    dayHeaderFormat={{ weekday: "short" }}
                    dateClick={(info) => {
                        if (!dateRange || !setSelectedDateRange) {
                            setNewEventDate(info.dateStr);
                            return;
                        }

                        const start = selectedDateRange?.start;
                        const end = selectedDateRange?.end;

                        if (start && end && start !== end) {
                            setSelectedDateRange({ start: info.dateStr, end: info.dateStr });
                            return;
                        }
                        if (!start) {
                            setSelectedDateRange({ start: info.dateStr, end: info.dateStr });
                            return;
                        }

                        if (info.dateStr === start) {
                            setSelectedDateRange({ start: "", end: "" });
                            return;
                        }
                        const startMs = new Date(`${start}T00:00:00`).getTime();
                        const clickedMs = new Date(`${info.dateStr}T00:00:00`).getTime();

                        if (clickedMs < startMs) {
                            setSelectedDateRange({ start: info.dateStr, end: start });
                        } else {
                            setSelectedDateRange({ start, end: info.dateStr });
                        }
                    }}
                    dayCellClassNames={(arg) => {
                        const localYear = arg.date.getFullYear();
                        const localMonth = String(arg.date.getMonth() + 1).padStart(2, '0');
                        const localDay = String(arg.date.getDate()).padStart(2, '0');
                        const dateStr = `${localYear}-${localMonth}-${localDay}`;

                        if (!dateRange && dateStr === newEventDate) {
                            return [styles.miniSelectedDay];
                        }

                        if (dateRange && selectedDateRange?.start) {
                            if (selectedDateRange.end) {
                                const startMs = new Date(`${selectedDateRange.start}T00:00:00`).getTime();
                                const endMs = new Date(`${selectedDateRange.end}T00:00:00`).getTime();
                                const currentMs = new Date(`${dateStr}T00:00:00`).getTime();

                                if (selectedDateRange.start === selectedDateRange.end && dateStr === selectedDateRange.start) {
                                    return [styles.miniStartDay, styles.miniIsolatedDay];
                                }

                                if (dateStr === selectedDateRange.start) return [styles.miniStartDay];
                                if (dateStr === selectedDateRange.end) return [styles.miniEndDay];
                                if (currentMs > startMs && currentMs < endMs) return [styles.miniInRangeDay];
                            } else {
                                if (dateStr === selectedDateRange.start) {
                                    return [styles.miniStartDay, styles.miniIsolatedDay];
                                }
                            }
                        }

                        return [];
                    }}
                    headerToolbar={{
                        start: `prev`,
                        center: "title",
                        end: `next`,
                    }}
                    height="100%"
                    expandRows={true}
                    fixedWeekCount={false}
                    dayMaxEvents={true}
                    views={{
                        dayGridMonth: {
                            showNonCurrentDates: false
                        }
                    }}
                />
            </div>
        </div>
    );
}
