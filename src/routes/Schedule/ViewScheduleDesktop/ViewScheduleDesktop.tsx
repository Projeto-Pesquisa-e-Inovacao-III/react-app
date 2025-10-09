import { useEffect, useRef, useState } from "react";
import "./style.css"
import NewEvent from "../../../components/NewEvent/NewEventDesktop/NewEventDesktop";
import SuccessModal from "../../../components/Modal/SucessModalDesktop";
import UserScheduleCard from "../../../components/UserScheduleCard";
import ViewCalendarMonthStyled from "../../../components/ViewCalendarMonthStyled";
import UserHeaderDesktop from "../../../components/UserHeader/UserHeaderDesktop";
import NewEventDesktop from "../../../components/NewEvent/NewEventDesktop/NewEventDesktop";

// todo: check friday if cards will be mocked, backend or prototipe
export default function ViewScheduleDesktop() {
    const eventsMock = [
        { title: "Reunião", date: "2025-10-11", hour: "11:00:00" },
        { title: "Aniversário", date: "2025-10-22", hour: "12:00:00" },
    ];

    const [openNewEvent, setOpenNewEvent] = useState<boolean>(false);
    const [events, setEvents] = useState<typeof eventsMock>(eventsMock);
    const [openSuccessModal, setOpenSuccessModal] = useState<boolean>(false);

    return (
        <>
            <div className="user-view-schedule" >
                <UserHeaderDesktop />
                <div className="view-schedule">
                    <div className="schedule-page-calendar">
                        <ViewCalendarMonthStyled events={events} />
                    </div>
                    <div className="schedule-page-user-actions">
                        <div>
                            <button className="btn-sched" onClick={() => setOpenNewEvent(true)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
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
                    <NewEventDesktop close={setOpenNewEvent} openModal={setOpenSuccessModal} insertedEvents={events} insertEvent={setEvents} title="Agendar horário" />
                </>
            ) : null}

            {
                openSuccessModal ? (
                    <>
                        <SuccessModal closeThen={setOpenSuccessModal} title="Agendamento Feito Com Sucesso" content="Enviamos uma notificação para o seu Personal e avisaremos você assim que ele aceitar" />
                    </>
                ) : null
            }
        </>
    );
}
