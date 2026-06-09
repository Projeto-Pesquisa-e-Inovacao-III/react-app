import classNames from 'classnames';
import styles from './SummaryCard.module.css';

interface SummaryCardProps {
    dateStr: string;
    muscles?: string[];
    resumo?: string;
}

export default function SummaryCard({ dateStr, muscles = [], resumo }: SummaryCardProps) {
    return (
        <div className={styles.lastScheduleCard}>
            <div className={styles.lastScheduleHeader}>
                <div className={styles.lastScheduleTitleRow}>
                    <div className={styles.lastScheduleCircle}></div>
                    <span className={styles.lastScheduleTitle}>{dateStr}</span>
                </div>
                {muscles.length > 0 && (
                    <span className={classNames(styles.lastScheduleBadge, styles.badgePresencial)}>
                        {muscles.map((m) => m.charAt(0) + m.slice(1).toLowerCase()).join(', ')}
                    </span>
                )}
            </div>
            <div className={styles.lastScheduleDesc}>
                {resumo || "Sem observações"}
            </div>
        </div>
    );
}
