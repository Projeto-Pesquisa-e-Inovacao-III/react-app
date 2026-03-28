import { useRef, useState } from "react";
import styles from "./PopupModal.module.css";
import useClickOutside from "../../../hooks/useClickOutside";
import SmallerButton from "../../SmallerButton/SmallerButton";
import classnames from "classnames";

type PopupModalProps = {
    closeThen: () => void;
    clickedDate?: string;
};

export default function PopupModal({ closeThen, clickedDate }: Readonly<PopupModalProps>) {
    const popupRef = useRef<HTMLDivElement>(null);
    const [isClosing, setIsClosing] = useState(false);

    function handleAnimatedClose() {
        setIsClosing(true);
        setTimeout(() => {
            closeThen();
        }, 200);
    }

    useClickOutside({
        ref: popupRef,
        callback: handleAnimatedClose,
    });

    return (
        <>
            <div
                className={classnames("overlay", {
                    [styles.backdropEnter]: !isClosing,
                    [styles.closingBackdrop]: isClosing,
                })}
                onClick={handleAnimatedClose}
            />
            <div ref={popupRef} className={classnames(styles.popupModal, {
                [styles.popupEnter]: !isClosing,
                [styles.closing]: isClosing,
            })}>
                <div className={styles.popupIndicator} />
                <h2>{clickedDate || "Aviso"}</h2>
                <p>{clickedDate ? `Você tem um agendamento para ${clickedDate}.` : "Atenção às novas atualizações."}</p>
                <SmallerButton classname="h-12" type="button" title="Fechar" handleButtonClick={handleAnimatedClose} />
            </div>
        </>
    );
}