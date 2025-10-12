import { Link } from "react-router-dom";
import "./style.css"
export default function GoBackButton({to}: {to?: string}) {
    return (
        <div className="go-back-login">
            <Link to={to}>
                <svg width="14" height="12" viewBox="0 0 14 12" fill="none">
                    <path
                        d="M7 10.75L1 5.74998M1 5.74998L7 0.75M1 5.74998H13.5"
                        stroke="black"
                    />
                </svg>
                <span>Voltar</span>
            </Link>
        </div>
    )
}