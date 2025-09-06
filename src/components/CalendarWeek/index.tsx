
import FullCalendar from "@fullcalendar/react";
import InteractionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import "./style.css";
import { useEffect, useState } from "react";
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
                  headerToolbar={{
                    start: "title",
                    center: "",
                    end: "today prev,next",
                  }}
                  dateClick={function (info) {
                    setNewEventDate(info.dateStr);
                  }}
                />
              </div>
            </div>
            <div className="hour">
              <label>Hour:</label>
              <input type="button" value="15h30-16h30" onClick={() => { setNewEventStartHour("15:30:00"); setNewEventEndHour("16:30:00"); }} />
              <input type="button" value="16h30-17h30" onClick={() => { setNewEventStartHour("16:30:00"); setNewEventEndHour("17:30:00"); }} />
              <input type="button" value="17h30-18h30" onClick={() => { setNewEventStartHour("17:30:00"); setNewEventEndHour("18:30:00"); }} />
              <input type="button" value="18h30-19h30" onClick={() => { setNewEventStartHour("18:30:00"); setNewEventEndHour("19:30:00"); }} />
              <input type="button" value="19h30-20h30" onClick={() => { setNewEventStartHour("19:30:00"); setNewEventEndHour("20:30:00"); }} />
            </div>
            <button type="submit" disabled={!newEventTitle || !newEventDate || !newEventStartHour || !newEventEndHour}>Add Event</button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
