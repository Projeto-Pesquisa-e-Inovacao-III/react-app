import useModalClose from "../../../hooks/useModalClose";
import InputWithIcon from "../../Inputs/InputWithIcon/InputWithIcon";
import TextareaWithIcon from "../../Inputs/TextareaWithIcon/TextareaWithIcon";
import SmallerButton from "../../SmallerButton/SmallerButton";
import styles from "./PublishModal.module.css";
import classnames from "classnames";
import { useState } from "react";
import { Tag, AlignLeft } from "lucide-react";

type Props = {
    closeThen: () => void;
    onConfirm: (name: string, description: string) => void;
    isSaving: boolean;
}

export default function PublishModal({ closeThen, onConfirm, isSaving }: Props) {
    const { isClosing, handleAnimatedClose } = useModalClose({
        onClose: closeThen
    });

    const [modificationName, setModificationName] = useState("");
    const [description, setDescription] = useState("");

    return (
        <>
            <div className={classnames("overlay", {
                [styles.backdropEnter]: !isClosing,
                [styles.closingBackdrop]: isClosing,
            })} onClick={handleAnimatedClose}></div>
            
            <div className={classnames(styles.modal, {
                [styles.modalCard]: !isClosing,
                [styles.closing]: isClosing,
            })}>
                
                <div className={styles.titleSection}>
                    <h2>Publicar Modificação</h2>
                    <p>Registre as informações relevantes sobre esta atualização.</p>
                </div>

                <div className={styles.formContainer}>
                    <InputWithIcon
                        type="text"
                        id="modificationName"
                        label={<span className={styles.labelSpan}>Nome da modificação *</span>}
                        placeholder="Ex: Atualização do banner principal"
                        icon={<Tag size={20} className="text-gray-400" />}
                        value={modificationName}
                        onInputChange={setModificationName}
                    />

                    <TextareaWithIcon
                        id="description"
                        label={<span className={styles.labelSpan}>Descrição (opcional)</span>}
                        placeholder="Descreva o que foi alterado nesta versão..."
                        icon={<AlignLeft size={20} className="text-gray-400" />}
                        value={description}
                        onInputChange={setDescription}
                        rows={4}
                    />
                </div>

                <div className={styles.footer}>
                    <SmallerButton 
                        handleButtonClick={handleAnimatedClose} 
                        classname={styles.cancelBtn}
                        disabled={isSaving}
                        title="Cancelar"
                    />
                    <SmallerButton 
                        handleButtonClick={() => {
                            if (!modificationName.trim()) {
                                alert("O nome da modificação é obrigatório.");
                                return;
                            }
                            onConfirm(modificationName, description);
                        }} 
                        classname={styles.confirmBtn}
                        disabled={!modificationName.trim()}
                        loading={isSaving}
                        title="Confirmar Publicação"
                    />
                </div>
            </div>
        </>
    );
}
