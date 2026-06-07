import styles from "./KPICards.module.css";
import classNames from "classnames";

type Props = {
    isMobile: boolean;
    value: string | number | undefined;
    description?: string;
    icon: React.ReactNode;
    title?: string;
    isFull?: boolean;
}

export default function KPICards({
    isMobile,
    value,
    description,
    icon,
    title,
    isFull = false,
}: Props) {

    const isCompactMobile = isMobile && !isFull;

    return (
        <div
            className={classNames(
                styles.kpiCardDashboard,
                { [styles.kpiMobile]: isMobile && isFull },
                { [styles.kpiCardMobileCompact]: isCompactMobile }
            )}
        >
            <div className={styles.card}>
                <div className={isFull ? styles.cardContent : styles.cardContentColumn}>

                    {/* Texto */}
                    <div className={styles.cardContentColumn} style={{ flex: 1 }}>
                        {isFull && (
                            title
                                ? <p className={styles.kpiTitle}>{title}</p>
                                : <div className={styles.skeletonTitle} />
                        )}

                        {value !== undefined
                            ? <p className={styles.kpiValue}>{value}</p>
                            : <div className={styles.skeletonValue} />
                        }

                        {isMobile && !isFull && (
                            description
                                ? <p className={styles.kpiDescription}>{description}</p>
                                : <div className={styles.skeletonTitle} />
                        )}
                    </div>

                    {/* Ícone */}
                    {(isFull || isCompactMobile) && (
                        <div className={styles.iconWrapper}>
                            {icon}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}