import classNames from "classnames";
import { Calendar } from "lucide-react";
import styles from "./SimpleAppointmentCard.module.css";
import useMobile from "../../hooks/isMobile";

function getInitials(name: string) {
  if (!name) return "";
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

type Props = {
  name: string;
  date: string;
};

export function SimpleAppointmentCard(props: Props) {
  const isMobile = useMobile();

  return (
    <div
      className={classNames(styles.sessionCard, {
        [styles.sessionCardMobile]: isMobile,
      })}
    >
      <div className={styles.sessionCardInfo}>
        <div className={classNames(styles.sessionCardLeft, {
          [styles.sessionCardLeftMobile]: isMobile,
        })}>
          <div className={styles.sessionCardUser}>
            <div className={styles.sessionCardAvatar}>
              {getInitials(props.name)}
            </div>

            <div style={{ minWidth: 0 }}>
              <p className={styles.sessionCardName}>{props.name}</p>
            </div>
          </div>
        </div>

        <div
          className={classNames(styles.sessionCardDivider, {
            [styles.sessionCardDividerMobile]: isMobile,
          })}
        />

        <div
          className={classNames(styles.sessionCardRight, {
            [styles.sessionCardRightMobile]: isMobile,
          })}
        >
          <div className={styles.sessionCardDate}>
            <Calendar className={styles.metaIcon} />
            {props.date}
          </div>
        </div>
      </div>
    </div>
  );
}
