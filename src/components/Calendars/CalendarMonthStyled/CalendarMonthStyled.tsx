import FullCalendar from "@fullcalendar/react";
import InteractionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import "./mobile.css";
import "./desktop.css";
import { use, useEffect, useRef, useState } from "react";
import type { EventDTO } from "../../../models/calendar";
import type { Schedule } from "../../../models/schedule";

type Props = {
  clickedDate: React.Dispatch<React.SetStateAction<string>>;
  clickedDateStr?: string;
  createdEvents?: Schedule[];
  eventToReschedule?: string;
  isMobile: boolean;
};


export default function CalendarMonthStyled({ clickedDate, clickedDateStr, createdEvents, eventToReschedule, isMobile }: Props) {

  const databaseEvents = Array.isArray(createdEvents) ? createdEvents.map((event: Schedule) => {
    return { 
      data: event.data instanceof Date ? event.data.toISOString().split("T")[0] : event.data 
    };
  }) : [];

  useEffect(() => {
    console.log("databaseEvents", databaseEvents);
  }, []);

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
            const disabledDays = events.map((e) => e.data.split("T")[0]);
            const dateStr = arg.date.toISOString().split("T")[0];

            if (dateStr === eventToReschedule || disabledDays.includes(dateStr))
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