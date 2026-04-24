import styles from "./InformationCard.module.css";
type Props = {
    icon: React.ReactNode | React.ReactElement;
    title: string;
    subtitle: string | undefined;
    subtitle2?: string;
}


export default function InformationCard({ icon, title, subtitle, subtitle2 }: Props) {
    return (
        <div className={styles.wrapper}>
            <label className={styles.label}>{title}</label>

            <div className={styles.card}>
                <div className={styles.iconWrapper}>
                    {icon}
                </div>

                <div>
                    <p className={styles.subtitle}>{subtitle}</p>
                    <p className={styles.subtitle2}>{subtitle2}</p>
                </div>
            </div>
        </div>
    )
}
