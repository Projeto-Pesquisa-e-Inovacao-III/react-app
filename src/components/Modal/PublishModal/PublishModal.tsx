import { useRef, useState } from 'react';
import classnames from 'classnames';
import { X, Tag, FileText } from 'lucide-react';
import styles from './PublishModal.module.css';
import useModalClose from '../../../hooks/useModalClose';
import useClickOutside from '../../../hooks/useClickOutside';
import useMobile from '../../../hooks/isMobile';
import InputWithIcon from '../../Inputs/InputWithIcon/InputWithIcon';
import TextareaWithIcon from '../../Inputs/TextareaWithIcon/TextareaWithIcon';
import SmallerButton from '../../SmallerButton/SmallerButton';

type PublishModalProps = {
    closeThen: () => void;
    isSaving: boolean;
    onConfirm: (modificationName: string, description: string) => Promise<void>;
};

export default function PublishModal({ closeThen, isSaving, onConfirm }: PublishModalProps) {
    const isMobileDevice = useMobile();
    const modalRef = useRef<HTMLDivElement>(null);
    const [modificationName, setModificationName] = useState('');
    const [description, setDescription] = useState('');

    const { isClosing, handleAnimatedClose } = useModalClose({
        onClose: closeThen,
        duration: 200,
        lockScroll: false,
    });

    useClickOutside({
        ref: modalRef,
        callback: () => {
            if (!isSaving) handleAnimatedClose();
        },
    });

    const handleConfirm = async () => {
        if (!modificationName.trim()) return;
        await onConfirm(modificationName.trim(), description.trim());
    };

    return (
        <>
            <div
                className={classnames('overlay', styles.overlayPublish, {
                    [styles.backdropEnter]: !isClosing,
                    [styles.closingBackdrop]: isClosing,
                })}
            />
            <div
                ref={modalRef}
                className={classnames(styles.modalContainer, {
                    [styles.modalContainerMobile]: isMobileDevice,
                    [styles.modalCard]: !isClosing,
                    [styles.closing]: isClosing,
                })}
            >
                <div className={styles.header}>
                    <h2>Publicar modificação</h2>
                    <button
                        className={styles.closeButton}
                        onClick={handleAnimatedClose}
                        disabled={isSaving}
                        aria-label="Fechar"
                    >
                        <X size={22} color="#909fb5" />
                    </button>
                </div>

                <div className={styles.form}>
                    <InputWithIcon
                        id="publish-modification-name"
                        type="text"
                        label="Nome da modificação"
                        placeholder="Ex: Atualização da seção hero"
                        icon={<Tag size={16} />}
                        value={modificationName}
                        onInputChange={setModificationName}
                        disabled={isSaving}
                        maxLength={100}
                        customClassName={styles.nameInput}
                    />

                    <TextareaWithIcon
                        id="publish-description"
                        label="Descrição (opcional)"
                        placeholder="Descreva brevemente as alterações realizadas..."
                        icon={<FileText size={16} />}
                        value={description}
                        onInputChange={setDescription}
                        disabled={isSaving}
                        maxLength={500}
                        rows={4}
                        customClassName={styles.descriptionInput}
                    />

                    <div className={styles.buttonGroup}>
                        <SmallerButton
                            classname={styles.confirmBtn}
                            handleButtonClick={handleConfirm}
                            disabled={isSaving || !modificationName.trim()}
                            loading={isSaving}
                            title="Publicar"
                        />
                        <SmallerButton
                            classname={styles.cancelBtn}
                            handleButtonClick={handleAnimatedClose}
                            disabled={isSaving}
                            title="Cancelar"
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
