import "./style.css"

export default function Button({ type, title }: { type: "submit" | "button", title: string }) {
    return (
        <div className="btn-generic">
            <button className={`${type}`} type={type}>{title}</button>
        </div>
    )
}