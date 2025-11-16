import React, { useState } from 'react'
import Select from '../../Inputs/Select'
import classNames from 'classnames';
import styles from './RegisterAbsenceModal.module.css'
import Button from '../../Button/Button';


export default function RegisterAbsenceModal({ closeThen }: { closeThen: React.Dispatch<React.SetStateAction<boolean>> }) {

    const [changeSelectType, setChangeSelectType] = useState<string>("Aluno");
    const [justified, setJustified] = useState<boolean>(false);

    return (
        <>
            <div className="overlay" onClick={() => closeThen(false)}></div>
            <div className={styles.modal}>
                <h2 className={styles.title}>Registrar ausência</h2>

                <Select
                    label="Motivo da ausência"
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
                            <span contentEditable={!justified}></span>
                        </div>
                    </div>
                )}

                {changeSelectType === "Personal" && (
                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>Motivo: </label>
                        <div className={classNames(styles.reasonText)}>
                            <span contentEditable="true"></span>
                        </div>
                    </div>
                )}

                <div className={styles.buttons}>
                    <Button title="Enviar" type="button" classNameVariable="btn-send" onClick={() => closeThen(false)} />
                    <Button title="Cancelar" type="button" classNameVariable="btn-cancel" onClick={() => closeThen(false)} />
                </div>
            </div>
        </>
    )
}
