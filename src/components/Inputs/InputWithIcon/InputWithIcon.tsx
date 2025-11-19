import { useState } from "react";
import "./style.css"
import { Eye, EyeOff } from "lucide-react";

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
    mask?: (input: React.FormEvent<HTMLInputElement>) => void;
}

export default function InputWithIcon({ type, placeholder, label, id, onInputChange, onInputClick, icon, isPassword, value, mask }: Props) {
    const [showPassword, setShowPassword] = useState<boolean>(false);

    return (
        <div className="wrapper_inp" id={id}>
            {label &&
                <label htmlFor={`${id}-input`}>{label}</label>
            }
            <div className="input-icon">{icon}</div>
            <input
                id={`${id}-input`}
                type={isPassword && showPassword ? "text" : type}
                className={`${isPassword ? `password-input` : ``}`}
                placeholder={placeholder}
                onChange={onInputChange ? (e) => onInputChange(e.target.value) : undefined}
                onClick={onInputClick ? (e) => onInputClick(e.currentTarget.value) : undefined}
                onInput={(e) => mask ? mask(e) : undefined}
                value={value}
            />
            {isPassword && (
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
                >
                    {showPassword ? <EyeOff /> : <Eye />}
                </button>
            )}
        </div>
    )
}