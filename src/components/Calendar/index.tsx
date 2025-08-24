import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import "./style.css";
import { useEffect, useState } from "react";
export default function Calendar() {
  const eventsMock = [
    { title: "Reunião", date: "2025-08-15" },
    { title: "Aniversário", date: "2025-08-22" },
  ];

  const [openNewEvent, setOpenNewEvent] = useState<boolean>(false);
  const [events, setEvents] = useState<typeof eventsMock>(eventsMock);
  const [newEventTitle, setNewEventTitle] = useState<string>("");
  const [newEventDate, setNewEventDate] = useState<string>("");

  function handleNewEvent(e: React.FormEvent) {
    e.preventDefault();

    if (newEventTitle && newEventDate) {
      eventsMock.push({ title: newEventTitle, date: newEventDate });
      console.log("colocou no eventsMock");
      setOpenNewEvent(false);
    }
    setEvents([...events, { title: newEventTitle, date: newEventDate }]);
  }

  useEffect(() => {
    if (openNewEvent) {
      document.body.classList.add("new-event-opened");
    } else {
      document.body.classList.remove("new-event-opened");
    }
  }, [openNewEvent]);

  return (
    <div className="container">
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events}
        dayCellClassNames={(arg) => {
          const disabledDays = events.map((event) => event.date);
          if (disabledDays.includes(arg.date.toISOString().split("T")[0])) {
            return ["disabled-day"];
          }
          return [];
        }}
        headerToolbar={{
          start: "custom1",
          center: "title",
          end: "today prev,next",
        }}
        customButtons={{
          custom1: {
            text: "new event",
            click: function () {
              setOpenNewEvent(true);
            },
          },
        }}
      />

      {openNewEvent ? (
        <div className="new-event-form">
          <div className="top-new-event">
            <h3>Create New Event</h3>
            <button onClick={() => setOpenNewEvent(false)}>Close</button>
          </div>
          <form onSubmit={handleNewEvent}>
            <div>
              <label>Title:</label>
              <input
                type="text"
                onChange={(e) => setNewEventTitle(e.target.value)}
              />
            </div>
            <div>
              <div className="calendar-small">
                <FullCalendar
                  plugins={[dayGridPlugin]}
                  initialView="dayGridMonth"
                  events={events}
                  dayCellClassNames={(arg) => {
                    const disabledDays = events.map((event) => event.date);
                    if (
                      disabledDays.includes(
                        arg.date.toISOString().split("T")[0]
                      )
                    ) {
                      return ["disabled-day"];
                    }
                    return [];
                  }}
                  headerToolbar={{
                    start: "",
                    center: "",
                    end: "",
                  }}
                />
              </div>
            </div>
            <button type="submit">Add Event</button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
