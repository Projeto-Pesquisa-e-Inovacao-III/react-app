import styles from "./TextareaModal.module.css"

type Props = {
    title?: string;
    middleContent?: React.ReactNode | string;
    textareaTitle?: string;
    contentInsideTextarea?: React.ReactNode | string;
    closeThen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function TextareaModal(props: Props) {
    return (
        <>
            <div className="overlay"></div>
            <div className={styles.modal}>
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
                    <button onClick={() => props.closeThen(false)} className={styles.fechar}>
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
