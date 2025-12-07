import { useState } from "react";
import "./style.css"
import { Eye, EyeOff } from "lucide-react";

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
}

export default function Input({ type, placeholder, label, id, name, onInputChange, onInputClick, isPassword, value, icon, onClickIcon }: Props) {
    const [showPassword, setShowPassword] = useState<boolean>(false);

    return (
        <div className="wrapper_solo_inp" id={id}>   
            {label &&
                <label htmlFor={`${id}-input`}>{label}</label>
            }
            <input
                id={`${id}-input`}
                name={name}
                type={isPassword && showPassword ? "text" : type}
                className={`${isPassword ? `password-input` : ``}`}
                placeholder={placeholder}
                onChange={onInputChange ? (e) => onInputChange(e.target.value) : undefined}
                onClick={onInputClick ? (e) => onInputClick(e.currentTarget.value) : undefined}
                value={value}
            />
            {icon && (
                <div className="input-icon" onClick={onClickIcon}>
                    {icon}
                </div>
            )}
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