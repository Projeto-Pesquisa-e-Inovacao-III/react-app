import { useEffect, useState } from "react";
import "./desktop.css"
import "./mobile.css"
import UserScheduleCard from "../../components/UserScheduleCard";
import ViewCalendarMonthStyled from "../../components/ViewCalendarMonthStyled";
import UserHeaderMobile from "../../components/UserHeader/UserHeaderMobile/UserHeaderMobile";
import {UserHeaderDesktop} from "../../components/UserHeader/UserHeaderDesktop/UserHeaderDesktop";
import NewEvent from "../../components/NewEvent";
import { useMediaQuery } from "@mui/material";
import SuccessModal from "../../components/Modal/SuccessModal/SuccessModal";
import TimerModal from "../../components/Modal/TimerModal/TimerModal";
import SmallerButton from "../../components/SmallerButton";
import UserHeaderDesktop from "../../components/UserHeader/UserHeaderDesktop/UserHeaderDesktop";
import { LogoHeaderMobile } from "../../components/LogoHeaderMobile";

//todo: when rescheduling, success modal should say "Reagendamento feito com sucesso"
export default function ViewSchedule() {
    const isMobile = useMediaQuery("(max-width:1024px)");

    const eventsMock = [
        { id: 0, title: "Reunião", date: "2025-10-11", hour: "11:00:00" },
        { id: 1, title: "Aniversário", date: "2025-10-22", hour: "10:00:00" },
    ];
    const [events, setEvents] = useState(eventsMock);

    const [openNewEvent, setOpenNewEvent] = useState(false);
    const [openReschedule, setOpenReschedule] = useState(false);

    const [openSuccessModal, setOpenSuccessModal] = useState(false);
    const [openCancelModal, setOpenCancelModal] = useState<boolean>(false);

    const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

    useEffect(() => {
        if (isMobile) window.scrollTo(0, 0);
    }, [openSuccessModal, openCancelModal, isMobile]);

    const Header = isMobile ? UserHeaderMobile : UserHeaderDesktop;

    return (
        <>
            <div className={`user-view-schedule${isMobile ? "-mobile" : ""}`}>
                {isMobile && <div className="logo-header-mobile">
                    <LogoHeaderMobile />
                </div>}
                {!isMobile && <Header type="student" />}
                <div className={`view-schedule${isMobile ? "-mobile" : ""}`}>
                    <div className={`schedule-page-calendar${isMobile ? "-mobile" : ""}`}>
                        <ViewCalendarMonthStyled isMobile={isMobile} events={events} />
                    </div>
                    <div className={`schedule-page-user-actions${isMobile ? "-mobile" : ""}`}>
                        <div>
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
                                handleButtonClick={() => setOpenNewEvent(true)} />
                        </div>

                        {events.map((event, index) => (
                            <div onClick={() => setSelectedEventId(event.id)} key={`${event.title}-${index}`}>
                                <UserScheduleCard
                                    date={`${event.date.split("-").reverse()[0]} de ${new Intl.DateTimeFormat("pt-BR", { month: "long" }).format(new Date(event.date))}`}
                                    hour={`${event.hour.replace(":", "h").split(":")[0]}`}
                                    handleCancel={setOpenCancelModal}
                                    handleReschedule={setOpenReschedule}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                {isMobile && <Header type="student" />}
            </div>

            {openNewEvent && (
                <>
                    <NewEvent
                        isMobile={isMobile}
                        close={setOpenNewEvent}
                        openModal={setOpenSuccessModal}
                        insertedEvents={events}
                        insertEvent={setEvents}
                        title="Agendar horário"
                        buttonTitle="Agendar"
                    />
                </>
            )}

            {openReschedule && (
                <>
                    <NewEvent
                        isMobile={isMobile}
                        close={setOpenReschedule}
                        openModal={setOpenSuccessModal}
                        insertedEvents={events}
                        insertEvent={setEvents}
                        title="Reagendar horário"
                        buttonTitle="Reagendar"
                        isReschedule={true}
                        rescheduleId={selectedEventId}
                    />
                </>
            )}

            {openSuccessModal && (
                <SuccessModal
                    isMobile={isMobile}
                    closeThen={setOpenSuccessModal}
                    title="Agendamento Feito Com Sucesso"
                    content="Enviamos uma notificação para o seu Personal e avisaremos você assim que ele aceitar"
                />
            )}



            {openCancelModal && (
                <TimerModal
                    isMobile={isMobile}
                    closeThen={setOpenCancelModal}
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
                    callSuccessModal={setOpenSuccessModal}
                    isDelete={true}
                />
            )}
        </>
    );
}
