import useModalClose from "../../../hooks/useModalClose";
import styles from "./TextareaModal.module.css"
import classnames from "classnames"

type Props = {
    title?: string;
    middleContent?: React.ReactNode | string;
    textareaTitle?: string;
    contentInsideTextarea?: React.ReactNode | string;
    closeThen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function TextareaModal(props: Props) {
    const { isClosing, handleAnimatedClose } = useModalClose({
        onClose: () => props.closeThen(false)
    });

    return (
        <>
            <div className={classnames("overlay", {
                [styles.backdropEnter]: !isClosing,
                [styles.closingBackdrop]: isClosing,
            })}></div>
            <div className={classnames(styles.modal, {
                [styles.modalCard]: !isClosing,
                [styles.closing]: isClosing,
            })}>
                <h2 className={styles.title}>{props.title}</h2>

                {props.middleContent && (<div className={styles.middleContent}>
                    {props.middleContent}
                </div>
                )}

                <div className={styles.fieldGroup}>
                    <label className={styles.label}>{props.textareaTitle}</label>
                    <span contentEditable="true">
                        {props.contentInsideTextarea && (
                            props.contentInsideTextarea
                        )}
                    </span>
                </div>

                <div className={styles.buttons}>
                    <button onClick={handleAnimatedClose} className={styles.fechar}>
                        Fechar
                    </button>
                    <button onClick={() => { }} className={styles.enviar}>
                        Enviar
                    </button>
                </div>
            </div>
        </>
    );
}
