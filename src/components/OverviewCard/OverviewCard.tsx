import type { ReactNode } from 'react';
import styles from './OverviewCard.module.css';
import classNames from 'classnames';

type OverviewCardProps = {
    title: string;
    subtitle: ReactNode | string;
    type?: string;
    titletbn: string;
    onClick: () => void;
    isMobile?: boolean;
};

export function OverviewCard(props: OverviewCardProps) {
    const { isMobile = false } = props;

    return (
        <div className={classNames(styles.cardContainer, { [styles.cardContainerMobile]: isMobile })}>
            <h2 className={classNames(styles.cardTitle, { [styles.cardTitleMobile]: isMobile })}>{props.title}</h2>
            <div className={classNames(styles.cardSubtitle, { [styles.cardSubtitleMobile]: isMobile })}>{props.subtitle}</div>
            {
                props.titletbn === "" ? null :
                    <button className={classNames(styles.cardBtn, { [styles.cardBtnMobile]: isMobile })} onClick={props.onClick}>
                        {props.titletbn}
                    </button>
            }
        </div>
    );
}
