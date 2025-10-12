import { useState } from "react";
import "./style.css"
import { Eye, EyeOff } from "lucide-react";

type Props = {
    type: string;
    placeholder: string;
    onInputChange?: React.Dispatch<React.SetStateAction<string>>;
    icon: React.ReactNode;
    isPassword?: boolean;
}

export default function InputWithIcon({ type, placeholder, onInputChange, icon, isPassword }: Props) {

    const [showPassword, setShowPassword] = useState<boolean>(false);

    return (
        <div className="wrapper_inp">
            <div className="input-icon">{icon}</div>
            <input
                type={isPassword && showPassword ? "text" : type}
                placeholder={placeholder}
                onChange={onInputChange ? (e) => onInputChange(e.target.value) : undefined}
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