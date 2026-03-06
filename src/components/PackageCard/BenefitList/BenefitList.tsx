import useMobile from '../../../hooks/isMobile';
import classNames from 'classnames';
import styles from './BenefitList.module.css';

const renderBenefits = (isMobile: boolean) => isMobile ? 3 : 4;

type BenefitsListProps = {
    benefits: string[],
    customStyles?: string,
    classnames?: string

    isExpanded: boolean;
    onToggle: () => void;
}

export function BenefitsList({ benefits, isExpanded, onToggle }: BenefitsListProps) {
    const isMobile = useMobile()

    const visibleBenefits = isExpanded ? benefits : benefits.slice(0, renderBenefits(isMobile));
    const hasMore = benefits.length > renderBenefits(isMobile);

    return (
        <>
            <ul>
                {visibleBenefits.map((benefit, index) => (
                    <li
                        key={index}
                        className={classNames([styles.benefitItem], {
                            [styles.benefitItemMobile]: isMobile,
                            [styles.benefitItemWithMore]: hasMore && !isExpanded,
                        })}
                    >
                        <div className={styles.benefitItemIcon}>
                            <svg
                                width="14"
                                height="13"
                                viewBox="0 0 14 13"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M5.00006 8.66065L11.5334 0.939436C11.7778 0.650547 12.089 0.506104 12.4667 0.506104C12.8445 0.506104 13.1556 0.650547 13.4001 0.939436C13.6445 1.22833 13.7667 1.596 13.7667 2.04247C13.7667 2.48893 13.6445 2.85661 13.4001 3.1455L5.9334 11.9697C5.66673 12.2849 5.35562 12.4425 5.00006 12.4425C4.64451 12.4425 4.3334 12.2849 4.06673 11.9697L0.600065 7.87277C0.35562 7.58388 0.233398 7.2162 0.233398 6.76974C0.233398 6.32327 0.35562 5.9556 0.600065 5.66671C0.844509 5.37782 1.15562 5.23338 1.5334 5.23338C1.91118 5.23338 2.22229 5.37782 2.46673 5.66671L5.00006 8.66065Z"
                                    fill="#22C55E"
                                />
                            </svg>
                        </div>
                        <span>{benefit}</span>
                    </li>
                ))}
            </ul>

            {hasMore && (
                <li className={styles.benefitToggle}>
                    <button
                        onClick={onToggle}
                        className={styles.benefitToggleButton}
                    >
                        {isExpanded ? "Ver menos" : "Ver mais"}
                        <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{
                                transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                                transition: "transform 0.2s ease",
                                marginLeft: "4px",
                            }}
                        >
                            <path
                                d="M2 4L6 8L10 4"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </li>
            )}
        </>
    );
}
