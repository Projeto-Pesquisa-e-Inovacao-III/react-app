import { useState, useRef } from "react";
import useModalClose from "../../../hooks/useModalClose";
import useClickOutside from "../../../hooks/useClickOutside";
import SmallerButton from "../../SmallerButton/SmallerButton";
import styles from "./InputModal.module.css";
import classnames from "classnames";

type InputModalProps = {
    isMobile: boolean;
    closeThen: () => void;
    title: string;
    content: string;
    inputPlaceholder?: string;
    buttonTitle?: string;
    onConfirm: (value: string) => void;
};

export default function InputModal({
    isMobile,
    closeThen,
    title,
    content,
    inputPlaceholder = "Digite aqui...",
    buttonTitle = "Confirmar",
    onConfirm,
}: InputModalProps) {
    const { isClosing, handleAnimatedClose } = useModalClose({
        onClose: () => closeThen()
    });

    const modalRef = useRef<HTMLDivElement>(null);
    const [inputValue, setInputValue] = useState("");

    useClickOutside({
        ref: modalRef,
        callback: () => {
            handleAnimatedClose();
        }
    });

    const handleConfirm = () => {
        onConfirm(inputValue);
    };

    return (
        <>
            <div className={classnames("overlay", {
                [styles.backdropEnter]: !isClosing,
                [styles.closingBackdrop]: isClosing,
            })}></div>
            <div ref={modalRef} className={classnames(styles.modal, {
                [styles.modalMobile]: isMobile,
                [styles.modalCard]: !isClosing,
                [styles.closing]: isClosing,
            })}>
                <h2 className={styles.title}>{title}</h2>
                <p className={styles.content}>{content}</p>
                
                <input
                    type="text"
                    className={styles.input}
                    placeholder={inputPlaceholder}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    autoFocus
                />

                <div className={styles.buttons}>
                    <SmallerButton 
                        type="button" 
                        title="Cancelar" 
                        handleButtonClick={handleAnimatedClose} 
                        classname={styles.fecharBtn}
                    />
                    <SmallerButton 
                        type="button" 
                        title={buttonTitle} 
                        handleButtonClick={handleConfirm} 
                        classname={styles.enviarBtn}
                    />
                </div>
            </div>
        </>
    );
}
