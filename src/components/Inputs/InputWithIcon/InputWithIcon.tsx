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
    isLoading?: boolean;
}

export default function InputWithIcon({ type, placeholder, label, id, onInputChange, onInputClick, icon, isPassword, value, mask, disabled, customClassName, isLoading }: Props) {
    const [showPassword, setShowPassword] = useState<boolean>(false);

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
                            className={isPassword ? styles.passwordInput : undefined}
                            placeholder={placeholder}
                            onChange={onInputChange ? (e) => onInputChange(e.target.value) : undefined}
                            onClick={onInputClick ? (e) => onInputClick(e.currentTarget.value) : undefined}
                            onInput={(e) => mask ? mask(e) : undefined}
                            value={value}
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