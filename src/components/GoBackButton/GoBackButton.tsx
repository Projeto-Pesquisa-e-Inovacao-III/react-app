import { Link, useNavigate } from "react-router-dom";
import styles from "./GoBackButton.module.css"
export default function GoBackButton({ to }: { to?: string }) {

    const navigate = useNavigate();

    return (
        <div className={styles.goBackLogin}>
            <Link to={to || "#"} onClick={(e) => {
                if (!to) {
                    e.preventDefault();
                    navigate(-1);
                }
            }}>
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