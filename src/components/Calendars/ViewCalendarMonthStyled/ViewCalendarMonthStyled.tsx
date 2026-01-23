import FullCalendar from "@fullcalendar/react";
import InteractionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import styles from "./ViewCalendarMonthStyled.module.css"
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { format, startOfDay } from "date-fns";
import { TypeContext } from "../../../App";
import { useQuery } from "@tanstack/react-query";
import { getPersonalHours } from "../../../constants/personal";
import { ptBR } from "date-fns/locale";
import { getPersonalList } from "../../../constants/schedule";

type Props = {
  events?: { agendamentoId: number; data: string; status: string }[];
  isMobile?: boolean;
  isUserAuthorizedToInteract?: boolean;
  canMakeAppointment?: boolean;
  modalInfo?: React.Dispatch<React.SetStateAction<{ title: string; description: string }>>;
  modalType?: React.Dispatch<React.SetStateAction<"cancel" | "accept" | "reschedule" | "success" | "newEvent" | "error" | "rescheduleRequest" | null>>;

}

export default function ViewCalendarMonthStyled({ events, isMobile, isUserAuthorizedToInteract, canMakeAppointment, modalInfo, modalType }: Props) {
  const type = useContext(TypeContext);



  const nav = useNavigate();

  const personal = useQuery({
    queryKey: ["personalList"],
    queryFn: getPersonalList,
    select: (res) => res.data[0].id,
  });


  const tomorrow = format(new Date(Date.now() + 86400000), "yyyy-MM-dd", { locale: ptBR });
  console.log("tomorrow", tomorrow);

  const availabilityHoursTomorrow = useQuery({
    queryKey: ["availabilityHours"],
    queryFn: () => getPersonalHours(personal.data, tomorrow ? tomorrow : ""),
    select: (res) => res.data,
  });



  return (
    <div className={styles.containerCalendar}>
      <div className={styles.wrapperCalendar} id="wrapper-styled-callendar">
        <FullCalendar
          plugins={[dayGridPlugin, InteractionPlugin]}
          initialView="dayGridMonth"
          locale={"pt-br"}
          dayHeaderFormat={{ weekday: `${isMobile ? 'short' : 'long'}` }}

          dayCellContent={(arg) => {
            const cellDate = arg.date.toISOString().split("T")[0];

            const eventsOfDay = events?.filter(event =>
              event.data.split("T")[0] === cellDate
            ) || [];

            return (
              <div style={{ position: "relative", textAlign: "center" }}>
                <div>{arg.dayNumberText}</div>
                <div style={{ display: "flex", justifyContent: "center", gap: "4px", position: "absolute", left: "55%", transform: "translate(-50%, -50%)", marginTop: "3px" }}>
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
                            : event.status === "CANCELADO_PERSONAL" || event.status === "CANCELADO_CLIENTE" || event.status === "AUSENCIA_PERSONAL" || event.status === "AUSENCIA_CLIENTE"
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


            if (type?.type === "personal" && appointment && appointment.length > 1) {
              nav(`/personal/check-schedule/?date=${clickedDate}`);
              return
            }

            if (appointment && appointment.length > 1) {
              nav(`/schedule-history/?date=${clickedDate}`);
              return
            }

            const findAppointment = events?.find(event => event.data.split("T")[0] === clickedDate) || null;

            if (findAppointment !== null) {
              nav(`/schedule-details?id=${findAppointment.agendamentoId}`);
              return
            }

            if (!canMakeAppointment) {
              modalInfo?.({ title: "Aulas indisponíveis", description: "Você não possui aulas disponíveis para agendamento. Por favor, adquira um plano ou entre em contato com o personal." });
              modalType?.("error");
              return;
            }

            if (clickedDate === tomorrow && availabilityHoursTomorrow?.data?.length === 0) return;

            if (canMakeAppointment && isUserAuthorizedToInteract && type?.type === "aluno" && clickedDate > today.toISOString().split("T")[0]) {
              nav(`/schedule/?date=${clickedDate}`);
            }


            return
          }}
          dayCellClassNames={(arg) => {
            const cellDate = arg.date.toISOString().split("T")[0];
            const todayDate = startOfDay(new Date()).toISOString().split("T")[0];

            if (cellDate <= todayDate) {
              return [styles.fcTodayCustom];
            }


            return [];
          }}
          headerToolbar={{

            start: "title",
            // end: `${selectedMonth - 1 >= actualMonth ? "prev" : ""}${selectedMonth != actualMonth && selectedMonth != 12 ? "," : ""}${selectedMonth == 12 ? "" : "next"}`,
            end: `prev,next,today`,
          }}
          buttonText={{
            today: 'Hoje',
          }}

          height={"auto"}

        />
      </div>
    </div >
  );
}
