import { useEffect, useState } from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import "./timerModal.css"
import DeleteEvent from './DeleteEvent';
import type { EventDTO } from '../../../models/calendar';
import AcceptEvent from './AcceptEvent';

type TimerModalProps = {
    isMobile: boolean;
    closeThen: React.Dispatch<React.SetStateAction<string | boolean | null>> | (() => void);
    title?: string;
    content?: string;
    id?: number | null;
    events?: EventDTO[];
    setEvents?: React.Dispatch<React.SetStateAction<EventDTO[]>>;
    callSuccessModal?: React.Dispatch<React.SetStateAction<boolean>> | (() => void);
    buttonTitle?: string;
    isDelete?: boolean;
    classNameDiv?: string;
    classNameText?: string;
}

export default function TimerModal({ isMobile, closeThen, title, content, id, events, setEvents, callSuccessModal, buttonTitle, isDelete, classNameDiv, classNameText }: TimerModalProps) {

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        
        return () => {
            document.body.style.overflow = '';
        };

    }, [])


    const [enableButton, setEnableButton] = useState(false);

    return (
        <>
            <div className="overlay"></div>
            <div className={`modal-event-created${isMobile ? "-mobile" : ""} ${classNameDiv ? classNameDiv : ""}`}>
                <h2>{title || "Cancelar!"}</h2>
                <p className={`content-modal ${classNameText ? classNameText : ""}`}>{content || "Seu evento foi criado com sucesso."}</p>
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
                        id={id}
                        events={events}
                        setEvents={setEvents}
                        handleCloseModal={closeThen}
                        callSuccessModal={callSuccessModal}
                        buttonTitle={buttonTitle}
                    />
                ) : (
                    <AcceptEvent
                        isMobile={isMobile}
                        enableButton={enableButton}
                        id={id}
                        events={events}
                        setEvents={setEvents}
                        handleCloseModal={closeThen}
                        callSuccessModal={callSuccessModal}
                        buttonTitle={buttonTitle}
                    />
                )}

            </div>
        </>
    );
}
