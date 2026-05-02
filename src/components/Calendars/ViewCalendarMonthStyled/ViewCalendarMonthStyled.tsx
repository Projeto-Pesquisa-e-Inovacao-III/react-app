import FullCalendar from "@fullcalendar/react";
import InteractionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import styles from "./ViewCalendarMonthStyled.module.css"
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { format, startOfDay } from "date-fns";
import { TypeContext } from "../../../App";
import { ptBR } from "date-fns/locale";
type Props = {
  events?: { agendamentoId: number; data: string; status: string }[];
  isMobile?: boolean;
  isUserAuthorizedToInteract?: boolean;
  canMakeAppointment?: boolean;
  modalInfo?: React.Dispatch<React.SetStateAction<{ title: string; description: string }>>;
  modalType?: React.Dispatch<React.SetStateAction<"cancel" | "accept" | "reschedule" | "success" | "newEvent" | "error" | "rescheduleRequest" | "popup" | null>>;
  availabilityHoursTomorrow?: {
    inicio: string;
    fim: string;
  }[];
  clickDate?: (date: string) => void;
  disabledDays?: string[];
}

const tomorrow = format(new Date(Date.now() + 86400000), "yyyy-MM-dd", { locale: ptBR });

export default function ViewCalendarMonthStyled({ events, isMobile, isUserAuthorizedToInteract, canMakeAppointment, modalInfo, modalType, availabilityHoursTomorrow, clickDate, disabledDays }: Props) {
  const type = useContext(TypeContext);

  const nav = useNavigate();

  

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
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", justifyContent: "center", gap: "4px", position: "absolute", left: "55%", transform: "translate(-50%, -50%)", marginTop: "6px" }}>
                  {eventsOfDay.map((event) => (
                    <div
                      key={event.agendamentoId}
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        backgroundColor:
                          event.status === "PENDENTE_PERSONAL_APROVACAO" || event.status === "PENDENTE_CLIENTE_APROVACAO" || event.status === "PENDENTE_PERSONAL_CONCLUIR"
                            ? "#F2B138"
                            : event.status === "CANCELADO_PERSONAL" || event.status === "CANCELADO_CLIENTE" || event.status === "AUSENCIA_PERSONAL" || event.status === "AUSENCIA_CLIENTE"
                              ? "#B3393A"
                              : event.status === "CONCLUIDO" || event.status === "APROVADO"
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
            const weekday = arg.date.toLocaleDateString("pt-BR", { weekday: "long" }).toLowerCase().split("-")[0].normalize("NFD").replace(/[\u0300-\u036f]/g, "");


            const appointment = events?.filter(event => event.data.split("T")[0] === clickedDate) || null;

            const today = startOfDay(new Date());
            

            if(disabledDays?.includes(weekday)) {
              return;
            }


            if (type?.type?.includes("aluno") && appointment && appointment.length > 1) {
              nav(`/personal/check-schedule/?date=${clickedDate}`);
              return
            }

            if (appointment && appointment.length > 1) {
              clickDate?.(clickedDate);
              modalInfo?.({
                title: "Múltiplos agendamentos",
                description: "Este dia possui mais de um agendamento. Consulte o histórico para visualizar todos.",
              });
              modalType?.("popup");
              return
            }

            const findAppointment = events?.find(event => event.data.split("T")[0] === clickedDate) || null;

            if (findAppointment !== null) {
              
              clickDate?.(clickedDate);
              modalType?.("popup");
              return
            }

            if (!canMakeAppointment && type?.type?.includes("aluno")) {
              modalInfo?.({ title: "Aulas indisponíveis", description: "Você não possui aulas disponíveis para agendamento. Por favor, adquira um plano ou entre em contato com o personal." });
              modalType?.("error");
              return;
            }

            if (clickedDate === tomorrow && (!availabilityHoursTomorrow || availabilityHoursTomorrow.length === 0)) return;

            if (canMakeAppointment && isUserAuthorizedToInteract && type?.type?.includes("aluno") && clickedDate > today.toISOString().split("T")[0]) {
              nav(`/schedule/?date=${clickedDate}`);
            }


            return
          }}
          dayCellClassNames={(arg) => {
            const cellDate = arg.date.toISOString().split("T")[0];
            const todayDate = startOfDay(new Date()).toISOString().split("T")[0];
            const weekday = arg.date.toLocaleDateString("pt-BR", { weekday: "long" }).toLowerCase().split("-")[0].normalize("NFD").replace(/[\u0300-\u036f]/g, "");

            if (disabledDays?.includes(weekday)) return [styles.fcTodayCustom];

            if (cellDate === tomorrow && availabilityHoursTomorrow && availabilityHoursTomorrow.length === 0) return [styles.fcTodayCustom];

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
