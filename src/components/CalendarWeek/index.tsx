
import FullCalendar from "@fullcalendar/react";
import InteractionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import "./style.css";
import { useEffect, useState } from "react";
import NewEvent from "../NewEvent";
export default function CalendarWeek() {
  const eventsMock = [
    { title: "Reunião", start: "2025-09-06T15:30:00", end: "2025-09-06T16:30:00" },
    { title: "Aniversário", start: "2025-09-06T16:30:00", end: "2025-09-06T17:30:00" },
  ];

  const actualMonth = new Date().getMonth();

  const [openNewEvent, setOpenNewEvent] = useState<boolean>(false);
  const [events, setEvents] = useState<typeof eventsMock>(eventsMock);
  const [newEventTitle, setNewEventTitle] = useState<string>("");
  const [newEventDate, setNewEventDate] = useState<string>("");
  const [newEventStartHour, setNewEventStartHour] = useState<string>("");
  const [newEventEndHour, setNewEventEndHour] = useState<string>("");

  function handleNewEvent(e: React.FormEvent) {
    e.preventDefault();

    if (newEventTitle && newEventDate) {
      eventsMock.push({ title: newEventTitle, start: newEventDate + "T" + newEventStartHour, end: newEventDate + "T" + newEventEndHour });
      console.log("colocou no eventsMock");
      setOpenNewEvent(false);
    }
    setEvents([...events, { title: newEventTitle, start: newEventDate + "T" + newEventStartHour, end: newEventDate + "T" + newEventEndHour }]);
  }

  useEffect(() => {
    const wrapperCallendar = document.getElementById("wrapper-callendar");
    console.log(events);
    if (openNewEvent) {
      document.body.style.overflow = "hidden";
      wrapperCallendar?.classList.add("new-event-opened-wrapper-callendar");
    } else {
      document.body.style.overflow = "auto";
      wrapperCallendar?.classList.remove("new-event-opened-wrapper-callendar");
    }
  }, [openNewEvent]);

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
        <NewEvent close={setOpenNewEvent} />

      ) : null}
    </div>
  );
}
