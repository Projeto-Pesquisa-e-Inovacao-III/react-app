import React from 'react'
import styles from './CheckScheduleKpis.module.css'

type Props = {
    title: string | React.ReactNode
    value: string | number | React.ReactNode
    color?: string
    customClass?: string
}

export default function CheckScheduleKpis({ title, value, color }: Props) {
    return (
        <div className={styles.cardContainer}>
            <div className={styles.cardContent}>
                <h2 className={styles.cardTitle}>{title}</h2>

                <p
                    className={styles.cardValue}
                    style={{ color: color }}
                >
                    {value}
                </p>
            </div>
        </div>
    )
}
