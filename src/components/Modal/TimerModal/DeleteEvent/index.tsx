import type { EventDTO } from "../../../../models/calendar";
import SmallerButton from "../../../SmallerButton";

export default function DeleteEvent({ isMobile, enableButton, handleCloseModal, id, events, setEvents, callSuccessModal }: { isMobile: boolean; enableButton: boolean; handleCloseModal: () => void; id?: number | null; events?: EventDTO[]; setEvents?: React.Dispatch<React.SetStateAction<EventDTO[]>>; callSuccessModal?: React.Dispatch<React.SetStateAction<boolean>> }) {
    function handleDeleteEvent() {
        if (id !== undefined && events && setEvents) {
            setEvents(events.filter(event => event.id !== id));
            if (callSuccessModal) {
                callSuccessModal(true);
            }
            handleCloseModal();
        }
    }

    return (
        <div className={`buttons-group-modal${isMobile ? "-mobile" : ""}`}>
            <button className={`btn-sched ${!enableButton ? "btn-sched-disabled" : "btn-sched-red"}`} onClick={handleDeleteEvent}>Cancelar agendamento</button>
            <SmallerButton type="button" title="Voltar" handleButtonClick={handleCloseModal} />
        </div>
    )
}