import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import "./style.css";
import { useEffect, useState } from "react";
import NewEvent from "../../NewEvent/NewEvent";
export default function CalendarWeek({ insertedEvents, isMobile, openModal }: { insertedEvents: any[], isMobile: boolean, openModal: React.Dispatch<React.SetStateAction<boolean>> }) {
    const [openNewEvent, setOpenNewEvent] = useState<boolean>(false);
    // i could use just a react-query to get the events
    const [events, setEvents] = useState<any>(insertedEvents);

    useEffect(() => {
        const eventsMock = insertedEvents.map(event => ({
            title: event.title,
            start: `${event.date}T${event.hour}`,
            end: `${event.date}T${event.hour}`,
        }));
        setEvents(eventsMock);
    }, [insertedEvents]);

    return (
        <div className="container-calendar-week-personal">
            <div className="wrapper-callendar" id="wrapper-callendar">
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin]}
                    initialView="timeGridWeek"
                    locale={"pt-br"}
                    allDaySlot={false}
                    eventTimeFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
                    slotLabelFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
                    timeZone="local"
                    dayHeaderFormat={{ weekday: `${isMobile ? 'short' : 'long'}` }}
                    businessHours={true}
                    events={events}
                    headerToolbar={{
                        start: "newEvent",
                        center: "title",
                        end:  `${isMobile ? '' : 'today '}prev,next`,
                    }}
                    customButtons={{
                        newEvent: {
                            text: "novo evento",
                            click: function () {
                                setOpenNewEvent(true);
                            },
                        },
                    }}
                />
            </div>
            {openNewEvent ? (
                <NewEvent openModal={openModal} isMobile={isMobile} close={setOpenNewEvent} insertedEvents={events} insertEvent={setEvents} />

            ) : null}
        </div>
    );
}