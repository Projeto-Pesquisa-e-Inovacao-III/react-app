import { useState } from "react";
import styles from "./InputWithIcon.module.css"
import { Eye, EyeOff } from "lucide-react";
import Skeleton from "react-loading-skeleton";

type Props = {
    type: string;
    placeholder: string;
    icon: React.ReactNode;
    label?: string;
    id?: string;
    onInputChange?: React.Dispatch<React.SetStateAction<string>> | ((value: string) => void);
    onInputClick?: React.Dispatch<React.SetStateAction<string>> | ((value: string) => void);
    isPassword?: boolean;
    value?: string;
    mask?: (input: React.FormEvent<HTMLInputElement>) => void
    disabled?: boolean;

    customClassName?: string;
    classNameInput?: string;
    isLoading?: boolean;
}

export default function InputWithIcon({ type, placeholder, label, id, onInputChange, onInputClick, icon, isPassword, value, mask, disabled, customClassName, classNameInput, isLoading }: Props) {
    const [showPassword, setShowPassword] = useState<boolean>(false);

    console.log("InputWithIcon render", { type, placeholder, label, id, value, disabled, isLoading });

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (type === "number") {
            const sanitized = e.target.value.replace(/\D/g, "");
            e.target.value = sanitized;
            if (onInputChange) onInputChange(sanitized);
            return;
        }
        if (onInputChange) onInputChange(e.target.value);
    };

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (type === "number") {
            const allowed = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Tab"];
        if (allowed.includes(e.key)) return;
        if (e.ctrlKey || e.metaKey) return;

        if (!/^\d$/.test(e.key)) {
            e.preventDefault();
        }
        }
    };


    return (
        <div className={`${styles.wrapperInp} ${customClassName || ""}`} id={id}>
            {label &&
                <label htmlFor={`${id}-input`}>{label}</label>
            }
            <div className={`relative`}>
                <div className={styles.inputIcon}>{icon}</div>
                {isLoading ? (
                    <Skeleton height={40} />
                ) : (
                    <>
                        <input
                            id={`${id}-input`}
                            type={isPassword && showPassword ? "text" : type}
                            className={`${isPassword ? styles.passwordInput : undefined} ${classNameInput || ""}`}
                            placeholder={placeholder}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            onClick={onInputClick ? (e) => onInputClick(e.currentTarget.value) : undefined}
                            onInput={(e) => mask ? mask(e) : undefined}
                            value={value}
                            disabled={disabled}
                            min={type === "number" ? 0 : undefined}
                        />
                        {isPassword && (
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className={styles.passwordToggle}
                            >
                                {showPassword ? <EyeOff /> : <Eye />}
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}