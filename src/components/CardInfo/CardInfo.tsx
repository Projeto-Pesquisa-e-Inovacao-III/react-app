import classnames from 'classnames'
import styles from './CardInfo.module.css'
import React from 'react'
import UserAvatar from '../UserAvatar/UserAvatar';

type CardInfoProps = {
    isMobile: boolean;
    HeaderTitle: string;
    title: string;
    subtitle?: string;
    includeImg?: boolean;
    imgUrl?: string;
}

export default function CardInfo(props: CardInfoProps) {
    return (
        <div className={styles.cardInfo}>
            <div className={classnames(styles.rowHeader)}>
                <p>{props.HeaderTitle}</p>
            </div>
            <div className={classnames(styles.usersTableCard, { [styles.usersTableCardMobile]: props.isMobile })}>
                <div className={classnames(styles.userDataFull, { [styles.userDataFullMobile]: props.isMobile })}>
                    {props.includeImg && (
                        <UserAvatar foto={props.imgUrl} />
                    )}
                    <div className={styles.userData}>
                        <span>
                            {props.title}
                        </span>
                        <span>
                            {props.subtitle}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
