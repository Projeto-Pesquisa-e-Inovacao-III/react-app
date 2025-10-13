import type { JSX } from "react";
import "./style.css";
// eventToReschedule is when user wants to reschedule an event, so the button that matches the hour of that event should be highlighted
export default function SmallerButton({ type, icon, title, value, selected, eventToReschedule, handleButtonClick }: { type?: "button" | "submit"; icon?: JSX.Element; title: string; value?: string; selected?: boolean; eventToReschedule?: any; handleButtonClick?: (value: string) => void }) {
    return (
        <button
            className={`btn-sched ${eventToReschedule?.hour === title ? "btn-selected" : ""} ${selected ? "btn-selected" : ""}`}
            type={type}
            onClick={() => handleButtonClick?.(value ?? "")}
        >
            {icon && <span className="icon">{icon}</span>}
            {title}
        </button>
    )
}