import React from 'react';
import styles from './MetricCard.module.css';
import Skeleton from 'react-loading-skeleton';
import classNames from 'classnames';

type MetricCardProps = {
    label: string;
    value?: React.ReactNode;
    unit?: string;
    isLoading?: boolean;
    isText?: boolean;
    className?: string;
}

export default function MetricCard({ label, value, unit, isLoading, isText, className }: MetricCardProps) {
    return (
        <div className={classNames(styles.metricCard, className)}>
            <span className={styles.metricLabel}>{label}</span>
            {isLoading ? (
                <Skeleton width={isText ? 120 : 80} height={36} />
            ) : (
                isText ? (
                    <span className={styles.metricText}>{value ?? "N/A"}</span>
                ) : (
                    <span className={styles.metricValue}>
                        {value ?? "N/A"}
                        {unit && <small className={styles.metricUnit}> {unit}</small>}
                    </span>
                )
            )}
        </div>
    );
};

