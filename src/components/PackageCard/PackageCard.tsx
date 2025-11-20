import styles from './PackageCard.module.css'
import SmallerButton from '../SmallerButton';
import classnames from 'classnames';

type PackageCardProps = {
    titlebtn?: string;
    descricao: string[];
    onClick: () => void;
    setHandleEdit: React.Dispatch<React.SetStateAction<boolean>> | (() => void);
    setHandleDelete: React.Dispatch<React.SetStateAction<boolean>> | (() => void);
    isMobile?: boolean;
    variant?: "consultoria" | "adicional";
    isPersonal?: boolean;
};


export function PackageCard(props: PackageCardProps) {
    const { isMobile = false, variant = "consultoria" } = props;

    function handleOpenEdit() {
        props.setHandleEdit(true);
    }

    function handleOpenDelete() {
        props.setHandleDelete(true);
    }

    return (
        <div
            className={classnames(
                styles.packageCardContainer,
                styles[`cardVariant${variant[0].toUpperCase() + variant.slice(1)}`],
                { [styles.packageCardContainerMobile]: isMobile }
            )}
        >
            <h2 className={classnames(styles.cardTitle, { [styles.cardTitleMobile]: isMobile })}>
                {props.titulo}
            </h2>

            <p className={classnames(styles.cardSubtitle, { [styles.cardSubtitleMobile]: isMobile })}>
                {props.subtitulo || "Esse pacote é adquirido de forma única e não possui cobrança automática."}
            </p>

            <div
                className={classnames(styles.cardPriceSection, {
                    [styles.cardPriceSectionMobile]: isMobile,
                })}
            >
                <span
                    className={classnames(styles.cardPriceValue, {
                        [styles.cardPriceValueMobile]: isMobile,
                    })}
                >
                    R${props.preco}
                </span>
                <span
                    className={classnames(styles.cardDuration, {
                        [styles.cardDurationMobile]: isMobile,
                    })}
                >
                    {props.periodo} meses
                </span>
            </div>

            <ul
                className={classnames(styles.cardBenefitsList, {
                    [styles.cardBenefitsListMobile]: isMobile,
                })}
            >
                {(props.descricao || []).map((benefit, index) => (
                    <li
                        key={index}
                        className={classnames(styles.benefitItem, {
                            [styles.benefitItemMobile]: isMobile,
                        })}
                    >
                        <svg
                            style={{ marginRight: "8px" }}
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
                        <span>{benefit}</span>
                    </li>
                ))}
            </ul>

            {props.isPersonal ?
                <div
                    className={classnames(styles.cardBtnPersonal, {
                        [styles.cardBtnPersonalMobile]: isMobile,
                    })}
                >
                    <SmallerButton type="button" title="Editar" handleButtonClick={handleOpenEdit} />
                    <SmallerButton type="button" title="Deletar" handleButtonClick={handleOpenDelete} />
                </div>
                :
                <button
                    className={classnames(styles.cardBtn, { [styles.cardBtnMobile]: isMobile })}
                    onClick={props.onClick}
                >
                    Comprar
                </button>
            }
        </div>
    );
}
