import { useEffect, useRef, useState } from "react";
import UserHeaderDesktop from "../../components/UserHeader/UserHeaderDesktop";
import ViewCalendarMonthStyled from "../../components/ViewCalendarMonthStyled";
import "./style.css"
import NewEvent from "../../components/NewEvent";

export default function ViewSchedule() {
    const eventsMock = [
        { title: "Reunião", start: "2025-09-15T10:00:00", end: "2025-09-15T11:00:00" },
        { title: "Aniversário", start: "2025-09-22T12:00:00", end: "2025-09-22T13:00:00" },
    ];

    const [openNewEvent, setOpenNewEvent] = useState<boolean>(false);
    const [events, setEvents] = useState<typeof eventsMock>(eventsMock);

    return (
        <>
            <div className="user-view-schedule" >
                <UserHeaderDesktop />
                <div className="view-schedule">
                    <div className="schedule-page-calendar">
                        <ViewCalendarMonthStyled />
                    </div>
                    <div className="schedule-page-user-actions">
                        <div>
                            <button className="btn-sched" onClick={() => setOpenNewEvent(true)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                                Agendar
                            </button>
                        </div>
                        <div className="schedule-view">
                            <div className="left">
                                <span className="user-personal">Personal</span>
                                <div className="schedule-page-user">
                                    <img src="https://placehold.co/60x60/png" alt="" />
                                    <span>Nome</span>
                                </div>
                                <div className="btn-actions">
                                    <button className="btn-sched">Reagendar</button>
                                    <button className="btn-sched">Cancelar</button>
                                </div>
                            </div>
                            <span className="border-division"></span>
                            <div className="right">
                                <span>17 Setembro 12h30</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {openNewEvent ? (
                <>
                    <div className="overlay"></div>
                    <NewEvent close={setOpenNewEvent} insertedEvents={events} insertEvent={setEvents} title="Agendar horário" />
                </>
            ) : null}
        </>
    );
}
