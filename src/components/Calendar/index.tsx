import FullCalendar from "@fullcalendar/react";
import InteractionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import "./style.css";
import { useEffect, useState } from "react";
import NewEvent from "../NewEvent";
interface CalendarProps {
  title: string;
  date: string;
  start?: string;
  end?: string;
}
export default function Calendar() {
  const eventsMock: CalendarProps[] = [
    { title: "Reunião", date: "2025-09-15" },
    { title: "Aniversário", date: "2025-09-22" },
  ];

  const actualMonth = new Date().getMonth();

  const [openNewEvent, setOpenNewEvent] = useState<boolean>(false);
  const [events, setEvents] = useState<typeof eventsMock>(eventsMock);
  const [newEventTitle, setNewEventTitle] = useState<string>("");
  const [newEventDate, setNewEventDate] = useState<string>("");


  useEffect(() => {
    const wrapperCallendar = document.getElementById("wrapper-callendar");
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
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={events}
          dayCellClassNames={(arg) => {
            const disabledDays = events.map((event) => event.date || event.start?.split("T")[0]);
            if (disabledDays.includes(arg.date.toISOString().split("T")[0])) {
              return ["disabled-day"];
            }
            return [];
          }}
          headerToolbar={{
            start: "newEvent",
            center: "title",
            end: `today prev,next`,
          }}
          customButtons={{
            newEvent: {
              text: "new event",
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
