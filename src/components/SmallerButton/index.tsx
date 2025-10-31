import { useEffect, type JSX } from "react";
import "./style.css";
type SmallerButtonProps = {
    type?: "button" | "submit";
    icon?: JSX.Element;
    title: string;
    value?: string;
    selected?: boolean;
    handleButtonClick?: (value: string | boolean) => void;
};
export default function SmallerButton({ type, icon, title, value, selected, handleButtonClick }: SmallerButtonProps) {
    useEffect(() => {
        if (selected && handleButtonClick) {
            handleButtonClick(value ?? "");
        }
    }, [selected]);
    return (
        <button
            className={`btn-sched`}
            type={type}
            onClick={() => handleButtonClick?.(value ?? "")}
        >
            {icon && <span className="icon">{icon}</span>}
            {title}
        </button>
    )
}