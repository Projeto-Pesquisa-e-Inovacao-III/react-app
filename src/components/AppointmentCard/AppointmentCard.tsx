import { useNavigate } from 'react-router-dom';
import StatusSchedule from '../StatusSchedule/StatusSchedule';
import styles from './AppointmentCard.module.css';
import classNames from 'classnames';
import UserAvatar from '../UserAvatar/UserAvatar';

type Index = {
    agendamentoId: number;
    status: 'APROVADO' | 'Confirmado' | 'Cancelado';
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

    const nav = useNavigate();

    function handleNavigateToDetail() {
        nav(`/schedule-details?id=${props.agendamentoId}`);
    }

    console.log("AppointmentCard props:", props);

    return (
        <div className={classNames(styles.sessionCard, { [styles.sessionCardMobile]: isMobile })} onClick={handleNavigateToDetail}>
            <div className={styles.sessionCardHeader}>
                <StatusSchedule dotColor={props.status === 'APROVADO' ? '#D7AC00' : ""} statusText={props.status === 'APROVADO' ? 'Marcado' : props.status} />
            </div>
            <div className={styles.sessionCardInfo}>
                <div className={classNames(styles.sessionCardLeft, { [styles.sessionCardLeftMobile]: isMobile })}>
                    <p className={styles.sessionCardStatus}>{props.type}</p>
                    <div className={styles.sessionCardUser}>
                        <UserAvatar foto={props.photoUrl ? `${props.photoUrl}` : undefined} useUserImage={false} />
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
