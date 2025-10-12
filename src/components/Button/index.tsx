import "./style.css"

export default function Button({type}: {type: "submit" | "button"}) {
    return (
        <button className={`btn-generic ${type}`} type={type}>Entrar</button>
    )
}