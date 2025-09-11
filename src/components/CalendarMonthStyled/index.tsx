import FullCalendar from "@fullcalendar/react";
import InteractionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import "./style.css";
import { useEffect, useState } from "react";
import NewEvent from "../NewEvent";
export default function CalendarMonthStyled({ clickedDate }: { clickedDate: React.Dispatch<React.SetStateAction<string>> }) {
  const eventsMock = [
    { title: "Reunião", date: "2025-09-15" },
    { title: "Aniversário", date: "2025-09-22" },
  ];

  const [events, setEvents] = useState<typeof eventsMock>(eventsMock);
  const [newEventDate, setNewEventDate] = useState<string>("");

  useEffect(() => {
    clickedDate(newEventDate);
  }, [newEventDate]);

  return (
    <div className="container-calendar">
      <div className="wrapper-callendar" id="wrapper-styled-callendar">
        <FullCalendar
          plugins={[dayGridPlugin, InteractionPlugin]}
          initialView="dayGridMonth"
          events={events}
          locale={"pt-br"}
          dayHeaderFormat={{ weekday: 'long' }}
          dateClick={function (info) {
            setNewEventDate(info.dateStr);

          }}
          dayCellClassNames={(arg) => {
            const disabledDays = events.map((event) => event.date);

            const dateStr = arg.date.toISOString().split("T")[0];

            if (disabledDays.includes(dateStr)) {
              return ["disabled-day"];
            }
            
            if (dateStr == newEventDate) {
              return ["selected-day"];
            }
            
            return [];

          }}
          headerToolbar={{
            start: "title",
            end: `today prev,next`,
          }}
          height={"auto"}
          
        />
      </div>
    </div >
  );
}
