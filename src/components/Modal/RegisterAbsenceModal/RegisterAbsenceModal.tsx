import React, { useState } from 'react'
import Select from '../../Inputs/Select/Select'
import classNames from 'classnames';
import styles from './RegisterAbsenceModal.module.css'
import Button from '../../Button/Button';

type Props = {
    closeThen: React.Dispatch<React.SetStateAction<boolean>>;
    callSuccessModal?: () => void;
    onSubmit: (data: { type: string; description: string; }) => void;
}


export default function RegisterAbsenceModal({ closeThen, callSuccessModal, onSubmit }: Props) {
    const [changeSelectType, setChangeSelectType] = useState<string>("Aluno");
    const [justified, setJustified] = useState<boolean>(false);
    const [description, setDescription] = useState("");

    function handleSend() {
        const payload = {
            type: changeSelectType.toUpperCase(),
            description,
        };

        onSubmit(payload);
        callSuccessModal && callSuccessModal();
    }

    return (
        <>
            <div className="overlay" onClick={() => closeThen(false)}></div>
            <div className={styles.modal}>
                <h2 className={styles.title}>Registrar ausência</h2>

                <Select
                    label="Tipo de ausência:"
                    options={["Aluno", "Personal"]}
                    placeholder="Selecione o motivo da ausência"
                    onInputChange={(value: string) => { setChangeSelectType(value) }}
                />
                {/* se for aluno */}
                {changeSelectType === "Aluno" && (
                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>Motivo: </label>
                        <div className={classNames(styles.reasonText, { [styles.reasonTextNotJustified]: justified })}>
                            <button onClick={() => setJustified(!justified)}>{justified ? "Justificado" : "Não justificado"}</button>
                            <span contentEditable={!justified} onInput={(e) => setDescription(e.currentTarget.textContent || "")}></span>
                        </div>
                    </div>
                )}

                {changeSelectType === "Personal" && (
                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>Motivo: </label>
                        <div className={classNames(styles.reasonText)}>
                            <span contentEditable="true" onInput={(e) => setDescription(e.currentTarget.textContent || "")}></span>
                        </div>
                    </div>
                )}

                <div className={styles.buttons}>
                    <Button typeButton='accept' title="Enviar" type="button" classNameVariable="btn-send" onClick={handleSend} />
                    <Button typeButton='other' title="Cancelar" type="button" classNameVariable="btn-cancel" onClick={() => closeThen(false)} />
                </div>
            </div>
        </>
    )
}
