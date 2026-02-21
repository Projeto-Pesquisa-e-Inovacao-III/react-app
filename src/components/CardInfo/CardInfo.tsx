import classnames from 'classnames'
import styles from './CardInfo.module.css'
import React from 'react'
import UserAvatar from '../UserAvatar/UserAvatar';
import Skeleton from 'react-loading-skeleton';

type CardInfoProps = {
    isMobile: boolean;
    HeaderTitle: string | React.ReactNode;
    title: string | React.ReactNode;
    subtitle?: string | React.ReactNode;
    includeImg?: boolean;
    imgUrl?: string;
    isLoading?: boolean;
    classname?: string;
}

export default function CardInfo(props: CardInfoProps) {
    return (
        <div className={classnames(styles.cardInfo, props.classname)}>
            <div className={classnames(styles.rowHeader)}>
                {props.isLoading ? <Skeleton width={150} /> : <p>{props.HeaderTitle}</p>}
            </div>
            <div className={classnames(styles.usersTableCard, { [styles.usersTableCardMobile]: props.isMobile })}>
                <div className={classnames(styles.userDataFull, { [styles.userDataFullMobile]: props.isMobile })}>
                    {props.includeImg && (
                        <UserAvatar foto={props.imgUrl} />
                    )}
                    <div className={styles.userData}>
                        <span>
                            {props.isLoading ? <Skeleton width={200} /> : props.title}
                        </span>
                        <span>
                            {props.isLoading ? <Skeleton width={150} /> : props.subtitle}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
