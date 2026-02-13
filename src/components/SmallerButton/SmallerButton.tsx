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
};
export default function SmallerButton({ type, icon, iconPosition, title, value, selected, classname, handleButtonClick }: SmallerButtonProps) {
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
        >

            {icon && iconPosition === "left" && <span className={styles.icon}>{icon}</span>}
            {icon && !iconPosition && <span className={styles.icon}>{icon}</span>}
            {title}
            {icon && iconPosition === "right" && <span className={styles.icon}>{icon}</span>}
        </button>
    )
}