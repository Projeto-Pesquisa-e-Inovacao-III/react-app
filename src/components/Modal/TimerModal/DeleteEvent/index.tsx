import "./style.css"
import type { EventDTO } from "../../../../models/calendar";
import SmallerButton from "../../../SmallerButton/SmallerButton";
import { useState } from "react";

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

export default function DeleteEvent({ isMobile, enableButton, handleCloseModal, id, events, setEvents, callSuccessModal, buttonTitle }: DeleteEventProps) {
    const [loading, setLoading] = useState(false);


    function handleDeleteEvent() {
        setLoading(true);
        setEvents?.(events!.filter(event => event.id !== id));
        callSuccessModal?.(true);
    }

    return (
        <div className={`buttons-group-modal${isMobile ? "-mobile" : ""}`}>
            {/* <button disabled={!enableButton} className={`btn-sched ${!enableButton ? "btn-sched-disabled" : "btn-sched-red"}`} onClick={handleDeleteEvent}>
                {buttonTitle || "Cancelar Evento"}
            </button> */}
            <SmallerButton type="button" classname={enableButton ? "bg-red-900! h-12!" : "bg-gray-400!  h-12 cursor-not-allowed!"} title={buttonTitle || "Cancelar Evento"} handleButtonClick={handleDeleteEvent} disabled={!enableButton} loading={loading}/>

            <SmallerButton classname="h-12" type="button" title="Voltar" handleButtonClick={handleCloseModal} />
        </div>
    )
}