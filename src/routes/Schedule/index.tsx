import { useEffect, useState } from "react";
import "./style.css"
import "./mobile.css"
import UserScheduleCard from "../../components/UserScheduleCard";
import ViewCalendarMonthStyled from "../../components/ViewCalendarMonthStyled";
import UserHeaderMobile from "../../components/UserHeader/UserHeaderMobile/UserHeaderMobile";
import UserHeaderDesktop from "../../components/UserHeader/UserHeaderDesktop/UserHeaderDesktop";
import NewEvent from "../../components/NewEvent";
import { useMediaQuery } from "@mui/material";
import SuccessModal from "../../components/Modal/SuccessModal";

export default function ViewSchedule() {
    const isMobile = useMediaQuery("(max-width:1024px)");

    const eventsMock = [
        { title: "Reunião", date: "2025-10-11", hour: "11:00:00" },
        { title: "Aniversário", date: "2025-10-22", hour: "12:00:00" },
    ];

    const [openNewEvent, setOpenNewEvent] = useState(false);
    const [events, setEvents] = useState(eventsMock);
    const [openSuccessModal, setOpenSuccessModal] = useState(false);

    useEffect(() => {
        if (isMobile) window.scrollTo(0, 0);
    }, [openSuccessModal, isMobile]);

    const Header = isMobile ? UserHeaderMobile : UserHeaderDesktop;

    return (
        <>
            <div className={`user-view-schedule${isMobile ? "-mobile" : ""}`}>
                {!isMobile && <Header />}
                <div className={`view-schedule${isMobile ? "-mobile" : ""}`}>
                    <div className={`schedule-page-calendar${isMobile ? "-mobile" : ""}`}>
                        <ViewCalendarMonthStyled isMobile={isMobile} events={events} />
                    </div>
                    <div className={`schedule-page-user-actions${isMobile ? "-mobile" : ""}`}>
                        <div>
                            <button
                                className={`btn-sched${isMobile ? " btn-sched-mobile" : ""}`}
                                onClick={() => setOpenNewEvent(true)}
                            >
                                {!isMobile && (
                                    <svg
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
                                    </svg>
                                )}
                                Agendar
                            </button>
                        </div>

                        {events.map((event, index) => (
                            <UserScheduleCard
                                key={`${event.title}-${index}`}
                                date={`${event.date.split("-").reverse()[0]} de ${new Intl.DateTimeFormat("pt-BR", { month: "long" }).format(new Date(event.date))}`}
                                hour={`${event.hour.replace(":", "h").split(":")[0]}`}
                            />
                        ))}
                    </div>
                </div>
                {isMobile && <Header />}
            </div>

            {openNewEvent && (
                <>
                    <div className="overlay"></div>

                    <NewEvent
                        isMobile={isMobile}
                        close={setOpenNewEvent}
                        openModal={setOpenSuccessModal}
                        insertedEvents={events}
                        insertEvent={setEvents}
                        title="Agendar horário"
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
        </>
    );
}
