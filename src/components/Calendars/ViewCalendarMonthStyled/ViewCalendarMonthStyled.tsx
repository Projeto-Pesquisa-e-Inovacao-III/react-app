import FullCalendar from "@fullcalendar/react";
import InteractionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import "./style.css";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ViewCalendarMonthStyled({ events, isMobile }: { events?: { title: string; date: string; hour: string }[]; isMobile?: boolean }) {

  const actualMonth = new Date().getMonth() + 1;

  const [selectedMonth, setSelectedMonth] = useState<number>(0);

  const [clickedDate, setClickedDate] = useState<string>("");

  const eventsTeste = [{
    id: 0, title: "Reunião", date: "2025-11-21", hour: "11:00:00"
  }]

  const nav = useNavigate();

  return (
    <div className="container-calendar">
      <div className="wrapper-callendar" id="wrapper-styled-callendar">
        <FullCalendar
          plugins={[dayGridPlugin, InteractionPlugin]}
          initialView="dayGridMonth"
          locale={"pt-br"}
          dayHeaderFormat={{ weekday: `${isMobile ? 'short' : 'long'}` }}
          datesSet={function (info) {
            const month = info.start.getMonth() + 2;
            setSelectedMonth(month);
          }}

          dayCellContent={(arg) => {
            const cellDate = arg.date.toISOString().split("T")[0];

            const hasEvent = events?.some(event => event.date === cellDate);
            return (
              <div style={{ textAlign: 'center' }}>
                <div>{arg.dayNumberText}</div>
                {hasEvent && (
                  <div style={{
                    position: 'absolute',
                    bottom: '-10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
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
          dateClick={(arg) => {

            const clickedDate = arg.date.toISOString().split("T")[0];

            const appointment = events?.find(event => event.date === clickedDate) || null;

            if (appointment !== null) {
              nav(`/schedule-details`);
              return
            }

            nav(`/schedule/?date=${clickedDate}`);

          }}
          headerToolbar={{

            start: "title",
            end: `${selectedMonth >= actualMonth ? `${isMobile ? '' : 'today '}` : ""}${selectedMonth - 1 >= actualMonth ? "prev" : ""}${selectedMonth != actualMonth && selectedMonth != 12 ? "," : ""}${selectedMonth == 12 ? "" : "next"}`, // gambiarra? engenharia! // ficaria "today prev,next" no caminho feliz
          }}
          height={"auto"}

        />
      </div>
    </div >
  );
}
