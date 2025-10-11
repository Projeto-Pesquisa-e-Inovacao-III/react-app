import type { EventDTO } from "../../../../models/calendar";

export default function DeleteEvent({ isMobile, enableButton, handleCloseModal, id, events, setEvents }: { isMobile: boolean; enableButton: boolean; handleCloseModal: () => void; id?: number | null; events?: EventDTO[]; setEvents?: React.Dispatch<React.SetStateAction<EventDTO[]>> }) {
    function handleDeleteEvent() {
        console.log("handleDeleteEvent called");
        console.log("enableButton:", enableButton);
        console.log("id:", id);
        console.log("events before deletion:", events);
        console.log("setEvents function:", setEvents);
        if (id !== undefined && events && setEvents) {
            console.log("deleting event with id:", id);
            setEvents(events.filter(event => event.id !== id));
            handleCloseModal();
        }
    }

    return (
        <div className={`buttons-group-modal${isMobile ? "-mobile" : ""}`}>
            <button className={`btn-sched ${!enableButton ? "btn-sched-disabled" : "btn-sched-red"}`} onClick={handleDeleteEvent}>Cancelar agendamento</button>
            <button className={`btn-sched`} onClick={handleCloseModal}>Voltar</button>
        </div>
    )
}