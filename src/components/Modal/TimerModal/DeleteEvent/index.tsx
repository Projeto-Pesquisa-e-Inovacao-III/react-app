import "./style.css"
import type { EventDTO } from "../../../../models/calendar";
import SmallerButton from "../../../SmallerButton";

type DeleteEventProps = {
    isMobile: boolean;
    enableButton: boolean;
    handleCloseModal: () => void;
    id?: number | null;
    events?: EventDTO[];
    setEvents?: React.Dispatch<React.SetStateAction<EventDTO[]>>;
    callSuccessModal?: React.Dispatch<React.SetStateAction<boolean>>;
    buttonTitle?: string;
}

export default function DeleteEvent({ isMobile, enableButton, handleCloseModal, id, events, setEvents, callSuccessModal, buttonTitle }: DeleteEventProps) {
    function handleDeleteEvent() {

            callSuccessModal?.(true);

            handleCloseModal();
    }

    return (
        <div className={`buttons-group-modal${isMobile ? "-mobile" : ""}`}>
            <button disabled={!enableButton} className={`btn-sched ${!enableButton ? "btn-sched-disabled" : "btn-sched-red"}`} onClick={handleDeleteEvent}>
                {buttonTitle || "Cancelar Evento"}
            </button>
            <SmallerButton type="button" title="Voltar" handleButtonClick={handleCloseModal} />
        </div>
    )
}