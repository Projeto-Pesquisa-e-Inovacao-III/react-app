import FullCalendar from "@fullcalendar/react";
import InteractionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import "./style.css";
import { useEffect, useState } from "react";

type Props = {
    clickedDate?: React.Dispatch<React.SetStateAction<string>> | ((date: string) => void);
    createdEvents?: { title: string; start: string; end: string }[];
};


export default function CalendarMini({ clickedDate, createdEvents }: Props) {
    const databaseEvents = createdEvents?.map((event: { title: string; start: string; end: string }) => {
        const dateStr = event.start.split("T")[0];
        return { title: event.title, date: dateStr };   
    });

    const eventsMock = [
        { title: "Reunião", date: "2025-10-15" },
        { title: "Aniversário", date: "2025-10-22" },
    ];

    const actualMonth = new Date().getMonth() + 1;

    const [events, setEvents] = useState<typeof eventsMock>(eventsMock);
    const [newEventDate, setNewEventDate] = useState<string>("");
    const [selectedMonth, setSelectedMonth] = useState<number>(0);

    useEffect(() => {
        if (databaseEvents && databaseEvents.length > 0) {
            setEvents(databaseEvents);
        }
    }, []);

    useEffect(() => {
        clickedDate?.(newEventDate);
    }, [newEventDate]);

    return (
        <div className="mini-container-calendar">
            <div className="mini-wrapper-calendar" id="mini-wrapper-styled-calendar">
                <FullCalendar
                    plugins={[dayGridPlugin, InteractionPlugin]}
                    initialView="dayGridMonth"
                    locale={"pt-br"}
                    dayHeaderFormat={{ weekday: "short" }}
                    datesSet={(info) => {
                        const month = info.start.getMonth() + 2;
                        setSelectedMonth(month);
                        console.log("Mês atual do calendário:", month);
                    }}
                    dateClick={(info) => {
                        setNewEventDate(info.dateStr);
                    }}
                    dayCellClassNames={(arg) => {
                        const disabledDays = events?.map((event) => event.date);
                        const dateStr = arg.date.toISOString().split("T")[0];

                        if (disabledDays?.includes(dateStr)) {
                            return ["mini-disabled-day"];
                        }

                        if (dateStr === newEventDate) {
                            return ["mini-selected-day"];
                        }

                        return [];
                    }}
                    headerToolbar={{
                        start: `${selectedMonth >= actualMonth + 2 ? "prev" : ""}`,
                        center: "title",
                        end: `${selectedMonth === 13 ? "" : "next"}`,
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