import './mobile.css'
import './desktop.css'

type OverviewCardProps = {
    title: string;
    subtitle: string;
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
            <h1 className={`card-subtitle${isMobile ? '-mobile' : ''}`}>{props.subtitle}</h1>
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
