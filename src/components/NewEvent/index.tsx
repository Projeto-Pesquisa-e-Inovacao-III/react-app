import FullCalendar from "@fullcalendar/react";
import InteractionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import Button from "@mui/material";
import "./style.css";
import { use, useEffect, useState } from "react";
import CalendarMonthStyled from "../CalendarMonthStyled";

export default function NewEvent(
  { close, insertedEvents, insertEvent }: { close: React.Dispatch<React.SetStateAction<boolean>>; insertedEvents: any[]; insertEvent: React.Dispatch<React.SetStateAction<any[]>> }
) {
  const eventsMock = [...insertedEvents];

  const [openNewEvent, setOpenNewEvent] = useState<boolean>(true);
  const [newEventTitle, setNewEventTitle] = useState<string>("");
  const [newEventDate, setNewEventDate] = useState<string>("");
  const [newEventStartHour, setNewEventStartHour] = useState<string>("");


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


  function handleNewEvent(e: React.FormEvent) {
    e.preventDefault();
    console.log("newEventDate", newEventDate);
    setNewEventTitle(`${newEventDate} - ${newEventStartHour}`);


    if (newEventTitle && newEventDate) {
      console.log("colocou no eventsMock");
      setOpenNewEvent(false);
    }
    insertEvent([...insertedEvents, { title: newEventTitle, start: `${newEventDate}T${newEventStartHour}`, end: `${newEventDate}T09:00:00` }]);
  }

  function handleButtonClick(event: React.MouseEvent<HTMLButtonElement>, hour: string) {
    setNewEventStartHour(hour);
    const button = document.getElementById("btn" + hour.split(":")[0]);

    if (button) {
      const buttons = document.querySelectorAll('.hour-button');
      buttons.forEach(btn => btn.classList.remove('btn-selected'));

      button.classList.add('btn-selected');
    }

  }

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
          
        </div>
        <form onSubmit={handleNewEvent}>
          <div className="hours">
            <button id="btn08" className="hour-button" onClick={(e) => handleButtonClick(e, "08:00:00")}>08:00</button>
            <button id="btn09" className="hour-button" onClick={(e) => handleButtonClick(e, "09:00:00")}>09:00</button>
            <button id="btn10" className="hour-button" onClick={(e) => handleButtonClick(e, "10:00:00")}>10:00</button>
            <button id="btn11" className="hour-button" onClick={(e) => handleButtonClick(e, "11:00:00")}>11:00</button>
          </div>

          {/* temporary */}
          <button type="submit" style={{ marginTop: "12px", padding: "8px 16px", backgroundColor: "#c50000ff", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>Add Event</button>

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
