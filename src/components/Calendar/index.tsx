import FullCalendar from "@fullcalendar/react";
import InteractionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import "./style.css";
import { useEffect, useState } from "react";
export default function Calendar() {
  const eventsMock = [
    { title: "Reunião", date: "2025-08-15" },
    { title: "Aniversário", date: "2025-08-22" },
  ];

  const actualMonth = new Date().getMonth();

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
            const disabledDays = events.map((event) => event.date);
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
                  selectable={true}
                  plugins={[dayGridPlugin, InteractionPlugin]}
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
                    start: "title",
                    center: "",
                    end: "today prev,next",
                  }}
                  dateClick={function (info) {
                    setNewEventDate(info.dateStr);
                  }}
                  //   select={function (info) {
                  //     alert("selected " + info.startStr + " to " + info.endStr);
                  //   }}
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
