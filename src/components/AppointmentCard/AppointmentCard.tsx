import StatusSchedule from '../StatusSchedule/StatusSchedule';
import styles from './AppointmentCard.module.css';
import classNames from 'classnames';

type Index = {
    status: 'Pendente' | 'Confirmado' | 'Cancelado';
    name: string;
    photoUrl: string;
    date: string;
    type: string;
    address: string;
    time: string;
    isMobile?: boolean;
};

export function AppointmentCard(props: Index) {
    const { isMobile = false } = props;
    return (
        <div className={classNames(styles.sessionCard, { [styles.sessionCardMobile]: isMobile })}>
            <StatusSchedule dotColor={props.status === 'Pendente' ? '#D7AC00' : props.status === 'Confirmado' ? '#4CAF50' : '#F44336'} statusText={props.status} />
            <div className={styles.sessionCardInfo}>
                <div className={classNames(styles.sessionCardLeft, { [styles.sessionCardLeftMobile]: isMobile })}>
                    <p className={styles.sessionCardStatus}>{props.type}</p>
                    <div className={styles.sessionCardUser}>
                        <img src={props.photoUrl} alt={props.name} className={styles.sessionCardAvatar} />
                        <div>
                            <p className={styles.sessionCardName}>{props.name}</p>
                            <p className={styles.sessionCardAddress}>{props.address}</p>
                        </div>
                    </div>
                </div>
                <div className={classNames(styles.sessionCardDivider, { [styles.sessionCardDividerMobile]: isMobile })} />
                <div className={classNames(styles.sessionCardRight, { [styles.sessionCardRightMobile]: isMobile })}>
                    <p className={styles.sessionCardDate}>{props.date}</p>
                    <p className={styles.sessionCardTime}>{props.time}</p>
                </div>
            </div>
        </div>
    );
}
