import Skeleton from "react-loading-skeleton";
import styles from "../SetAvailability.module.css";

export default function AvailabilitySkeleton() {
  const daysCount = 7;

  return (
    <div className={styles.pageWrapper}>

      {/* ── Header ── */}
      <div className={styles.header}>
        <Skeleton width={320} height={32} />
        <Skeleton width={260} height={16} style={{ marginTop: 6 }} />
      </div>

      {/* ── Defaults bar ── */}
      <div className={styles.defaultsSection}>
        <div className={styles.defaultsLabel}>
          <Skeleton circle width={16} height={16} />
          <Skeleton width={70} height={18} />
        </div>

        <div className={styles.divider} />

        <div className={styles.defaultsControls}>
          <div className={styles.controlGroup}>
            <Skeleton width={190} height={18} />
            <Skeleton width={90} height={36} borderRadius={8} />
          </div>
          <Skeleton circle width={16} height={16} />
        </div>
      </div>

      {/* ── Day rows ── */}
      <div className={styles.dayList}>
        {Array.from({ length: daysCount }).map((_, index) => (
          <div key={index} className={styles.dayRow}>

            {/* Toggle + name */}
            <div className={styles.dayLabel}>
              <Skeleton width={52} height={28} borderRadius={14} />
              <Skeleton width={110} height={18} />
            </div>

            {/* Manhã */}
            <div className={styles.timeRange}>
              <Skeleton width={44} height={12} />
              <div className={styles.timeRangeInputs}>
                <Skeleton circle width={16} height={16} />
                <Skeleton width={72} height={34} borderRadius={8} />
                <Skeleton width={8} height={14} />
                <Skeleton width={72} height={34} borderRadius={8} />
              </div>
            </div>

            <div className={styles.periodDivider} />

            {/* Tarde */}
            <div className={styles.timeRange}>
              <Skeleton width={44} height={12} />
              <div className={styles.timeRangeInputs}>
                <Skeleton circle width={16} height={16} />
                <Skeleton width={72} height={34} borderRadius={8} />
                <Skeleton width={8} height={14} />
                <Skeleton width={72} height={34} borderRadius={8} />
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* ── Footer ── */}
      <div className={styles.footer}>
        <Skeleton width={80} height={36} borderRadius={8} />
        <Skeleton width={140} height={40} borderRadius={8} />
      </div>

    </div>
  );
}