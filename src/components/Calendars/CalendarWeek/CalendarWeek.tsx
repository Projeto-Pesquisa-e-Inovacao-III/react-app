import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import styles from "./CalendarWeek.module.css";
import { useEffect, useState } from "react";
import { ptBR } from "date-fns/locale";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";

type CalendarWeekProps = {
    insertedEvents: any[];
    isMobile: boolean;
    openModal: React.Dispatch<React.SetStateAction<boolean>>;
    isLoading: boolean;
};

type EventType = {
    id: string;
    title: string;
    start: string;
    end: string;

};

export default function CalendarWeek({ insertedEvents, isMobile, openModal, isLoading }: CalendarWeekProps) {

    const [setOpenNewEvent] = useState<boolean>(false);
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
        <>
            {isLoading ? (
                <div className={styles.calendarSkeleton}>
                    <div className={styles.skeletonHeader}>
                        <Skeleton width={200} height={28} />
                        <div className={styles.skeletonButtons}>
                            <Skeleton width={40} height={32} />
                            <Skeleton width={40} height={32} />
                        </div>
                    </div>
                    <div className={styles.skeletonCalendarGrid}>
                        <div className={styles.skeletonTimeColumn}>
                            {[...Array(12)].map((_, i) => (
                                <div key={i} style={{ margin: '8px' }}>
                                    <Skeleton height={48} />
                                </div>
                            ))}
                        </div>
                        <div className={styles.skeletonDays}>
                            {[...Array(7)].map((_, dayIndex) => (
                                <div key={dayIndex} className={styles.skeletonDay}>
                                    <div style={{ margin: '8px' }}>
                                        <Skeleton height={40} />
                                    </div>
                                    <div className={styles.skeletonEvents}>
                                        {[...Array(Math.floor(Math.random() * 3) + 1)].map((_, eventIndex) => (
                                            <div
                                                key={eventIndex}
                                                style={{
                                                    position: 'absolute',
                                                    top: `${Math.random() * 70}%`,
                                                    width: 'calc(100% - 16px)',
                                                    height: `${Math.random() * 15 + 10}%`,
                                                    padding: '0 8px'
                                                }}
                                            >
                                                <Skeleton height="100%" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className={styles.containerCalendarWeekPersonal}>
                    <div className={styles.wrapperCallendar} id="wrapper-callendar">
                        <FullCalendar
                            plugins={[dayGridPlugin, timeGridPlugin]}
                            initialView="timeGridWeek"
                            locale={"pt-br"}
                            height="auto"
                            expandRows={true}
                            allDaySlot={false}
                            slotMinTime="08:00:00"
                            slotMaxTime="20:00:00"
                            eventTimeFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
                            slotLabelFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
                            timeZone="local"
                            dayHeaderFormat={{ weekday: `${isMobile ? 'short' : 'long'}` }}
                            businessHours={true}
                            events={events}
                            headerToolbar={{
                                start: "",
                                center: "title",
                                end: `prev,next`,
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
                            eventClassNames={(arg) => {
                                const eventData = insertedEvents.find(event => event.agendamentoId.toString() === arg.event.id);
                                console.log("Event Data:", eventData);

                                if (eventData) {
                                    if (eventData.status === "PENDENTE_PERSONAL_APROVACAO" || eventData.status === "PENDENTE_CLIENTE_APROVACAO" || eventData.status === "APROVADO") {
                                        return [styles.eventCustomCalendarWeekApproved];
                                    }
                                    if (eventData.status === "CANCELADO_PERSONAL" || eventData.status === "CANCELADO_CLIENTE") {
                                        return [styles.eventCustomCalendarWeekCanceled];
                                    }
                                    if (eventData.status === "CONCLUIDO") {
                                        return [styles.eventCustomCalendarWeekCompleted];
                                    }

                                }

                                return [styles.eventCustomCalendarWeek];
                            }}
                        />
                    </div>
                </div>
            )}
        </>
    );
}