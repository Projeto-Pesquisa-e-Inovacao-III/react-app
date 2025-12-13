import FullCalendar from "@fullcalendar/react";
import InteractionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import "./style.css";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { parseISO, startOfDay } from "date-fns";
import { TypeContext } from "../../../App";

type Props = {
  events?: { agendamentoId: number; data: string; status: string }[];
  isMobile?: boolean;
  isUserAuthorizedToInteract?: boolean;
}

export default function ViewCalendarMonthStyled({ events, isMobile, isUserAuthorizedToInteract }: Props) {
  const actualMonth = new Date().getMonth() + 1;

  const [selectedMonth, setSelectedMonth] = useState<number>(0);

  const type = useContext(TypeContext);


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

            const eventsOfDay = events?.filter(event =>
              event.data.split("T")[0] === cellDate
            ) || [];

            return (
              <div style={{ position: "relative", textAlign: "center" }}>
                <div>{arg.dayNumberText}</div>

                <div style={{ display: "flex", justifyContent: "center", gap: "4px" }}>
                  {eventsOfDay.map((event) => (
                    <div
                      key={event.agendamentoId}
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        backgroundColor:
                          event.status === "PENDENTE_PERSONAL_APROVACAO" || event.status === "PENDENTE_CLIENTE_APROVACAO" || event.status === "PENDENTE_PERSONAL_CONCLUIR" || event.status === "APROVADO"
                            ? "#F2B138"
                            : event.status === "CANCELADO_PERSONAL" || event.status === "CANCELADO_CLIENTE" || event.status === "AUSENCIA_PERSONAL" || event.status === "AUSENCIA_ALUNO"
                              ? "#B3393A"
                              : event.status === "CONCLUIDO"
                                ? "green"
                                : "gray",
                      }}
                    />
                  ))}
                </div>
              </div>
            );
          }}

          dateClick={(arg) => {

            const clickedDate = arg.date.toISOString().split("T")[0];

            const appointment = events?.filter(event => event.data.split("T")[0] === clickedDate) || null;

            const today = startOfDay(new Date());
            console.log(today)


            if (appointment && appointment.length > 1) {
              nav(`/schedule-history/?date=${clickedDate}`);
              return
            }

            const findAppointment = events?.find(event => event.data.split("T")[0] === clickedDate) || null;

            if (findAppointment !== null) {
              nav(`/schedule-details?id=${findAppointment.agendamentoId}`);
              return
            }

            if (isUserAuthorizedToInteract && type?.type === "aluno" && clickedDate > today.toISOString().split("T")[0]) {
              nav(`/schedule/?date=${clickedDate}`);
            }
            return
          }}
          headerToolbar={{

            start: "title",
            end: `${selectedMonth - 1 >= actualMonth ? "prev" : ""}${selectedMonth != actualMonth && selectedMonth != 12 ? "," : ""}${selectedMonth == 12 ? "" : "next"}`, // gambiarra? engenharia! // ficaria "today prev,next" no caminho feliz
          }}
          height={"auto"}

        />
      </div>
    </div >
  );
}
