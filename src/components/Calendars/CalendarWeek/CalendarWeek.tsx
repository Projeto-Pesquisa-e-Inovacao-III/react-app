import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import "./style.css";
import { useEffect, useState } from "react";
import NewEvent from "../../NewEvent/NewEvent";
import { useQuery } from "@tanstack/react-query";
import { locale } from "dayjs";
import { ptBR } from "date-fns/locale";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

type CalendarWeekProps = {
    insertedEvents: any[];
    isMobile: boolean;
    openModal: React.Dispatch<React.SetStateAction<boolean>>;
};

type EventType = {
    id: string;
    title: string;
    start: string;
    end: string;
};

export default function CalendarWeek({ insertedEvents, isMobile, openModal }: CalendarWeekProps) {

    const [openNewEvent, setOpenNewEvent] = useState<boolean>(false);
    // i could use just a react-query to get the events
    const [events, setEvents] = useState<EventType[]>([]);

    const navigate = useNavigate();


    useEffect(() => {
        console.log("Inserted events changed:", insertedEvents);
        const formattedEvents = insertedEvents.map((event: any) => ({
            id: event.agendamentoId?.toString() || "",
            title: event.tipoAula,
            start: event.dataInicio,
            end: event.dataFim,
        }));
        setEvents(formattedEvents);
    }, [insertedEvents]);

    return (
        <div className="container-calendar-week-personal">
            <div className="wrapper-callendar" id="wrapper-callendar">
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin]}
                    initialView="timeGridWeek"
                    locale={"pt-br"}
                    allDaySlot={false}
                    eventTimeFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
                    slotLabelFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
                    timeZone="local"
                    dayHeaderFormat={{ weekday: `${isMobile ? 'short' : 'long'}` }}
                    businessHours={true}
                    events={events}
                    headerToolbar={{
                        start: "",
                        center: "title",
                        end: `${isMobile ? '' : 'today '}prev,next`,
                    }}
                    customButtons={{
                        newEvent: {
                            text: "novo evento",
                            click: function () {
                                setOpenNewEvent(true);
                            },
                        },
                    }}
                    eventClick={(arg) => {
                        if (!arg.event.start) return;
                        const dataISO = format(arg.event.start, "yyyy-MM-dd'T'HH:mm:ss", { locale: ptBR });
                        const isEventPresent = events.some(event => event.start === dataISO);

                        if (isEventPresent) {
                            navigate(`/schedule-details?id=${events.find(event => event.start === dataISO)?.id}`);
                        }
                    }}
                    eventClassNames={() => {
                        return ["event-custom-calendar-week"];
                    }}
                />
            </div>
        </div>
    );
}