import React, { useEffect, useRef } from 'react';
import useModalClose from '../../../hooks/useModalClose';
import styles from "./ConfirmCloseModal.module.css";
import useMobile from '../../../hooks/isMobile';
import classnames from 'classnames';
import useClickOutside from '../../../hooks/useClickOutside';
import Button from '../../Button/Button';
import { X } from 'lucide-react';
import classNames from 'classnames';

type ConfirmCloseModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
};

export default function ConfirmCloseModal({ isOpen, onClose, onConfirm }: ConfirmCloseModalProps) {
    const isMobileDevice = useMobile();
    const modalRef = useRef<HTMLDivElement>(null);

    const { isClosing, handleAnimatedClose: handleCloseModal } = useModalClose({
        onClose: () => onClose(),
        duration: 200,
        lockScroll: false
    });

    useClickOutside({
        ref: modalRef,
        callback: () => {
            handleCloseModal();
        }
    });

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                e.preventDefault();
                e.stopImmediatePropagation();
                handleCloseModal();
            }
        };
        // Use capture phase to intercept before the underlying modal
        document.addEventListener("keydown", handleKeyDown, true);
        return () => document.removeEventListener("keydown", handleKeyDown, true);
    }, [handleCloseModal]);

    if (!isOpen) return null;

    return (
        <>
            <div className={classnames("overlay", styles.overlayConfirm, {
                [styles.backdropEnter]: !isClosing,
                [styles.closingBackdrop]: isClosing,
            })}></div>
            <div ref={modalRef} className={classnames(styles.modalContainer, {
                [styles.modalContainerMobile]: isMobileDevice,
                [styles.modalCard]: !isClosing,
                [styles.closing]: isClosing,
            })}>
                <div className={styles.header}>
                    <button className={styles.closeButton} onClick={handleCloseModal}>
                        <X size={24} color="#909fb5" />
                    </button>
                </div>
                <div className={styles.iconContainer}>
                    <svg width="68" height="66" viewBox="0 0 68 66" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="68" height="66" rx="33" fill="#FFEFEF" />
                        <path d="M34 20.375V35.5" stroke="#B64B44" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M34 46.5H34.025" stroke="#B64B44" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <h2>Você tem alterações não salvas</h2>
                <p className={styles.contentModal}>Deseja mesmo fechar? Todas as alterações não salvas serão perdidas.</p>
                
                <div className={styles.buttonGroup}>
                    <Button 
                        type="button" 
                        title="Fechar e descartar" 
                        classNameDiv={styles.buttonDiv}
                        classNameVariable={classNames(styles.confirmBtn, "p-3!")}
                        onClick={() => {
                            // Call onConfirm to actually close/discard
                            onConfirm();
                        }} 
                    />
                    <Button 
                        type="button" 
                        title="Continuar editando" 
                        classNameDiv={classNames(styles.buttonDiv, "p-0!")}
                        classNameVariable={classNames(styles.cancelBtn, "p-3!")}
                        onClick={handleCloseModal} 
                    />
                </div>
            </div>
        </>
    );
}
