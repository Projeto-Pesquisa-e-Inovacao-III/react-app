import { useState } from "react";
import styles from "./InputWithIcon.module.css"
import { Eye, EyeOff } from "lucide-react";
import Skeleton from "react-loading-skeleton";

type Props = {
    type: string;
    placeholder?: string;
    icon: React.ReactNode;
    label?: string;
    id?: string;
    onInputChange?: React.Dispatch<React.SetStateAction<string>> | ((value: string) => void);
    onInputClick?: React.Dispatch<React.SetStateAction<string>> | ((value: string) => void);
    isPassword?: boolean;
    value?: string | number | undefined | null;
    mask?: (input: React.FormEvent<HTMLInputElement>) => void
    disabled?: boolean;
    customClassName?: string;
    classNameInput?: string;
    isLoading?: boolean;
    
    allowDecimals?: boolean;
}

export default function InputWithIcon({ type, placeholder, label, id, onInputChange, onInputClick, icon, isPassword, value, mask, disabled, customClassName, classNameInput, isLoading, allowDecimals }: Props) {
    const [showPassword, setShowPassword] = useState<boolean>(false);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (type === "number") {
            let value = e.target.value.replace(",", ".");
            if (allowDecimals) {
                value = value.replace(/[^\d.]/g, "");
                const parts = value.split(".");
                if (parts.length > 2) {
                    value = parts[0] + "." + parts.slice(1).join("");
                }
            } else {
                value = value.replace(/\D/g, "");
            }
            e.target.value = value;
            onInputChange?.(value);
            return;
        }
        onInputChange?.(e.target.value);
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (type === "number") {
            const allowed = [
                "Backspace", "Delete", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Tab"
            ];

            if (allowed.includes(e.key)) return;
            if (e.ctrlKey || e.metaKey) return;

            if (e.key === "." || e.key === ",") {
                if (!allowDecimals || e.currentTarget.value.includes(".") || e.currentTarget.value.includes(",")) {
                    e.preventDefault();
                }
                return;
            }

            if (!/^\d$/.test(e.key)) {
                e.preventDefault();
            }
        }
    }


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
                            type={isPassword && showPassword ? "text" : (type === "number" ? "text" : type)}
                            inputMode={type === "number" ? "decimal" : undefined}
                            className={`${isPassword ? styles.passwordInput : ""} ${classNameInput || ""}`}
                            placeholder={placeholder}
                            onInput={(e) => mask ? mask(e) : undefined}
                            value={value ?? undefined}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            disabled={disabled}
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