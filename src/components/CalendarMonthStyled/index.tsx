import FullCalendar from "@fullcalendar/react";
import InteractionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import "./style.css";
import { useEffect, useState } from "react";

type Props = {
  clickedDate: React.Dispatch<React.SetStateAction<string>>;
  createdEvents?: { title: string; date: string; hour: string }[];
};


export default function CalendarMonthStyled({ clickedDate, createdEvents }: Props) {

  const databaseEvents = createdEvents?.map((event: { title: string; date: string; hour: string }) => {
    return { title: event.title, date: event.date };
  });

  const eventsMock = [
    { title: "Reunião", date: "2025-09-15" },
    { title: "Aniversário", date: "2025-09-22" },
  ];

  const actualMonth = new Date().getMonth() + 1;

  const [events, setEvents] = useState<typeof eventsMock>(eventsMock);
  const [newEventDate, setNewEventDate] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<number>(0);

  useEffect(() => {
    if (databaseEvents && databaseEvents.length > 0) {
      setEvents(databaseEvents);
    }
  }, []);

  useEffect(() => {
    clickedDate(newEventDate);
  }, [newEventDate]);

  return (
    <div className="container-calendar">
      <div className="wrapper-callendar" id="wrapper-styled-callendar">
        <FullCalendar
          plugins={[dayGridPlugin, InteractionPlugin]}
          initialView="dayGridMonth"
          // events={createdEvents ? events : eventsMock}
          locale={"pt-br"}
          dayHeaderFormat={{ weekday: 'long' }}
          datesSet={function (info) {
            const month = info.start.getMonth() + 2;
            setSelectedMonth(month);
          }}
          dateClick={function (info) {
            setNewEventDate(info.dateStr);

          }}
          dayCellClassNames={(arg) => {
            const disabledDays = events?.map((event) => event.date);

            const dateStr = arg.date.toISOString().split("T")[0];

            if (disabledDays?.includes(dateStr)) {
              return ["disabled-day"];
            }

            if (dateStr == newEventDate) {
              return ["selected-day"];
            }

            return [];

          }}
          headerToolbar={{

            start: "title",
            end: `${selectedMonth >= actualMonth ? "today " : ""}${selectedMonth - 1 >= actualMonth ? "prev" : ""}${selectedMonth != actualMonth && selectedMonth != 12 ? "," : ""}${selectedMonth == 12 ? "" : "next"}`, // gambiarra? engenharia! // ficaria "today prev,next" no caminho feliz
          }}
          height={"auto"}

        />
      </div>
    </div >
  );
}
