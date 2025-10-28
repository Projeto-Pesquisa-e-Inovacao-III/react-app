import "./style.css"

export default function Button({ type, title, classNameVariable, onClick }: { type: "submit" | "button", title: string, classNameVariable?: string, onClick?: () => void }) {
        

    return (
        <div className="btn-generic">
            <button className={`${type} ${classNameVariable}`} type={type} onClick={onClick}>{title}</button>
        </div>
    )
}