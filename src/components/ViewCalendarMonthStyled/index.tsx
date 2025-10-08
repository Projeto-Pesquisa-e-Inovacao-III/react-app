import FullCalendar from "@fullcalendar/react";
import InteractionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import "./style.css";
import { useEffect, useState } from "react";

export default function ViewCalendarMonthStyled({ events }: { events?: { title: string; date: string; hour: string }[] }) {

  const actualMonth = new Date().getMonth() + 1;

  const [selectedMonth, setSelectedMonth] = useState<number>(0);

  return (
    <div className="container-calendar">
      <div className="wrapper-callendar" id="wrapper-styled-callendar">
        <FullCalendar
          plugins={[dayGridPlugin, InteractionPlugin]}
          initialView="dayGridMonth"
          locale={"pt-br"}
          dayHeaderFormat={{ weekday: 'long' }}
          datesSet={function (info) {
            const month = info.start.getMonth() + 2;
            setSelectedMonth(month);
            console.log("Mês atual do calendário:", month);
          }}
          dayCellContent={(arg) => {
            const cellDate = arg.date.toISOString().split("T")[0];
            const hasEvent = events?.some(event => event.date === cellDate);

            return (
              <div style={{ textAlign: 'center' }}>
                <div>{arg.dayNumberText.replace(/[^\d]/g, '')}</div> 
                {hasEvent && (
                  <div style={{
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#1e40af',
                    borderRadius: '50%',
                    margin: '4px auto 0'
                  }}></div>
                )}
              </div>
            );
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
