import type { Notification } from "../../../models/notification";
import styles from "./Notification.module.css"

export default function Notification({ notifications }: Notification) {
    return (
        <div className={styles.notification}>
            <h1 className={styles.title}>Notificações</h1>
            <div className={styles.notificationsList}>
                {notifications && notifications.map((notification, index) => (
                    <div className={styles.notificationCard} key={index}>
                        <div className={styles.icon}>
                            {notification.icon}
                        </div>
                        <div className={styles.text}>
                            <h2>{notification.notificationTitle}</h2>
                            <p key={index}>{notification.message}</p>
                        </div>
                    </div>
                ))}
            </div>

            {!notifications || notifications.length === 0 && (
                <div className={styles.noNotification}>
                    <p>Sem novas notificações</p>
                </div>
            )}
        </div>
    );
}
