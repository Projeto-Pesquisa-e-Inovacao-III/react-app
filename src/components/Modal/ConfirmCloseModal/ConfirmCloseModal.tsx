import { useRef, useEffect } from "react";
import classnames from "classnames";
import useModalClose from "../../../hooks/useModalClose";
import SmallerButton from "../../SmallerButton/SmallerButton";
import useClickOutside from "../../../hooks/useClickOutside";
import styles from "./ConfirmCloseModal.module.css";

import useMobile from "../../../hooks/isMobile";

type ConfirmCloseModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
};

export default function ConfirmCloseModal({ isOpen, onClose, onConfirm }: ConfirmCloseModalProps) {
    const isMobile = useMobile();
    const modalRef = useRef<HTMLDivElement>(null);

    const { isClosing, handleAnimatedClose } = useModalClose({
        onClose,
        duration: 300,
        lockScroll: true,
    });

    useClickOutside({
        ref: modalRef,
        callback: handleAnimatedClose,
    });

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                handleAnimatedClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);

    if (!isOpen && !isClosing) return null;

    return (
        <>
            <div
                className={classnames("z-1000! overlay", {
                    [styles.backdropEnter]: !isClosing,
                    [styles.closingBackdrop]: isClosing,
                })}
                onClick={handleAnimatedClose}
            />
            <div
                ref={modalRef}
                className={classnames(styles.modalEventCreated, {
                    [styles.modalEventCreatedMobile]: isMobile,
                    [styles.modalCard]: !isClosing,
                    [styles.closing]: isClosing,
                }
                )}
            >
                <h2>Descartar alterações?</h2>
                <p className={styles.contentModal}>Você tem alterações não salvas. Se fechar agora, elas serão perdidas.</p>
                <div className={styles.actions}>
                    <SmallerButton
                        type="button"
                        title="Continuar editando"
                        handleButtonClick={handleAnimatedClose}
                        classname={styles.cancelButton}
                    />
                    <SmallerButton
                        type="button"
                        title="Fechar e descartar"
                        handleButtonClick={onConfirm}
                        classname={styles.confirmButton}
                    />
                </div>
            </div>
        </>
    );
}