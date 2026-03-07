import { ArrowRight, CalendarIcon } from "lucide-react"
import styles from "./OverviewCardPackageStatus.module.css"
import { useNavigate } from "react-router-dom";

type Props = {
    actualPlan?: {
        nome: string;
        dataExpiracao: string;
    } | null;
}

export default function OverviewCardPackageStatus({ actualPlan }: Props) {

    function calculateProgress(dueDate: string): number {
        const today = new Date();
        const expiration = new Date(dueDate);

        const initial = new Date(expiration);
        initial.setFullYear(initial.getFullYear() - 1);

        const totalDays = expiration.getTime() - initial.getTime();
        const remainingDays = expiration.getTime() - today.getTime();

        if (totalDays <= 0) return 0;

        const progress = (remainingDays / totalDays) * 100;
        return Math.min(100, Math.max(0, Math.round(100 - progress)));
    }

    

    const progress = actualPlan ? calculateProgress(actualPlan.dataExpiracao) : 0;

    const nav = useNavigate();

    return (
        <section className={styles.section}>
            <div className={styles.iconBackground}>
                <svg width="83" height="99" viewBox="0 0 83 99" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M30.5 49L42.75 39.75L55 49L50.5 33.75L62.75 24H47.5L42.75 9L38 24H22.75L35 33.75L30.5 49ZM85.5 29.25C85.5 5.75 66.25 -13.25 42.75 -13.25C19.25 -13.25 0 5.75 0 29.25C0 40.25 4.25 50 10.75 57.5V98.75L42.75 88L74.75 98.75V57.5C81.25 50 85.5 40.25 85.5 29.25ZM42.75 -2.75C60.5 -2.75 74.75 11.75 74.75 29.25C74.75 47 60.5 61.25 42.75 61.25C25 61.25 10.75 47 10.75 29.25C10.75 11.75 25 -2.75 42.75 -2.75ZM42.75 77.25L21.5 82.75V66.25C27.75 69.75 35 72 42.75 72C50.5 72 57.75 69.75 64 66.25V82.75L42.75 77.25Z" fill="white" fillOpacity="0.1" />
                </svg>
            </div>

            <div className={styles.content}>
                <span className={styles.badge}>Plano Ativo</span>
                <h3 className={styles.planName}>{actualPlan?.nome}</h3>
                <p className={styles.expiryDate}>
                    <CalendarIcon size={17} />
                    Expira em {actualPlan?.dataExpiracao ? new Date(actualPlan.dataExpiracao).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" }) : "N/A"}
                </p>

                <div className={styles.progressBox}>
                    <div className={styles.progressHeader}>
                        <span className={styles.progressLabel}>Progresso restante </span>
                        <span className={styles.progressValue}>{progress}%</span>
                    </div>
                    <div className={styles.progressTrack}>
                        <div className={styles.progressBar} style={{ width: `${progress}%` }} />
                    </div>
                </div>

                <button className={styles.button} onClick={() => nav("/plans-history")}>
                    Histórico de compras
                    <ArrowRight size={17} />
                </button>
            </div>
        </section>
    )
}
