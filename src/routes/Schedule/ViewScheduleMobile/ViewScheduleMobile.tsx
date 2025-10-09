import { useEffect, useRef, useState } from "react";
import "./style.css"
import NewEvent from "../../../components/NewEvent/NewEventDesktop/NewEventDesktop";
import SuccessModal from "../../../components/Modal/SucessModalDesktop";
import UserScheduleCard from "../../../components/UserScheduleCard";
import ViewCalendarMonthStyled from "../../../components/ViewCalendarMonthStyled";
import UserHeaderDesktop from "../../../components/UserHeader/UserHeaderDesktop";
import NewEventMobile from "../../../components/NewEvent/NewEventMobile/NewEventMobile";
import SuccessModalMobile from "../../../components/Modal/SucessModalMobile";

// todo: check friday if cards will be mocked, backend or prototipe
export default function ViewScheduleMobile() {
    const eventsMock = [
        { title: "Reunião", date: "2025-10-11", hour: "11:00:00" },
        { title: "Aniversário", date: "2025-10-22", hour: "12:00:00" },
    ];

    const [openNewEvent, setOpenNewEvent] = useState<boolean>(false);
    const [events, setEvents] = useState<typeof eventsMock>(eventsMock);
    const [openSuccessModal, setOpenSuccessModal] = useState<boolean>(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [openSuccessModal]);

    return (
        <>
            <div className="user-view-schedule-mobile" >
                <div className="view-schedule-mobile">
                    <div className="schedule-page-calendar-mobile">
                        <ViewCalendarMonthStyled isMobile={true} events={events} />
                    </div>
                    <div className="schedule-page-user-actions-mobile">
                        <div>
                            <button className="btn-sched-mobile" onClick={() => setOpenNewEvent(true)}>
                                Agendar
                            </button>
                        </div>
                        <UserScheduleCard />
                    </div>
                </div>
            </div>
            {openNewEvent ? (
                <>
                    <div className="overlay"></div>
                    <NewEventMobile close={setOpenNewEvent} openModal={setOpenSuccessModal} insertedEvents={events} insertEvent={setEvents} title="Agendar horário" />
                </>
            ) : null}

            {
                openSuccessModal ? (
                    <>
                        <SuccessModalMobile closeThen={setOpenSuccessModal} title="Agendamento Feito Com Sucesso" content="Enviamos uma notificação para o seu Personal e avisaremos você assim que ele aceitar" />
                    </>
                ) : null
            }
        </>
    );
}
