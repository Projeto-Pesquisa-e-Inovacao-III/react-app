import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import styles from "./Input.module.css";
type Props = {
    type: string;
    placeholder?: string;
    label?: string;
    id?: string;
    name?: string;
    onInputChange?: React.Dispatch<React.SetStateAction<string>> | ((value: string) => void);
    onInputClick?: React.Dispatch<React.SetStateAction<string>> | ((value: string) => void);
    isPassword?: boolean;
    value?: string | number;
    icon?: React.ReactNode;
    onClickIcon?: () => void;
    classname?: string;
    classnameInput?: string;

    limit?: number;
}

export default function Input({ type, placeholder, label, id, name, onInputChange, onInputClick, isPassword, value, icon, onClickIcon, classname, classnameInput, limit }: Props) {
    const [showPassword, setShowPassword] = useState<boolean>(false);

    return (
        <div className={`${classname} ${styles.wrapperSoloInp}`} id={id}>
            {label && (
                <label htmlFor={`${id}-input`}>{label}</label>
            )}

            <input
                id={`${id}-input`}
                name={name}
                type={isPassword && showPassword ? "text" : type}
                className={`${isPassword ? styles.passwordInput : ""} ${classnameInput}`}
                placeholder={placeholder}
                onChange={onInputChange ? (e) => onInputChange(e.target.value) : undefined}
                onClick={onInputClick ? (e) => onInputClick(e.currentTarget.value) : undefined}
                value={value}
                maxLength={limit}
            />

            {icon && (
                <div className={styles.inputIcon} onClick={onClickIcon}>
                    {icon}
                </div>
            )}

            {limit && (
                <span className={styles.inputLimit}>{`${value?.toString().length || 0}/${limit}`}</span>
            )}

            {isPassword && (
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={styles.passwordToggle}
                >
                    {showPassword ? <EyeOff /> : <Eye />}
                </button>
            )}
        </div>

    )
}