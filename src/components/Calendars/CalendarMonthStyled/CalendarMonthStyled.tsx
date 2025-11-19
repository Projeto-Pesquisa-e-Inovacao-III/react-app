import FullCalendar from "@fullcalendar/react";
import InteractionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import "./mobile.css";
import "./desktop.css";
import { use, useEffect, useRef, useState } from "react";
import type { EventDTO } from "../../../models/calendar";

type Props = {
  clickedDate: React.Dispatch<React.SetStateAction<string>>;
  clickedDateStr?: string;
  createdEvents?: EventDTO[];
  eventToReschedule?: string;
  isMobile: boolean;
};


export default function CalendarMonthStyled({ clickedDate, clickedDateStr, createdEvents, eventToReschedule, isMobile }: Props) {

  const databaseEvents = createdEvents?.map((event: EventDTO) => {
    return { title: event.title, date: event.date };
  });

  const eventsMock = [
    { title: "Reunião", date: "2025-09-15" },
    { title: "Aniversário", date: "2025-09-22" },
  ];

  const [events, setEvents] = useState<typeof eventsMock>(eventsMock);
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

  useEffect(() => {
    if (newEventDate) {
      console.log("New event date selected:", newEventDate);
    }
  }, [newEventDate]);

  return (
    <div className={`container-calendar${isMobile ? "-mobile" : ""}`}>
      <div className="wrapper-callendar" id="wrapper-styled-callendar">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, InteractionPlugin]}
          initialView="dayGridMonth"
          locale="pt-br"
          dayHeaderFormat={{ weekday: 'short' }}
          dateClick={(info) => setNewEventDate(info.dateStr)}
          dayCellClassNames={(arg) => {
            const disabledDays = events.map((e) => e.date);
            const dateStr = arg.date.toISOString().split("T")[0];

            if (dateStr === eventToReschedule)
              return ["disabled-day"];

            if (dateStr === newEventDate || (dateStr === clickedDateStr && !newEventDate)) return ["selected-day"];

            return [];
          }}
          headerToolbar={{
            start: "title",
            end: isMobile ? "prev,next" : "today prev,next",
          }}
          height="auto"
        />
      </div>
    </div>
  );
}