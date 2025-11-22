import { Link, useNavigate } from "react-router-dom";
import styles from "./GoBackButton.module.css"
export default function GoBackButton({to}: {to?: string}) {

    const navigate = useNavigate();

    function handleGoBack() {
        navigate(-1);
    }

    return (
        <div className={styles.goBackLogin} onClick={!to ? () => handleGoBack() : undefined}>
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