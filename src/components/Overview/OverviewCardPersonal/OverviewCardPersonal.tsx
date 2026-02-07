import type { ReactNode } from 'react';
import styles from './OverviewCardPersonal.module.css';
import classNames from 'classnames';

type OverviewCardProps = {
    title: string;
    subtitle: ReactNode | string;
    icon?: ReactNode;
    iconColor?: string;
    type?: string;
    titletbn: string;
    onClick: () => void;
    isMobile?: boolean;
};

export function OverviewCardPersonal(props: OverviewCardProps) {
    const { isMobile = false } = props;

    return (
        <div className={classNames(styles.cardContainer, { [styles.cardContainerMobile]: isMobile })}>
            <div className={classNames(styles.cardTitleContainer, { [styles.cardTitleContainerMobile]: isMobile })}>
                <div className={styles.iconwrapper}>
                    <span>{props.icon}</span>
                </div>
                <h3 className={classNames(styles.cardTitle, { [styles.cardTitleMobile]: isMobile })}>{props.title}</h3>
            </div>
            <div className={classNames(styles.cardSubtitle, { [styles.cardSubtitleMobile]: isMobile })}>{props.subtitle}</div>
            <div className={classNames(styles.cardButtonContainer, { [styles.cardButtonContainerMobile]: isMobile })}>
                {
                    props.titletbn === "" ? null :
                        <button className={classNames(styles.cardBtn, { [styles.cardBtnMobile]: isMobile })} onClick={props.onClick}>
                            {props.titletbn}
                        </button>
                }
            </div>
        </div>
    );
}
