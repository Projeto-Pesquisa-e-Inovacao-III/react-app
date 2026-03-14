import Skeleton from "react-loading-skeleton";
import styles from "../SetAvailability.module.css";

const SKELETON_DAYS = ['skeleton-day-1', 'skeleton-day-2', 'skeleton-day-3', 'skeleton-day-4', 'skeleton-day-5', 'skeleton-day-6', 'skeleton-day-7'];

export default function AvailabilitySkeleton() {

  return (
    <div className={styles.pageWrapper}>

      {/* ── Header ── */}
      <div className={styles.header}>
        <Skeleton width={360} height={32} />
      </div>

      {/* ── Buffer bar ── */}
      <div className={styles.bufferBar}>
        <div className={styles.bufferBarContent}>
          <div className={styles.infoTrigger}>
            <Skeleton circle width={15} height={15} />
            <Skeleton width={180} height={16} />
          </div>
          <Skeleton width={100} height={36} borderRadius={8} />
        </div>
        <div className={styles.infoTrigger}>
          <Skeleton circle width={14} height={14} />
          <Skeleton width={220} height={14} />
        </div>
      </div>

      {/* ── Global panel (mobile) ── */}
      <aside className={`${styles.globalPanel} ${styles.globalPanelMobile}`}>
        <Skeleton height={20} width={180} />
        <div className={styles.globalPanelContainer}>
          <div className={styles.globalPanelField}>
            <Skeleton width={80} height={12} />
            <div className={styles.globalRangeInputs}>
              <Skeleton width={90} height={36} borderRadius={8} />
              <Skeleton width={8} height={14} />
              <Skeleton width={90} height={36} borderRadius={8} />
            </div>
          </div>
          <div className={styles.globalPanelField}>
            <Skeleton width={80} height={12} />
            <div className={styles.globalRangeInputs}>
              <Skeleton width={90} height={36} borderRadius={8} />
              <Skeleton width={8} height={14} />
              <Skeleton width={90} height={36} borderRadius={8} />
            </div>
          </div>
          <Skeleton height={38} borderRadius={8} />
        </div>
      </aside>

      <div className={styles.contentLayout}>

        {/* ── Day list ── */}
        <div className={styles.dayList}>

          {/* Header row */}
          <div className={styles.dayListHeader}>
            <span>Habilitado</span>
            <span>Dia</span>
            <span>Horário Inicial</span>
            <span>Horário Final</span>
          </div>

          {/* Day rows */}
          {SKELETON_DAYS.map((dayKey) => (
            <div key={dayKey} className={styles.dayRow}>

              {/* Toggle */}
              <div className={styles.dayToggle}>
                <Skeleton width={52} height={28} borderRadius={14} />
              </div>

              {/* Day name */}
              <div className={styles.dayLabel}>
                <Skeleton width={100} height={16} />
              </div>

              {/* Horário Inicial */}
              <div className={styles.timeRange}>
                <div className={styles.timeRangeInputs}>
                  <Skeleton width={72} height={34} borderRadius={8} />
                  <Skeleton width={8} height={14} />
                  <Skeleton width={72} height={34} borderRadius={8} />
                </div>
              </div>

              <div className={styles.periodDivider} />

              {/* Horário Final */}
              <div className={styles.timeRange}>
                <div className={styles.timeRangeInputs}>
                  <Skeleton width={72} height={34} borderRadius={8} />
                  <Skeleton width={8} height={14} />
                  <Skeleton width={72} height={34} borderRadius={8} />
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* ── Global panel (desktop) ── */}
        <aside className={`${styles.globalPanel} ${styles.globalPanelDesktop}`}>
          <Skeleton height={20} width={180} />
          <div className={styles.globalPanelContainer}>
            <div className={styles.globalPanelField}>
              <Skeleton width={80} height={12} />
              <div className={styles.globalRangeInputs}>
                <Skeleton width={90} height={36} borderRadius={8} />
                <Skeleton width={8} height={14} />
                <Skeleton width={90} height={36} borderRadius={8} />
              </div>
            </div>
            <div className={styles.globalPanelField}>
              <Skeleton width={80} height={12} />
              <div className={styles.globalRangeInputs}>
                <Skeleton width={90} height={36} borderRadius={8} />
                <Skeleton width={8} height={14} />
                <Skeleton width={90} height={36} borderRadius={8} />
              </div>
            </div>
            <Skeleton height={38} borderRadius={8} />
          </div>
        </aside>

      </div>

      {/* ── Footer ── */}
      <div className={styles.footer}>
        <Skeleton width={80} height={36} borderRadius={8} />
        <Skeleton width={140} height={40} borderRadius={8} />
      </div>

    </div>
  );
}