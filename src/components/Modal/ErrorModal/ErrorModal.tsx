import React, { useEffect } from 'react'
import styles from "./ErrorModal.module.css";
import useMobile from '../../../hooks/isMobile';
import SmallerButton from '../../SmallerButton';

export default function ErrorModal({ closeThen, title, content }: { closeThen: React.Dispatch<React.SetStateAction<boolean>>; title?: string; content?: string }) {

    const isMobileDevice = useMobile();

    function handleCloseModal() {
        document.body.style.overflow = 'auto';
        closeThen(false);
    }

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        console.log("Modal aberto");
    }, []);

    return (
        <>
            <div className={`overlay ${styles.overlayError}`}></div>
            <div className={`${styles.modalEventCreated} ${isMobileDevice ? styles.modalEventCreatedMobile : ''}`}>
                <h2>{title || "Evento criado com sucesso!"}</h2>
                <p className={styles.contentModal}>{content || "Erro."}</p>
                <svg width="68" height="66" viewBox="0 0 68 66" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="68" height="66" rx="33" fill="#B64B44" />
                    <path d="M42.5 24.75L25.5 41.25" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M25.5 24.75L42.5 41.25" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>


                <SmallerButton type="button" title="Fechar" handleButtonClick={handleCloseModal} />

            </div>
        </>
    );
}
