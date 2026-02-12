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
    createdEvents?: { title: string; start: string; end: string }[];
    canGoPrev?: boolean;

    dateRange?: boolean;
    selectedDateRange?: DateRange;
    setSelectedDateRange?: React.Dispatch<React.SetStateAction<DateRange>>;
};

export default function CalendarMini({ clickedDate, dateRange, selectedDateRange, setSelectedDateRange }: Props) {
    const [newEventDate, setNewEventDate] = useState<string>("");
    const [selectedMonth, setSelectedMonth] = useState<number>(0);

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
                    datesSet={(info) => {
                        const month = info.start.getMonth() + 2;
                        setSelectedMonth(month);
                    }}
                    dateClick={(info) => {
                        if (!dateRange || !setSelectedDateRange) {
                            setNewEventDate(info.dateStr);
                            return;
                        }

                        const start = selectedDateRange?.start;
                        const end = selectedDateRange?.end;

                        if (start && end) {
                            setNewEventDate(info.dateStr);
                            setSelectedDateRange({
                                start: info.dateStr,
                                end: ""
                            });
                            return;
                        }

                        if (!start) {
                            setSelectedDateRange(prev => ({
                                ...prev,
                                start: info.dateStr
                            }));
                            return;
                        }

                        setSelectedDateRange(prev => ({
                            ...prev,
                            end: info.dateStr
                        }));

                    }}
                    dayCellClassNames={(arg) => {
                        const dateStr = arg.date.toISOString().split("T")[0];

                        if (!dateRange && dateStr === newEventDate) {
                            return [styles.miniSelectedDay];
                        }


                        if (dateRange && selectedDateRange?.start && selectedDateRange?.end) {
                            const startDate = new Date(selectedDateRange.start);
                            const endDate = new Date(selectedDateRange.end);
                            const currentDate = new Date(dateStr);

                            if (currentDate >= startDate && currentDate <= endDate) {
                                return [styles.miniSelectedDay];
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
