import { useEffect, type JSX } from "react";
import "./style.css";
type SmallerButtonProps = {
    type?: "button" | "submit";
    icon?: JSX.Element;
    title: string;
    value?: string;
    selected?: boolean;
    classname?: string;
    handleButtonClick?: (value: string | boolean) => void;
};
export default function SmallerButton({ type, icon, title, value, selected, classname, handleButtonClick }: SmallerButtonProps) {
    useEffect(() => {
        if (selected && handleButtonClick) {
            handleButtonClick(value ?? "");
        }
    }, [selected]);
    return (
        <button
            className={`btn-sched ${classname ?? ""}`}
            type={type}
            onClick={() => handleButtonClick?.(value ?? "")}
        >
            {icon && <span className="icon">{icon}</span>}
            {title}
        </button>
    )
}