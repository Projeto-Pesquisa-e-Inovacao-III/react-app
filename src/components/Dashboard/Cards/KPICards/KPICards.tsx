import { Card, CardContent, Typography } from "@mui/material";

import styles from "./KPICards.module.css";
import classNames from "classnames";
import Skeleton from "react-loading-skeleton";

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
                        {isFull && <Typography variant="h5">{title ?? <Skeleton width={100} height={20} />}</Typography>}
                        <Typography variant="h4">{value ?? <Skeleton width={100} height={20} />}</Typography>
                        {isMobile && (
                            <Typography variant="body1">{description ?? <Skeleton width={100} height={20} />}</Typography>
                        )}
                    </div>
                    {isFull && <div className={styles.iconKpiDashboard}>{icon}</div>}
                </CardContent>
            </Card>
        </div>
    );
}