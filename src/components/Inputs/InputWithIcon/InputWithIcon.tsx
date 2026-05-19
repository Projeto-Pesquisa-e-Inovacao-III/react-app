import { useState } from "react";
import styles from "./InputWithIcon.module.css"
import { Eye, EyeOff } from "lucide-react";
import Skeleton from "react-loading-skeleton";

type Props = {
    type: string;
    placeholder?: string;
    icon: React.ReactNode;
    label?: React.ReactNode;
    id?: string;
    onInputChange?: React.Dispatch<React.SetStateAction<string>> | ((value: string) => void);
    onInputClick?: React.Dispatch<React.SetStateAction<string>> | ((value: string) => void);
    isPassword?: boolean;
    value?: string | number | undefined | null;
    mask?: (input: React.InputEvent<HTMLInputElement>) => void
    disabled?: boolean;
    readOnly?: boolean;
    customClassName?: string;
    classNameInput?: string;
    isLoading?: boolean;
    hasError?: boolean;
    hasSuccess?: boolean;

    allowDecimals?: boolean;
    maxLength?: number;
    maxDecimalPlaces?: number;

    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export default function InputWithIcon({ type, placeholder, label, id, onInputChange, icon, isPassword, value, mask, disabled, readOnly, customClassName, classNameInput, isLoading, allowDecimals, maxLength, maxDecimalPlaces, hasError, hasSuccess, onBlur }: Props) {
    const [showPassword, setShowPassword] = useState<boolean>(false);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (type === "number") {
            let val = e.target.value.replace(/\./g, ",");
            
            if (allowDecimals) {
                val = val.replace(/[^\d,]/g, "");
                
                const parts = val.split(",");
                if (parts.length > 2) {
                    val = parts[0] + "," + parts.slice(1).join("");
                }

                const splitParts = val.split(",");
                let integerPart = splitParts[0];
                let decimalPart: string | undefined = splitParts[1];

                if (typeof maxDecimalPlaces === "number" && maxDecimalPlaces >= 0 && decimalPart !== undefined) {
                    decimalPart = decimalPart.slice(0, maxDecimalPlaces);
                }

                if (maxLength && maxLength > 0) {
                    if (integerPart.length > maxLength) {
                        integerPart = integerPart.slice(0, maxLength);
                    }
                    if (integerPart.length >= maxLength && decimalPart === "") {
                        decimalPart = undefined;
                    }
                }

                val = decimalPart !== undefined ? `${integerPart},${decimalPart}` : integerPart;
                if (e.target.value.endsWith(",") && !val.includes(",")) {
                    if (!maxLength || integerPart.length < maxLength) {
                        val += ",";
                    }
                }
            } else {
                val = val.replace(/\D/g, "");
                if (maxLength && maxLength > 0) {
                    val = val.slice(0, maxLength);
                }
            }

            e.target.value = val;
            onInputChange?.(val);
            return;
        }

        let val = e.target.value;
        if (maxLength && maxLength > 0) {
            val = val.slice(0, maxLength);
            e.target.value = val;
        }
        onInputChange?.(val);
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (type === "number") {
            const allowed = [
                "Backspace", "Delete", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Tab"
            ];

            if (allowed.includes(e.key)) return;
            if (e.ctrlKey || e.metaKey) return;

            if (e.key === "." || e.key === ",") {
                if (!allowDecimals) {
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
                            className={`${isPassword ? styles.passwordInput : ""} ${classNameInput || ""} ${hasError ? styles.errorInput : ""} ${hasSuccess ? styles.successInput : ""} ${!icon ? styles.noIconInput : ""} ${maxLength != null ? styles.limitInput : ""}`}
                            placeholder={placeholder}
                            onInput={(e) => mask ? mask(e) : undefined}
                            value={value ?? undefined}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            disabled={disabled}
                            readOnly={readOnly}
                            maxLength={type === "number" && allowDecimals && maxLength != null ? maxLength + 1 : maxLength}
                            onBlur={onBlur}
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
                        {maxLength != null && (
                            <span 
                                className={styles.inputLimit}
                                style={isPassword ? { right: '2.5rem' } : {}}
                            >
                                {type === "number" ? String(value || "").replace(/\D/g, "").length : (value != null ? String(value).length : 0)}/{maxLength}
                            </span>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}