import { useEffect, type JSX } from "react";
import styles from "./SmallerButton.module.css";
import { Oval } from "react-loader-spinner";
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

    loading?: boolean;
};
export default function SmallerButton({ type, icon, iconPosition, title, value, selected, classname, handleButtonClick, disabled, loading }: SmallerButtonProps) {
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
            {loading &&
                <Oval
                    height={25}
                    width={25}
                    color="#fff"
                    visible={true}
                    ariaLabel="oval-loading"
                    secondaryColor="#fff"
                    strokeWidth={3}
                    strokeWidthSecondary={3}

                />
            }
            {!loading && title}

            {icon && iconPosition === "right" && <span className={styles.icon}>{icon}</span>}
        </button>
    )
}