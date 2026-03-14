import classNames from "classnames";
import styles from "./SelectableOption.module.css";



export function SelectableOption({ children, value, onClick, selected }: { children: React.ReactNode; value: string; onClick: (value: string) => void; selected?: boolean }) {
    
    return (
        <button
            type="button"
            className={classNames(styles.selectableOption, {
                [styles.selectableOptionSelected]: selected
            })}
            onClick={() => onClick(value)}
        >
            <span className={classNames(styles.radioMark, {
                [styles.radioMarkSelected]: selected
            })}>
                <span className={styles.radioDot} />
            </span>
            <span className={styles.optionLabel}>{children}</span>
        </button>
    );
}