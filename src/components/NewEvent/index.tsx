import FullCalendar from "@fullcalendar/react";
import InteractionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import "./style.css";
import { use, useEffect, useState } from "react";
import CalendarMonthStyled from "../CalendarMonthStyled";
export default function NewEvent({ close }: { close: React.Dispatch<React.SetStateAction<boolean>> }) {
  const eventsMock = [
    { title: "Reunião", date: "2025-08-15" },
    { title: "Aniversário", date: "2025-08-22" },
  ];

  const [openNewEvent, setOpenNewEvent] = useState<boolean>(true);
  const [events, setEvents] = useState<typeof eventsMock>(eventsMock);
  const [newEventTitle, setNewEventTitle] = useState<string>("");
  const [newEventDate, setNewEventDate] = useState<string>("");
  const [newEventStartHour, setNewEventStartHour] = useState<string>("");

  function handleNewEvent(e: React.FormEvent) {
    e.preventDefault();

    setNewEventStartHour("08:00:00");

    setNewEventTitle(`${newEventDate} - ${newEventStartHour}`);


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
      close(false);
    }
  }, [openNewEvent]);


  return (
    <div className="new-event-form">

      <div className="top-new-event">
        <h3>Create New Event</h3>
        {/* temporary */}
        <button onClick={() => setOpenNewEvent(false)} style={{ marginTop: "12px", padding: "8px 16px", backgroundColor: "#c50000ff", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>CLOSE</button>
      </div>

      <div className="wrapper-new-event">
        <div className="calendar-small">
          <CalendarMonthStyled clickedDate={setNewEventDate} />
          <div className="hours">
            <button onClick={() => setNewEventStartHour("08:00:00")}>08:00</button>
            <button onClick={() => setNewEventStartHour("09:00:00")}>09:00</button>
            <button onClick={() => setNewEventStartHour("10:00:00")}>10:00</button>
            <button onClick={() => setNewEventStartHour("11:00:00")}>11:00</button>
          </div>

          {/* temporary */}
          <button type="submit" style={{ marginTop: "12px", padding: "8px 16px", backgroundColor: "#c50000ff", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>Add Event</button>

        </div>
        <form onSubmit={handleNewEvent}>
          <div className="input-group">
            <label htmlFor="">Tipo</label>
            <select name="" id="">
              <option value="personal">Personal</option>
              <option value="consultoria">Consultoria</option>
              <option value="outro">outro</option>
            </select>
          </div>
          <div className="input-group">
            <label htmlFor="">Local</label>
            <select name="" id="">
              <option value="casa">Casa</option>
              <option value="academia">Academia</option>
              <option value="outro">Outro</option>
            </select>
          </div>
          <div className="input-group double-input">
            <div>
              <label>CEP:</label>
              <input type="text" />
            </div>
            <div>
              <label>Cidade:</label>
              <input type="text" />
            </div>
          </div>
          <div className="input-group double-input">
            <div>
              <label>Endereço:</label>
              <input
                type="text"
              />
            </div>
            <div>
              <label>Número:</label>
              <input type="text" style={{ width: "20%" }} />
            </div>
          </div>
          <div className="input-group">
            <label>Complemento:</label>
            <input type="text" />
          </div>
        </form>
      </div>
    </div>
  );
}
