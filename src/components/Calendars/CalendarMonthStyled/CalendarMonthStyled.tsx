import FullCalendar from "@fullcalendar/react";
import InteractionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import "./mobile.css";
import "./desktop.css";
import { use, useContext, useEffect, useRef, useState } from "react";
import type { Schedule } from "../../../models/schedule";
import { parseISO, startOfDay } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { getPersonalHours } from "../../../constants/personal";
import { TypeContext } from "../../../App";

type Props = {
  className?: string;
  clickedDate: React.Dispatch<React.SetStateAction<string>>;
  clickedDateStr?: string;
  createdEvents?: Schedule[];
  eventToReschedule?: string;
  isMobile: boolean;
  hasClassTomorrow?: boolean;
  tomorrowDate?: string;
};


export default function CalendarMonthStyled({ clickedDate, clickedDateStr, createdEvents, eventToReschedule, isMobile, hasClassTomorrow, tomorrowDate }: Props) {

  const databaseEvents = Array.isArray(createdEvents) ? createdEvents.map((event: Schedule) => {
    return {
      data: event.data instanceof Date ? event.data.toISOString().split("T")[0] : event.data,
      status: event.status,
    };
  }) : [];


  const [events, setEvents] = useState<typeof databaseEvents>(databaseEvents || []);
  const [newEventDate, setNewEventDate] = useState<string>("");
  const calendarRef = useRef<FullCalendar>(null);

  useEffect(() => {
    if (databaseEvents && databaseEvents.length > 0) {
      setEvents(databaseEvents);
    }

  }, []);

  useEffect(() => {
    clickedDate(newEventDate || clickedDateStr || "");
  }, [newEventDate]);

  useEffect(() => {
    const calendarApi = calendarRef.current?.getApi();
    calendarApi?.select(eventToReschedule || "");
    setNewEventDate(eventToReschedule || "");
  }, []);

  const actualMonth = new Date().getMonth();

  const [selectedMonth, setSelectedMonth] = useState<number>(0);


  return (
    <div className={`container-calendar${isMobile ? "-mobile" : ""}`}>
      <div className="wrapper-callendar" id="wrapper-styled-callendar">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, InteractionPlugin]}
          initialView="dayGridMonth"
          locale="pt-br"
          dayHeaderFormat={{ weekday: 'short' }}
          dateClick={(info) => {
            const today = startOfDay(new Date());
            const clickedDate = parseISO(info.dateStr);

            if (clickedDate <= today || (!hasClassTomorrow && info.dateStr === tomorrowDate)) return

            setNewEventDate(info.dateStr)


          }}
          datesSet={function (info) {
            const month = info.start.getMonth() + 1;
            setSelectedMonth(month);
          }}
          dayCellClassNames={(arg) => {
            // const disabledDays = events.map((e) => e.data.split("T")[0]);
            const dateStr = arg.date.toISOString().split("T")[0];

            // if (dateStr === eventToReschedule || disabledDays.includes(dateStr))
            //   return ["disabled-day"];

            const now = new Date().toLocaleDateString("pt-BR").split("/").reverse().join("-");
            if (dateStr < now || dateStr === now || (!hasClassTomorrow && dateStr === tomorrowDate))
              return ["disabled-day"];
            // if (dateStr === eventToReschedule || disabledDays.includes(dateStr))
            //   return ["disabled-day"];

            if (dateStr === newEventDate || (dateStr === clickedDateStr && !newEventDate)) return ["selected-day"];

            return [];
          }}
          dayCellContent={(arg) => {
            const cellDate = arg.date.toISOString().split("T")[0];

            const eventDate = events?.map(event => parseISO(event.data).toISOString().split("T")[0]);
            const eventsOfDay = events?.filter(event =>
              event.data.split("T")[0] === cellDate
            ) || [];

            return (

              <div style={{ position: "relative", textAlign: "center" }}>
                <div>{arg.dayNumberText}</div>
                <div style={{ display: "flex", justifyContent: "center", gap: "4px", position: "absolute", left: "55%", transform: "translate(-50%, -50%)", marginTop: "3px" }}>

                  {eventsOfDay.map((event, index) => (
                    <div
                      key={event.agendamentoId}
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        backgroundColor:
                          event.status === "PENDENTE_PERSONAL_APROVACAO" || event.status === "PENDENTE_CLIENTE_APROVACAO" ||
                            event.status === "APROVADO"
                            ? "#F2B138"
                            : event.status === "CANCELADO_PERSONAL" || event.status === "CANCELADO_CLIENTE"
                              ? "#B3393A"
                              : event.status === "CONCLUIDO"
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
            end: `${selectedMonth - 1 >= actualMonth ? "prev" : ""}${selectedMonth != actualMonth && selectedMonth != 12 ? "," : ""}${selectedMonth == 12 ? "" : "next"}`,
          }}
          height="auto"
        />
      </div>
    </div>
  );
}