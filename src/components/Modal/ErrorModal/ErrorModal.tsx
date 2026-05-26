import React, { useRef } from 'react'
import useModalClose from '../../../hooks/useModalClose';
import styles from "./ErrorModal.module.css";
import useMobile from '../../../hooks/isMobile';
import SmallerButton from '../../SmallerButton/SmallerButton';
import useClickOutside from '../../../hooks/useClickOutside';
import classnames from 'classnames';

export default function ErrorModal({ closeThen, title, content }: { closeThen: React.Dispatch<React.SetStateAction<boolean>>; title?: string; content?: string }) {

    const isMobileDevice = useMobile();
    const { isClosing, handleAnimatedClose: handleCloseModal } = useModalClose({
        onClose: () => closeThen(false)
    });

    const packagePageRef = useRef<HTMLDivElement>(null);

    useClickOutside({
        ref: packagePageRef,
        callback: () => {
            handleCloseModal();
        }
    });

    return (
        <>
            <div className={classnames("overlay", styles.overlayError, {
                [styles.backdropEnter]: !isClosing,
                [styles.closingBackdrop]: isClosing,
            })}></div>
            <div ref={packagePageRef} className={classnames(styles.modalEventCreated, {
                [styles.modalEventCreatedMobile]: isMobileDevice,
                [styles.modalCard]: !isClosing,
                [styles.closing]: isClosing,
            })}>
                <h2>{title || "Evento criado com sucesso!"}</h2>
                <p className={styles.contentModal}>{content || "Erro."}</p>
                <svg width="68" height="66" viewBox="0 0 68 66" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="68" height="66" rx="33" fill="#B64B44" />
                    <path d="M42.5 24.75L25.5 41.25" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M25.5 24.75L42.5 41.25" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>

                <SmallerButton classname="h-12" type="button" title="Fechar" handleButtonClick={handleCloseModal} />

            </div>
        </>
    );
}
