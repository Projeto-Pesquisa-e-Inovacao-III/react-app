import "./style.css"

type Props = {
    type: "submit" | "button";
    title: string;
    classNameVariable?: string;
    onClick?: () => void;
}

export default function Button({ type, title, classNameVariable, onClick }: Props) {
    return (
        <div className="btn-generic">
            <button className={`${type} ${classNameVariable}`} type={type} onClick={onClick}>{title}</button>
        </div>
    )
}