import styles from './StatusSchedule.module.css'

type StatusScheduleProps = {
    dotColor?: string;
    statusText?: string;
}

export default function StatusSchedule(props: StatusScheduleProps) {
    return (
        <div className={styles.statusPendingCheckSchedule}>
            <svg width="7" height="7" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="3.5" cy="3.5" r="3.5" fill={props.dotColor || "#D7AC00"} />
            </svg>

            <span className={styles.textPendingCheckSchedule}>{props.statusText || "Pendente (aluno)"}</span>
        </div>
    )
}
