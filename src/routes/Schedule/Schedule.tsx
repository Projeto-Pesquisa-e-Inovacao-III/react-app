import { useContext, useEffect, useState } from "react";
import styles from "./Schedule.module.css"
import UserScheduleCard from "../../components/UserScheduleCard";
import ViewCalendarMonthStyled from "../../components/Calendars/ViewCalendarMonthStyled/ViewCalendarMonthStyled";
import NewEvent from "../../components/NewEvent/NewEvent";
import SuccessModal from "../../components/Modal/SuccessModal/SuccessModal";
import TimerModal from "../../components/Modal/TimerModal/TimerModal";
import SmallerButton from "../../components/SmallerButton";
import CalendarWeek from "../../components/Calendars/CalendarWeek/CalendarWeek";
import { TypeContext } from "../../App";
import classnames from "classnames";
import useMobile from "../../hooks/isMobile";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { appointmentAtCalendar, findUserAppointments } from "../../constants/schedule";
import { format, parse, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

type ModalType = "cancel" | "reschedule" | "success" | "newEvent" | null;

export default function Schedule() {
    const isMobile = useMobile();

    const type = useContext(TypeContext);
    console.log("User type in Schedule:", type?.type);

    const [events, setEvents] = useState([]);

    const [openModal, setOpenModal] = useState<ModalType>(null);

    const [clickedDate, setClickedDate] = useState<string>("");

    const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

    const [successModalInfo, setSuccessModalInfo] = useState({ title: "", description: "" });
    function handleSuccessModalInfo(title: string, description: string) {
        setSuccessModalInfo({ title, description });
        setOpenModal("success");
    }

    useEffect(() => {
        if (isMobile) window.scrollTo(0, 0);
    }, [openModal]);

    const [searchParams] = useSearchParams();

    useEffect(() => {
        setClickedDate("");

        if (searchParams.get("date")) {
            setClickedDate(searchParams.get("date") || "");
            setOpenModal("newEvent");
        }
    }, [searchParams]);

    const appointments = useQuery({
        queryKey: ["appointmentsAtCalendar"],
        queryFn: () => appointmentAtCalendar(),
        retry: false,
    })

    const userAppointments = useQuery({
        queryKey: ["userAppointments"],
        queryFn: () => findUserAppointments(),
        retry: false,
        select: (res) => res.data
    })

    console.log("User appointments data:", appointments.data);
    return (
        <>
            {type?.type === "personal" ? (
                <CalendarWeek insertedEvents={appointments.data?.data || []} openModal={() => setOpenModal("newEvent")} isMobile={isMobile} />
            ) : (
                <div className={classnames(styles.userViewSchedule, { [styles.mobile]: isMobile })}>

                    <div className={classnames(styles.viewSchedule, { [styles.mobile]: isMobile })}>
                        <div className={classnames(styles.schedulePageCalendar, { [styles.mobile]: isMobile })}>
                            <ViewCalendarMonthStyled isMobile={isMobile} events={appointments.data?.data} />
                        </div>
                        <div className={classnames(styles.schedulePageUserActions, { [styles.mobile]: isMobile })}>
                            <div className={styles.adjustButtonWSchedule}>
                                <SmallerButton
                                    type="button"
                                    icon={isMobile ? undefined : (<svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M5 12h14" />
                                        <path d="M12 5v14" />
                                    </svg>)}
                                    title={`Agendar`}
                                    handleButtonClick={() => setOpenModal("newEvent")} />
                            </div>

                            {userAppointments.data?.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((event, index) => (
                                <div onClick={() => setSelectedEventId(event.id)} key={`${event.title}-${index}`}>
                                    <UserScheduleCard
                                        data={event}
                                        date={`${parse(event.data, "yyyy-MM-dd'T'HH:mm:ss", new Date()).getDate()} de ${format(parseISO(event.data), "MMMM", {locale: ptBR})}`}
                                        initialHour={`${event.data.replace(":", "h").split("T")[1].slice(0, 5)}`}
                                        finalHour={`${(parseInt(event.data.replace(":", "h").split("T")[1].slice(0, 2)) + 1)}h00`}
                                        handleCancel={() => setOpenModal("cancel")}
                                        handleReschedule={() => setOpenModal("reschedule")}
                                        isMobile={isMobile}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {openModal === "newEvent" && (
                <>
                    <NewEvent
                        isMobile={isMobile}
                        close={() => setOpenModal(null)}
                        openModal={() => handleSuccessModalInfo("Agendado com sucesso", "Horário agendado com sucesso")}
                        insertedEvents={events}
                        insertEvent={setEvents}
                        title="Agendar horário"
                        buttonTitle="Avançar"
                        clickedDate={clickedDate}
                    />
                </>
            )}

            {openModal === "reschedule" && (
                <>
                    <NewEvent
                        isMobile={isMobile}
                        close={() => setOpenModal(null)}
                        openModal={() => handleSuccessModalInfo("Reagendado com sucesso", "Horário reagendado com sucesso")}
                        insertedEvents={events}
                        insertEvent={setEvents}
                        title="Reagendar horário"
                        buttonTitle="Reagendar"
                        isReschedule={true}
                        rescheduleId={selectedEventId}
                    />
                </>
            )}

            {openModal === "success" && (
                <SuccessModal
                    isMobile={isMobile}
                    closeThen={() => setOpenModal(null)}
                    title={successModalInfo.title}
                    content={successModalInfo.description}
                />
            )}

            

            {openModal === "cancel" && (
                <TimerModal
                    isMobile={isMobile}
                    closeThen={() => setOpenModal(null)}
                    title="Cancelar"
                    content={`Você tem certeza que quer cancelar o agendamento?\n
                        Agendamento:
                        Tipo: Personal
                        Personal: Fabio
                        Local: Casa
                        Endereço: Rua Alberto Almeida n° 23
                    `}
                    id={selectedEventId}
                    events={events}
                    setEvents={setEvents}
                    buttonTitle="Cancelar agendamento"
                    callSuccessModal={() => handleSuccessModalInfo("Cancelado com sucesso", "Horário cancelado com sucesso")}
                    isDelete={true}
                />
            )}
        </>

    );
}
