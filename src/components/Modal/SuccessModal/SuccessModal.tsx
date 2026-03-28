import styles from "./SuccessModal.module.css";
import SmallerButton from "../../SmallerButton/SmallerButton";
import { useEffect, useState } from "react";
import classnames from "classnames";

export default function SuccessModal({ isMobile, closeThen, title, content }: { isMobile: boolean; closeThen: React.Dispatch<React.SetStateAction<boolean>>; title?: string; content?: string }) {

    const [isClosing, setIsClosing] = useState(false);

    function handleCloseModal() {
        setIsClosing(true);
        setTimeout(() => {
            document.body.style.overflow = 'auto';
            closeThen(false);
        }, 180);
    }

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        console.log("Modal aberto");
    }, []);

    return (
        <>
            <div className={classnames("overlay", {
                [styles.backdropEnter]: !isClosing,
                [styles.closingBackdrop]: isClosing,
            })}></div>
            <div className={classnames({
                [styles.modalEventCreated]: !isMobile,
                [styles.modalEventCreatedMobile]: isMobile,
                [styles.modalCard]: !isClosing,
                [styles.closing]: isClosing,
            })}>
                <h2>{title || "Evento criado com sucesso!"}</h2>
                <p className={styles.contentModal}>{content || "Seu evento foi criado com sucesso."}</p>
                <svg width="52" height="51" viewBox="0 0 52 51" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="0.5" width="51" height="51" rx="25.5" fill="#22C55E" />
                    <path d="M19.625 25.5L23.875 29.75L32.375 21.25" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>

                <SmallerButton classname="h-12" type="button" title="Fechar" handleButtonClick={handleCloseModal} />

            </div>
        </>
    );
}

