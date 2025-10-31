import { useEffect, useState } from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import "./timerModal.css"
import DeleteEvent from './DeleteEvent';
import type { EventDTO } from '../../../models/calendar';
import AcceptEvent from './AcceptEvent';

type TimerModalProps = {
    isMobile: boolean;
    closeThen: React.Dispatch<React.SetStateAction<boolean>>;
    title?: string;
    content?: string;
    id?: number | null;
    events?: EventDTO[];
    setEvents?: React.Dispatch<React.SetStateAction<EventDTO[]>>;
    callSuccessModal?: React.Dispatch<React.SetStateAction<boolean>> | (() => void);
    buttonTitle?: string;
    isDelete?: boolean;
}

export default function TimerModal({ isMobile, closeThen, title, content, id, events, setEvents, callSuccessModal, buttonTitle, isDelete }: TimerModalProps) {
    const [mounted, setMounted] = useState(false)

    //vlw pedrão
    function unmount() {
        document.body.style.overflow = 'auto';
    }

    useEffect(() => {
        setMounted(true);
        document.body.style.overflow = 'hidden';

    }, [])

    function handleCloseModal() {
        unmount();
        closeThen(false);
    }

    const [enableButton, setEnableButton] = useState(false);

    return (
        <>
            <div className="overlay"></div>
            <div className={`modal-event-created${isMobile ? "-mobile" : ""}`}>
                <h2>{title || "Cancelar!"}</h2>
                <p className="content-modal">{content || "Seu evento foi criado com sucesso."}</p>
                <CountdownCircleTimer
                    isPlaying
                    duration={1}
                    colors="#093A5D"
                    size={50}
                    strokeWidth={3}
                    onComplete={() => {
                        setEnableButton(true);
                    }}

                >
                    {({ remainingTime }) => remainingTime}
                </CountdownCircleTimer>
                {isDelete ? (
                    <DeleteEvent
                        isMobile={isMobile}
                        enableButton={enableButton}
                        handleCloseModal={handleCloseModal}
                        id={id}
                        events={events}
                        setEvents={setEvents}
                        callSuccessModal={callSuccessModal}
                        buttonTitle={buttonTitle}
                    />
                ) : (
                    <AcceptEvent
                        isMobile={isMobile}
                        enableButton={enableButton}
                        handleCloseModal={handleCloseModal}
                        id={id}
                        events={events}
                        setEvents={setEvents}
                        callSuccessModal={callSuccessModal}
                        buttonTitle={buttonTitle}
                    />
                )}

            </div>
        </>
    );
}
