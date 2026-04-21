import { useState } from "react";
import type { EventDTO } from "../../../../models/calendar";
import SmallerButton from "../../../SmallerButton/SmallerButton";
import styles from "../TimerModal.module.css";

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

export default function AcceptEvent({ isMobile, enableButton, handleCloseModal, callSuccessModal, buttonTitle }: DeleteEventProps) {
    const [loading, setLoading] = useState(false);

    function handleAcceptEvent() {
        setLoading(true);
        callSuccessModal?.(true);
    }

    return (
        <div className={isMobile ? styles.buttonsGroupModalMobile : styles.buttonsGroupModal}>
            <SmallerButton type="button" classname={enableButton ? "bg-green-600! h-12" : "bg-gray-400! h-12 cursor-not-allowed!"} title={buttonTitle || "Aceitar Evento"} handleButtonClick={handleAcceptEvent} disabled={!enableButton} loading={loading} />
            <SmallerButton type="button" classname="h-12" title="Voltar" handleButtonClick={handleCloseModal} />
        </div>
    )
}