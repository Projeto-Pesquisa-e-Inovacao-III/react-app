import './mobile.css'
import './desktop.css'
import type { ReactNode } from 'react';

type OverviewCardProps = {
    title: string;
    subtitle: ReactNode | string;
    type: string;
    titletbn: string;
    onClick: () => void;
    isMobile?: boolean;
};

export function OverviewCard(props: OverviewCardProps) {
    const { isMobile = false } = props;

    return (
        <div className={`card-container${isMobile ? '-mobile' : ''}`}>
            <h2 className={`card-title${isMobile ? '-mobile' : ''}`}>{props.title}</h2>
             <div className={`card-subtitle${isMobile ? '-mobile' : ''}`}>{props.subtitle}</div>
            {/* <p className={`card-paragraph${isMobile ? '-mobile' : ''}`}>{props.type}</p> */}
            {
                props.titletbn == "" ? null :
                    <button className={`card-btn${isMobile ? '-mobile' : ''}`} onClick={props.onClick}>
                        {props.titletbn}
                    </button>
            }
        </div>
    );
}
