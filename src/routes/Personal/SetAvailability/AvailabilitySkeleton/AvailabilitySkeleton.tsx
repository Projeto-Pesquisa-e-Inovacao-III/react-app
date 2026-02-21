import 'react-loading-skeleton/dist/skeleton.css';
import styles from '../SetAvailability.module.css';
import Skeleton from 'react-loading-skeleton';

export default function AvailabilitySkeleton() {
    const daysCount = 7;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Skeleton width={200} height={32} />
            </div>

            <div className={styles.defaultsSection}>
                <div className={styles.defaultsLabel}>
                    <Skeleton circle width={24} height={24} />
                    <Skeleton width={80} height={20} />
                </div>
                <div className={styles.defaultsControls}>
                    <div className={styles.controlGroup}>
                        <Skeleton width={200} height={20} />
                        <Skeleton width={150} height={40} />
                        <Skeleton width={300} height={16} />
                    </div>
                </div>
            </div>

            {/* Skeleton para Desktop */}
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead className={styles.tableHead}>
                        <tr>
                            <th className={styles.dayColumn}>
                                <Skeleton  height={20} />
                            </th>
                            <th className={styles.timeColumn}>
                                <Skeleton  height={20} />
                            </th>
                            <th className={styles.intervalColumn}>
                                <Skeleton  height={20} />
                            </th>
                            <th className={styles.intervalColumn}>
                                <Skeleton  height={20} />
                            </th>
                            <th className={styles.timeColumn}>
                                <Skeleton  height={20} />
                            </th>
                        </tr>
                    </thead>
                    <tbody className={styles.tableBody}>
                        {Array.from({ length: daysCount }).map((_, index) => (
                            <tr key={index}>
                                <td className={`${styles.tableCell} ${styles.dayCell}`}>
                                    <Skeleton  height={24} />
                                </td>
                                <td className={styles.tableCell}>
                                    <Skeleton  height={40} />
                                </td>
                                <td className={styles.tableCell}>
                                    <Skeleton  height={40} />
                                </td>
                                <td className={styles.tableCell}>
                                    <Skeleton  height={40} />
                                </td>
                                <td className={styles.tableCell}>
                                    <Skeleton  height={40} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Skeleton para Mobile */}
            <div className={styles.mobileView}>
                {Array.from({ length: daysCount }).map((_, index) => (
                    <div key={index} className={styles.dayCard}>
                        <div className={styles.dayCardHeader}>
                            <Skeleton width={120} height={24} />
                        </div>

                        <div className={styles.slotFields}>
                            <div className={styles.fieldGroup}>
                                <Skeleton width={60} height={16} />
                                <Skeleton  height={40} />
                            </div>

                            <div className={styles.fieldGroup}>
                                <Skeleton width={60} height={16} />
                                <Skeleton  height={40} />
                            </div>

                            <div className={styles.fieldGroup}>
                                <Skeleton width={120} height={16} />
                                <Skeleton  height={40} />
                            </div>

                            <div className={styles.fieldGroup}>
                                <Skeleton width={120} height={16} />
                                <Skeleton  height={40} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
