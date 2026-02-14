import { useEffect, type JSX } from "react";
import styles from "./SmallerButton.module.css";
type SmallerButtonProps = {
    type?: "button" | "submit";
    icon?: JSX.Element;
    iconPosition?: "left" | "right";
    title?: string;
    value?: string;
    selected?: boolean;
    classname?: string;
    handleButtonClick?: (value: string | boolean) => void;
    disabled?: boolean;
};
export default function SmallerButton({ type, icon, iconPosition, title, value, selected, classname, handleButtonClick, disabled }: SmallerButtonProps) {
    useEffect(() => {
        if (selected && handleButtonClick) {
            handleButtonClick(value ?? "");
        }
    }, [selected]);
    return (
        <button
            className={`${styles.btnSched} ${classname ?? ""}`}
            type={type}
            onClick={() => handleButtonClick?.(value ?? "")}
            disabled={disabled}
        >

            {icon && iconPosition === "left" && <span className={styles.icon}>{icon}</span>}
            {icon && !iconPosition && <span className={styles.icon}>{icon}</span>}
            {title}
            {icon && iconPosition === "right" && <span className={styles.icon}>{icon}</span>}
        </button>
    )
}