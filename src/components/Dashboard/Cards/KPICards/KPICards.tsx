import { Card, CardContent, Typography } from "@mui/material";

import styles from "./KPICards.module.css";
import classNames from "classnames";

export default function KPICards({
    isMobile,
    value,
    description,
    icon,
    title,
    isFull,
}: {
    isMobile: boolean;
    value: string;
    description?: string;
    icon: React.ReactNode;
    title?: string;
    isFull?: boolean;
}) {
    return (
        <div
            className={classNames(styles.kpiCardDashboard, { [styles.full]: isFull }, { [styles.kpiMobile]: isMobile && isFull })}
        >
            <Card>
                <CardContent>
                    <div className={styles.wrapperDetailsKpiDashboard}>
                        {isMobile && !isFull && (
                            <div className={styles.iconKpiDashboard}>{icon}</div>
                        )}
                        {isFull && <Typography variant="h5">{title}</Typography>}
                        <Typography variant="h4">{value}</Typography>
                        {isMobile && (
                            <Typography variant="body1">{description}</Typography>
                        )}
                    </div>
                    {isFull && <div className={styles.iconKpiDashboard}>{icon}</div>}
                </CardContent>
            </Card>
        </div>
    );
}