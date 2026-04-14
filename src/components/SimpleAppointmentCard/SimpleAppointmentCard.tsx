import classNames from "classnames";
import { Calendar } from "lucide-react";
import styles from "./SimpleAppointmentCard.module.css";
import useMobile from "../../hooks/isMobile";
import UserAvatar from "../UserAvatar/UserAvatar";
import { Link } from "react-router-dom";

type Props = {
  name: string;
  date: string;
  id: number;
  pathImage?: string;
};

export function SimpleAppointmentCard(props: Props) {
  const isMobile = useMobile();

  return (
    <Link to={`/schedule-details/${props.id}`}>
      <div
        className={classNames(styles.sessionCard, {
          [styles.sessionCardMobile]: isMobile,
        })}
      >
        <div className={styles.sessionCardInfo}>
          <div
            className={classNames(styles.sessionCardLeft, {
              [styles.sessionCardLeftMobile]: isMobile,
            })}>
            <div className={styles.sessionCardUser}>
              <UserAvatar
                userName={props.name}
                foto={props.pathImage}
              />
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
        </div >
      </div >
    </Link>
  );
}
