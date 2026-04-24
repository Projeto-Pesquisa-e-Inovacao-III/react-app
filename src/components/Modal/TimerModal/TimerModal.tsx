import { useRef, useState } from 'react';
import useModalClose from '../../../hooks/useModalClose';
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import styles from "./TimerModal.module.css"
import DeleteEvent from './DeleteEvent';
import type { EventDTO } from '../../../models/calendar';
import AcceptEvent from './AcceptEvent';
import useClickOutside from '../../../hooks/useClickOutside';
import classnames from 'classnames';

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

    const { isClosing, handleAnimatedClose } = useModalClose({
        onClose: () => closeThen(false)
    });

    const modalRef = useRef<HTMLDivElement>(null);

      useClickOutside({
    ref: modalRef,
    callback: () => {
      handleAnimatedClose();
    }
  });


    const [enableButton, setEnableButton] = useState(false);

    return (
        <>
            <div className={classnames("overlay", {
                [styles.backdropEnter]: !isClosing,
                [styles.closingBackdrop]: isClosing,
            })}></div>
            <div ref={modalRef} className={classnames({
                [styles.modalEventCreated]: !isMobile,
                [styles.modalEventCreatedMobile]: isMobile,
                [styles.modalCard]: !isClosing,
                [styles.closing]: isClosing,
            }, classNameDiv)}>
                <h2>{title || "Cancelar!"}</h2>
                <p className={`${styles.contentModal} ${classNameText ? classNameText : ""}`}>{content || "Seu evento foi criado com sucesso."}</p>
                <CountdownCircleTimer
                    isPlaying
                    duration={1}
                    colors="#093a5d"
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
                        handleCloseModal={handleAnimatedClose}
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
                        handleCloseModal={handleAnimatedClose}
                        callSuccessModal={callSuccessModal}
                        buttonTitle={buttonTitle}
                    />
                )}

            </div>
        </>
    );
}
