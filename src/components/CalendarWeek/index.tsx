
import FullCalendar from "@fullcalendar/react";
import InteractionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import "./style.css";
import { use, useEffect, useState } from "react";
import NewEvent from "../NewEvent/NewEventDesktop/NewEventDesktop";
import { checkDebugConnection } from "../CheckConnection/CheckConnection";
import { getEvents } from "../../constants/calendar";
import type { CalendarDTO } from "../../models/calendar";
export default function CalendarWeek() {


  const [openNewEvent, setOpenNewEvent] = useState<boolean>(false);
  const [events, setEvents] = useState<any>();

  const eventsMock = [
    { title: "Reunião", start: "2025-09-15T10:00:00", end: "2025-09-15T11:00:00" },
    { title: "Aniversário", start: "2025-09-22T12:00:00", end: "2025-09-22T13:00:00" },
  ];

  useEffect(() => {
    async function checkConnection() {
      const isDatabaseConnected = await checkDebugConnection();
      if (isDatabaseConnected) {
        console.log("Conexão com o banco de dados bem-sucedida.");
        getEvents().then((response) => {
          console.log(response)
          const databaseEvents = response.data.content.map((event: { title: string; dateTime: string }) => {
            const [date, time] = event.dateTime.split("T");
            return { title: event.title, start: `${date}T${time}`, end: `${date}T09:00:00` }; // t09 é só um horário fixo de fim do evento, pq não tem input para isso ainda
          });
          console.log("Eventos do banco de dados:", databaseEvents);
          setEvents(databaseEvents);
        });
      }
    }
    checkConnection();
    console.log("events", events);
    if(!events) {
      setEvents(eventsMock);
    }
  }, []);

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
