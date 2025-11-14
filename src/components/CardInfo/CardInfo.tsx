import classnames from 'classnames'
import styles from './CardInfo.module.css'
import React from 'react'

type CardInfoProps = {
    isMobile: boolean;
    HeaderTitle: string;
    title: string;
    subtitle?: string;
    includeImg?: boolean;
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
                        <img
                            className={styles.userImage}
                            src="https://placehold.co/50x50/png"
                            alt=""
                        />
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
