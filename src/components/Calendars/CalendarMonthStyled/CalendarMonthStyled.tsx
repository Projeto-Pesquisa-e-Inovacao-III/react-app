import FullCalendar from "@fullcalendar/react";
import InteractionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import styles from "./CalendarMonthStyled.module.css";
import { useEffect, useRef, useState, useMemo } from "react";
import type { Schedule } from "../../../models/schedule";
import { parseISO, startOfDay } from "date-fns";

type Props = {
  className?: string;
  clickedDate: React.Dispatch<React.SetStateAction<string>>;
  clickedDateStr?: string;
  createdEvents?: Schedule[];
  eventToReschedule?: string;
  isMobile: boolean;
  hasClassTomorrow?: boolean;
  tomorrowDate?: string;
  disabledDays?: string[];
};

export default function CalendarMonthStyled({ clickedDate, clickedDateStr, createdEvents, eventToReschedule, isMobile, hasClassTomorrow, tomorrowDate, disabledDays }: Props) {

  const [newEventDate, setNewEventDate] = useState<string>("");
  const calendarRef = useRef<FullCalendar>(null);
  
  const databaseEvents = useMemo(() => {
    return Array.isArray(createdEvents) ? createdEvents.map((event: Schedule) => {
      const eventData = event.data || (event as any).dataInicio;
      return {
        data: eventData instanceof Date ? eventData.toISOString().split("T")[0] : eventData,
        agendamentoId: event.agendamentoId,
        status: (event as any).status,
      };
    }) : [];
  }, [createdEvents]);

  const [events, setEvents] = useState<typeof databaseEvents>(databaseEvents || []);

  useEffect(() => {
    if (databaseEvents && databaseEvents.length > 0) {
      setEvents(databaseEvents);
    }
  }, [databaseEvents]);

  useEffect(() => {
    const valueToSync = newEventDate || clickedDateStr || "";
    if (valueToSync && valueToSync !== clickedDateStr) {
      clickedDate(valueToSync);
    }
  }, [newEventDate, clickedDate, clickedDateStr]);

  useEffect(() => {
    const calendarApi = calendarRef.current?.getApi();
    calendarApi?.select(eventToReschedule || "");
    setNewEventDate(eventToReschedule || "");
  }, [eventToReschedule]);

  return (
    <div className={isMobile ? styles.containerCalendarMobile : styles.containerCalendar}>
      <div className={styles.wrapperStyledCallendar} id="wrapper-styled-callendar-event">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, InteractionPlugin]}
          initialView="dayGridMonth"
          locale="pt-br"
          dayHeaderFormat={{ weekday: 'short' }}
          dateClick={(info) => {
            const today = startOfDay(new Date());
            const clickedDate = parseISO(info.dateStr);
            const weekday = info.date.toLocaleDateString("pt-BR", { weekday: "long" }).toLowerCase().split("-")[0].normalize("NFD").replace(/[\u0300-\u036f]/g, "");

            
            if (disabledDays?.includes(weekday)) return
            
            if (clickedDate <= today || (!hasClassTomorrow && info.dateStr === tomorrowDate)) return

            setNewEventDate(info.dateStr)
          }}
          dayCellClassNames={(arg) => {
            const dateStr = arg.date.toISOString().split("T")[0];
            const weekday = arg.date.toLocaleDateString("pt-BR", { weekday: "long" }).toLowerCase().split("-")[0].normalize("NFD").replace(/[\u0300-\u036f]/g, "");

            const now = new Date().toLocaleDateString("pt-BR").split("/").reverse().join("-");
            if (dateStr < now || dateStr === now || (!hasClassTomorrow && dateStr === tomorrowDate) || disabledDays?.includes(weekday)) return [styles.disabledDay];

            if (dateStr === newEventDate || (dateStr === clickedDateStr && !newEventDate)) return [styles.selectedDay];

            return [];
          }}
          dayCellContent={(arg) => {
            const cellDate = arg.date.toISOString().split("T")[0];

            const eventsOfDay = events?.filter(event =>
              event.data?.split("T")[0] === cellDate
            ) || [];

            return (
              <div style={{ position: "relative", textAlign: "center" }}>
                <div><p>{arg.dayNumberText}</p></div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "4px", position: "absolute", left: "55%", transform: "translate(-50%, -50%)", marginTop: "6px" }}>
                  {eventsOfDay.map((event) => (
                    <div
                      key={event.agendamentoId}
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        backgroundColor:
                          event.status === "PENDENTE_PERSONAL_APROVACAO" || event.status === "PENDENTE_CLIENTE_APROVACAO"
                            ? "#F2B138"
                            : event.status === "CANCELADO_PERSONAL" || event.status === "CANCELADO_CLIENTE"
                              ? "#B3393A"
                              : event.status === "CONCLUIDO" || event.status === "APROVADO"
                                ? "#4CAF50"
                                : "gray",
                      }}
                    />
                  ))}
                </div>
              </div>
            );
          }}
          headerToolbar={{
            start: "title",
            end: `prev,today,next`,
          }}
          buttonText={{
            today: 'Hoje',
          }}
          height="auto"
        />
      </div>
    </div>
  );
}
