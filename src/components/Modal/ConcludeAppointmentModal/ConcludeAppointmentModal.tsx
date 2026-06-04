import React, { useState } from 'react';
import useModalClose from '../../../hooks/useModalClose';
import classNames from 'classnames';
import styles from './ConcludeAppointmentModal.module.css';
import Button from '../../Button/Button';
import TextareaWithIcon from '../../Inputs/TextareaWithIcon/TextareaWithIcon';
import InputTags from '../../Inputs/InputTags/InputTags';
import { Dumbbell, FileText } from 'lucide-react';

type Props = {
    isMobile?: boolean;
    closeThen: React.Dispatch<React.SetStateAction<string | boolean | null>> | (() => void);
    onSubmit: (data: { resumo: string; grupoMuscular: string[] }) => void | Promise<void>;
};

const MUSCLE_GROUPS_OPTIONS = [
    { value: "PEITO", label: "Peito" },
    { value: "COSTAS", label: "Costas" },
    { value: "TRAPEZIO", label: "Trapézio" },
    { value: "BICEPS", label: "Bíceps" },
    { value: "TRICEPS", label: "Tríceps" },
    { value: "ANTEBRACO", label: "Antebraço" },
    { value: "OMBRO", label: "Ombro" },
    { value: "ABDOMEN", label: "Abdômen" },
    { value: "QUADRICEPS", label: "Quadríceps" },
    { value: "POSTERIOR", label: "Posterior" },
    { value: "GLUTEO", label: "Glúteo" },
    { value: "PANTURRILHA", label: "Panturrilha" }
];

const labelToValueMap: Record<string, string> = {
    "peito": "PEITO",
    "costas": "COSTAS",
    "trapezio": "TRAPEZIO",
    "trapézio": "TRAPEZIO",
    "biceps": "BICEPS",
    "bíceps": "BICEPS",
    "triceps": "TRICEPS",
    "tríceps": "TRICEPS",
    "antebraço": "ANTEBRACO",
    "antegraco": "ANTEBRACO",
    "ombro": "OMBRO",
    "abdomen": "ABDOMEN",
    "abdômen": "ABDOMEN",
    "quadriceps": "QUADRICEPS",
    "quadríceps": "QUADRICEPS",
    "posterior": "POSTERIOR",
    "gluteo": "GLUTEO",
    "glúteo": "GLUTEO",
    "panturrilha": "PANTURRILHA"
};

const valueToLabelMap: Record<string, string> = {
    "PEITO": "Peito",
    "COSTAS": "Costas",
    "TRAPEZIO": "Trapézio",
    "BICEPS": "Bíceps",
    "TRICEPS": "Tríceps",
    "ANTEBRACO": "Antebraço",
    "OMBRO": "Ombro",
    "ABDOMEN": "Abdômen",
    "QUADRICEPS": "Quadríceps",
    "POSTERIOR": "Posterior",
    "GLUTEO": "Glúteo",
    "PANTURRILHA": "Panturrilha"
};

export default function ConcludeAppointmentModal({ isMobile, closeThen, onSubmit }: Props) {
    const [resumo, setResumo] = useState("");
    const [selectedMuscles, setSelectedMuscles] = useState<string[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { isClosing, handleAnimatedClose } = useModalClose({
        onClose: () => closeThen(false),
        lockScroll: false
    });

    function handleToggleMuscle(value: string) {
        setError("");
        setSelectedMuscles(prev =>
            prev.includes(value) ? prev.filter(m => m !== value) : [...prev, value]
        );
    }

    function handleTagsChange(tags: string[]) {
        setError("");
        const nextMuscles = tags
            .map(tag => {
                const normalized = tag.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                return labelToValueMap[normalized] || labelToValueMap[tag.toLowerCase()] || null;
            })
            .filter((val): val is string => val !== null);
        setSelectedMuscles(Array.from(new Set(nextMuscles)));
    }
    async function handleSend() {
        if (!resumo.trim()) {
            setError("O resumo é obrigatório.");
            return;
        }
        if (selectedMuscles.length === 0) {
            setError("Selecione pelo menos um grupo muscular.");
            return;
        }

        setLoading(true);
        try {
            await onSubmit({ resumo: resumo.trim(), grupoMuscular: selectedMuscles });
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const displayTags = selectedMuscles.map(m => valueToLabelMap[m] || m);

    return (
        <>
            <div className={classNames("overlay", {
                [styles.backdropEnter]: !isClosing,
                [styles.closingBackdrop]: isClosing,
            })} onClick={handleAnimatedClose}></div>
            <div className={classNames(styles.modal, {
                [styles.modalCard]: !isClosing,
                [styles.closing]: isClosing,
                [styles.mobileModal]: isMobile,
            })}>
                <h2 className={styles.title}>Conclusão de Agendamento</h2>

                <div className={styles.fieldGroup}>
                    <label className={styles.label}>
                        Resumo da Aula: <span className={styles.requiredAsterisk}>*</span>
                    </label>
                    <TextareaWithIcon
                        name="resumo"
                        id="resumo"
                        placeholder="Descreva brevemente como foi a aula, desempenho do aluno, etc."
                        maxLength={500}
                        value={resumo}
                        icon={<FileText />}
                        onInputChange={(value: string) => {
                            setResumo(value);
                            setError("");
                        }}
                    />
                </div>

                <div className={styles.fieldGroup}>
                    <label className={styles.label}>
                        Grupos Musculares Trabalhados: <span className={styles.requiredAsterisk}>*</span>
                    </label>
                    <InputTags
                        label=""
                        placeholder="Ex: Peito, Bíceps..."
                        maxTags={12}
                        maxTagCharacters={20}
                        value={displayTags}
                        onTagsChange={handleTagsChange}
                        icon={<Dumbbell size={16} />}
                    />
                    
                    <div className={styles.suggestionsContainer}>
                        <p className={styles.suggestionsTitle}>Toque para selecionar rapidamente:</p>
                        <div className={styles.suggestionsGrid}>
                            {MUSCLE_GROUPS_OPTIONS.map(option => {
                                const isSelected = selectedMuscles.includes(option.value);
                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        className={classNames(styles.muscleBadge, {
                                            [styles.muscleBadgeSelected]: isSelected
                                        })}
                                        onClick={() => handleToggleMuscle(option.value)}
                                    >
                                        {option.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {error && <p className={styles.errorMessage}>{error}</p>}

                <div className={styles.buttons}>
                    <Button 
                        typeButton='accept' 
                        title="Concluir Agendamento" 
                        type="button" 
                        classNameVariable={styles.btnSend} 
                        onClick={handleSend}
                        loading={loading}
                        classNameDiv={isMobile ? "w-full!" : "w-1/3"}
                    />
                    <Button 
                        typeButton='other' 
                        title="Cancelar" 
                        type="button" 
                        classNameVariable={styles.btnCancel} 
                        onClick={handleAnimatedClose} 
                        disabled={loading}
                    />
                </div>
            </div>
        </>
    );
}
