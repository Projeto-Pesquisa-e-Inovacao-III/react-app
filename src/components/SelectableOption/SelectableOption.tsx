import classNames from "classnames";
import styles from "./SelectableOption.module.css";

type SelectableOptionProps = {
    children: React.ReactNode;
    value: string;
    onClick: (value: string) => void;
    selected?: boolean;
    subtitle?: React.ReactNode;
    selectionType?: "radio" | "checkbox";
};

export function SelectableOption({ children, value, onClick, selected, subtitle, selectionType = "radio" }: SelectableOptionProps) {
    return (
        <button
            type="button"
            className={classNames(styles.selectableOption, {
                [styles.selectableOptionSelected]: selected
            })}
            role={selectionType}
            aria-checked={selected}
            onClick={() => onClick(value)}
        >
            <span className={classNames(styles.selectionMark, {
                [styles.checkboxMark]: selectionType === "checkbox",
                [styles.selectionMarkSelected]: selected
            })}>
                {selectionType === "checkbox" ? <span className={styles.checkboxTick}>✓</span> : <span className={styles.radioDot} />}
            </span>

            <span className={styles.optionText}>
                <span className={styles.optionLabel}>{children}</span>
                {subtitle ? <p className={styles.optionSubtitle}>{subtitle}</p> : null}
            </span>
        </button>
    );
}