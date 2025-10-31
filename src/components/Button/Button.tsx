import "./style.css"

type Props = {
    type: "submit" | "button";
    title: string;
    icon?: React.ReactNode;
    classNameVariable?: string;
    onClick?: () => void;
}

export default function Button({ type, title, classNameVariable, onClick, icon }: Props) {
    return (
        <div className="btn-generic">
            <button className={`${type} ${classNameVariable}`} type={type} onClick={onClick}>
                {icon && <span className="icon">{icon}</span>}
                {title}
            </button>
        </div>
    )
}