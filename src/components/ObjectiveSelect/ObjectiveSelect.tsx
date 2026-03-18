import { useRef, useState, type ReactNode } from "react";
import { BicepsFlexed, ChevronDown, Flag, HeartPulse, Sparkles, Weight } from "lucide-react";
import useClickOutside from "../../hooks/useClickOutside";
import styles from "./ObjectiveSelect.module.css";

type ObjectiveSelectProps = {
    value: string | null;
    onChange: (value: string) => void;
};

const OBJECTIVE_OPTIONS: Array<{ icon?: ReactNode; label: string; value: string }> = [
    { icon: <Weight />, label: "Emagrecimento", value: "EMAGRECIMENTO" },
    { icon: <HeartPulse />, label: "Saúde e bem-estar", value: "SAUDE_BEM_ESTAR" },
    { icon: <Sparkles />, label: "Estética", value: "ESTETICA" },
    { icon: <BicepsFlexed />, label: "Ganho de massa", value: "GANHO_MASSA" },
    { label: "Outro", value: "OUTRO" }
];

export default function ObjectiveSelect({ value, onChange }: ObjectiveSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useClickOutside({
        ref: wrapperRef,
        callback: () => setIsOpen(false)
    });

    const selectedOption = OBJECTIVE_OPTIONS.find((option) => option.value === value);

    return (
        <div className={styles.container} ref={wrapperRef}>
            <label className={styles.label} htmlFor="objective-trigger">
                Objetivo Principal <span className={styles.requiredAsterisk}>*</span>
            </label>

            <button
                id="objective-trigger"
                type="button"
                className={styles.trigger}
                onClick={() => setIsOpen((previous) => !previous)}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <span className={styles.triggerContent}>
                    <span className={styles.icon}>
                        {selectedOption?.icon ?? <Flag size={16} />}
                    </span>
                    <span className={styles.text}>
                        {selectedOption?.label ?? "Selecione seu objetivo"}
                    </span>
                </span>

                <ChevronDown className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`} size={18} />
            </button>

            {isOpen && (
                <div className={styles.dropdown} role="listbox" aria-label="Objetivo Principal">
                    {OBJECTIVE_OPTIONS.map((option) => {
                        const isSelected = option.value === value;

                        return (
                            <button
                                type="button"
                                key={option.value}
                                className={`${styles.option} ${isSelected ? styles.optionSelected : ""}`}
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                            >
                                {option.icon ? <span className={styles.optionIcon}>{option.icon}</span> : null}
                                <span>{option.label}</span>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}