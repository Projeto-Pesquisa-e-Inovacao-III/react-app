import "./style.css";
import { useEffect, useState } from "react";
import CalendarMonthStyled from "../CalendarMonthStyled";
import { createEvent } from "../../constants/calendar";
import { checkDebugConnection } from "../CheckConnection/CheckConnection";

export default function NewEvent(
  { close, insertedEvents, insertEvent, title = "Novo Evento" }: { close: React.Dispatch<React.SetStateAction<boolean>>; insertedEvents: any[]; insertEvent: React.Dispatch<React.SetStateAction<any[]>>; title?: string }
) {

  const [openNewEvent, setOpenNewEvent] = useState<boolean>(true);
  const [newEventTitle, setNewEventTitle] = useState<string>("");
  const [newEventDate, setNewEventDate] = useState<string>("");
  const [newEventStartHour, setNewEventStartHour] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("personal");
  const [selectedLocation, setSelectedLocation] = useState<string>("casa");

  useEffect(() => {
    if (openNewEvent) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
      close(false);
    }
  }, [openNewEvent]);


  useEffect
    (() => {
      console.log("events", insertedEvents);
    }, [insertedEvents]);

  async function handleNewEvent(e: React.FormEvent) {
    e.preventDefault();

    //debugging - check if backend is reachable
    const isDatabaseConnected = await checkDebugConnection();
    console.log("isDatabaseConnected", isDatabaseConnected);

    const calculatedTitle = `${newEventDate} - ${newEventStartHour}`;
    setNewEventTitle(calculatedTitle);


    if (isDatabaseConnected) {
      console.log("tentando salvar no banco");
      console.log(isDatabaseConnected)
      await createEvent({ title: calculatedTitle, dateTime: `${newEventDate}T${newEventStartHour}` })
        .then(response => {
          console.log("Evento salvo com sucesso:", response.data);
          console.log("seguindo para inserir na lista")
        }).catch(error => {
          console.error("Erro ao salvar evento:", error);
        });
    }

    if (newEventTitle || calculatedTitle && newEventDate) {
      console.log("colocou no eventsMock");
      setOpenNewEvent(false);
    }
    if (insertedEvents) {

      insertEvent([...insertedEvents, { title: calculatedTitle, start: `${newEventDate}T${newEventStartHour}`, end: `${newEventDate}T09:00:00` }]); // t09 é só um horário fixo de fim do evento, pq não tem input para isso ainda
    }
  }

  function handleButtonClick(event: React.MouseEvent<HTMLButtonElement>, hour: string) {
    event.preventDefault();
    console.log("clicou no botão da hora", hour);
    setNewEventStartHour(hour);
    const button = document.getElementById("btn" + hour.split(":")[0]);

    if (button) {
      const buttons = document.querySelectorAll('.btn-sched');
      buttons.forEach(btn => btn.classList.remove('btn-selected'));

      button.classList.add('btn-selected');
    }

  }

  return (
    <div className="new-event-form">

      <div className="top-new-event">
        <h1>{title}</h1>
        {/* temporary */}
        {/* <button onClick={() => setOpenNewEvent(false)} style={{ marginTop: "12px", padding: "8px 16px", backgroundColor: "#c50000ff", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>CLOSE</button> */}
        <svg onClick={() => setOpenNewEvent(false)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
      </div>

      <div className="wrapper-new-event">
        <div className="calendar-small">
          <CalendarMonthStyled clickedDate={setNewEventDate} createdEvents={insertedEvents} />
          <div className="hours">
            {/* falar com o pedro/jp se dá pra simplificar isso */}
            <button id="btn08" className="btn-sched" type="button" onClick={(e) => handleButtonClick(e, "08:00:00")}>08:00</button>
            <button id="btn09" className="btn-sched" type="button" onClick={(e) => handleButtonClick(e, "09:00:00")}>09:00</button>
            <button id="btn10" className="btn-sched" type="button" onClick={(e) => handleButtonClick(e, "10:00:00")}>10:00</button>
            <button id="btn11" className="btn-sched" type="button" onClick={(e) => handleButtonClick(e, "11:00:00")}>11:00</button>
          </div>
        </div>
        <form className="input-infos-form" onSubmit={handleNewEvent}>



          <div className="wrapper-inputs">
            <div className="input-group">
              <label htmlFor="">Tipo</label>
              <select name="" id="" value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                <option value="personal">Personal</option>
                <option value="consultoria">Consultoria</option>
                <option value="outro">Outro</option>
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="">Local</label>
              <select name="" id="" value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
                <option value="casa">Casa</option>
                <option value="academia">Academia</option>
                <option value="outro">Outro</option>
              </select>
            </div>

            {
              selectedLocation === "casa" ? (
                <>
                  <div className="input-group-address">
                    <div className="input-group double-input">
                      {/*Change all this to good templates*/}
                      <input type="text" placeholder="CEP" />
                      <input type="text" placeholder="Cidade" className="disabled" disabled />
                    </div>
                    <div className="input-group double-input">
                      <input
                        type="text"
                        placeholder="Endereço"
                        className="input-address disabled"
                        disabled
                      />
                      <input className="input-number" type="text" placeholder="Número" />
                    </div>
                    <div className="input-group input-group-max">
                      <input type="text" placeholder="Complemento" />
                    </div>
                  </div>
                </>
              ) : null
            }
          </div>
          <div className="submit-button">
            <button className="btn-sched" type="submit">Agendar</button>
          </div>
        </form>
      </div>
    </div >
  );
}
