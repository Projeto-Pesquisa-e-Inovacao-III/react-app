import type { EventDTO } from "../../../../models/calendar";
import SmallerButton from "../../../SmallerButton/SmallerButton";

type DeleteEventProps = {
    isMobile: boolean;
    enableButton: boolean;
    handleCloseModal?: React.Dispatch<React.SetStateAction<string | boolean | null>> | (() => void);
    id?: number | null;
    events?: EventDTO[];
    setEvents?: React.Dispatch<React.SetStateAction<EventDTO[]>>;
    callSuccessModal?: React.Dispatch<React.SetStateAction<boolean>>;
    buttonTitle?: string;
}

export default function AcceptEvent({ isMobile, enableButton, handleCloseModal, id, events, setEvents, callSuccessModal, buttonTitle }: DeleteEventProps) {
    function handleAcceptEvent() {

            callSuccessModal?.(true);
    }

    return (
        <div className={`buttons-group-modal${isMobile ? "-mobile" : ""}`}>
            <button disabled={!enableButton} className={`btn-sched ${!enableButton ? "btn-sched-disabled" : "btn-sched-green"}`} onClick={handleAcceptEvent}>
                {buttonTitle || "Cancelar Evento"}
            </button>
            <SmallerButton type="button" title="Voltar" handleButtonClick={handleCloseModal} />
        </div>
    )
}