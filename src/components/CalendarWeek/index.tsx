
import FullCalendar from "@fullcalendar/react";
import InteractionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import "./style.css";
import { use, useEffect, useState } from "react";
import NewEvent from "../NewEvent";
export default function CalendarWeek() {
  const eventsMock = [
    { title: "Reunião", start: "2025-09-11T15:30:00", end: "2025-09-11T16:30:00" },
    { title: "Aniversário", start: "2025-11-06T16:30:00", end: "2025-11-06T17:30:00" },
  ];

  const [openNewEvent, setOpenNewEvent] = useState<boolean>(false);
  const [events, setEvents] = useState<typeof eventsMock>(eventsMock);

  useEffect(() => {
    console.log("events", events);
  }, [events]);

  return (
    <div className="container-calendar">
      <div className="wrapper-callendar" id="wrapper-callendar">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin]}
          initialView="timeGridWeek"
          locale={"pt-br"}
          allDaySlot={false}
          eventTimeFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
          slotLabelFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
          timeZone="local"
          businessHours={true}
          events={events}
          headerToolbar={{
            start: "newEvent",
            center: "title",
            end: `today prev,next`,
          }}
          customButtons={{
            newEvent: {
              text: "novo evento",
              click: function () {
                setOpenNewEvent(true);
              },
            },
          }}
        />
      </div>
      {openNewEvent ? (
        <NewEvent close={setOpenNewEvent} insertedEvents={events} insertEvent={setEvents} />

      ) : null}
    </div>
  );
}
