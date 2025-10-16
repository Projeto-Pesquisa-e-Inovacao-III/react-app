import "./style.css"

export default function Button({ type, title, classNameVariable }: { type: "submit" | "button", title: string, classNameVariable?: string }) {
    return (
        <div className="btn-generic">
            <button className={`${type} ${classNameVariable}`} type={type}>{title}</button>
        </div>
    )
}