import styles from './PackageCard.module.css'
import SmallerButton from '../SmallerButton/SmallerButton';
import classnames from 'classnames';
import { useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import { Calendar, Dumbbell, Heart, HeartPulse, Home, Pencil, Trash, Trash2 } from 'lucide-react';

type PackageCardProps = {
    titlebtn?: string | React.ReactNode;
    titulo?: string | React.ReactNode;
    subtitulo?: string | React.ReactNode;
    preco?: number | React.ReactNode;
    duracaoMes?: number | React.ReactNode;
    tipoAula?: string | React.ReactNode;
    quantidadeAula?: number | React.ReactNode;
    descricao: string[] | React.ReactNode[];
    onClick: () => void;
    setHandleEdit: React.Dispatch<React.SetStateAction<boolean>> | (() => void);
    setHandleDelete: React.Dispatch<React.SetStateAction<boolean>> | (() => void);
    isMobile?: boolean;
    isLoading?: boolean;
    variant?: "consultoria" | "adicional";
    isPersonal?: boolean;
};


export function PackageCard(props: PackageCardProps) {
    const { isMobile = false, variant = "consultoria", isLoading = false } = props;

    function handleOpenEdit() {
        props.setHandleEdit(true);
    }

    function handleOpenDelete() {
        props.setHandleDelete(true);
    }

    console.log(props.descricao, props.tipoAula);

    useEffect(() => {
        if (typeof props.descricao === 'string') {
            console.warn("PackageCard: 'descricao' prop should be an array of strings, but received a string.");
        }
    }, []);

    return (
        <div
            className={classnames(
                styles.packageCardContainer, { [styles.packageCardPresential]: props.tipoAula && props.tipoAula === "PRESENCIAL" }, { [styles.packageCardHome]: props.tipoAula === "RESIDENCIAL" }, { [styles.packageCardFunctional]: props.tipoAula === "FUNCIONAL" },
                styles[`cardVariant${variant[0].toUpperCase() + variant.slice(1)}`],
                { [styles.packageCardContainerMobile]: isMobile }
            )}
        >
            <div className={styles.cardContent}>
                <div className='flex justify-between items-center'>
                    <p className={classnames(styles.cardTipoAula, { [styles.cardTipoAulaPresential]: props.tipoAula && props.tipoAula === "PRESENCIAL" }, { [styles.cardTipoAulaHome]: props.tipoAula === "RESIDENCIAL" }, { [styles.cardTipoAulaFunctional]: props.tipoAula === "FUNCIONAL" })}>{props.tipoAula?.toString().toLowerCase()?.replace(/^\w/, (c: string) => c.toUpperCase())}</p>
                    <span className={styles.cardIcon}>
                        {props.tipoAula && props.tipoAula === "PRESENCIAL" && <Dumbbell />}
                        {props.tipoAula && props.tipoAula === "RESIDENCIAL" && <Home />}
                        {props.tipoAula === "FUNCIONAL" && <HeartPulse />}
                    </span>
                </div>
                <h2 className={classnames(styles.cardTitle, { [styles.cardTitleMobile]: isMobile })}>
                    {isLoading ? (
                        <Skeleton width={isMobile ? "80%" : 300} />
                    ) : (
                        `${props.titulo}`
                    )}
                </h2>

                <p className={classnames(styles.cardSubtitle, { [styles.cardSubtitleMobile]: isMobile })}>
                    {isLoading ? (
                        <Skeleton width={isMobile ? "90%" : 350} />
                    ) : (
                        props.subtitulo || "Esse pacote é adquirido de forma única e não possui cobrança automática."
                    )}
                </p>

                <div
                    className={classnames(styles.cardPriceSection, {
                        [styles.cardPriceSectionMobile]: isMobile,
                    })}
                >
                    <span>R$</span>
                    <span
                        className={classnames(styles.cardPriceValue, {
                            [styles.cardPriceValueMobile]: isMobile,
                        })}
                    >
                        {isLoading ? (
                            <Skeleton width={80} height={32} />
                        ) : (
                            `${props.preco}`
                        )}
                    </span>
                </div>

                <div
                    className={classnames(styles.cardDuration, {
                        [styles.cardDurationMobile]: isMobile,
                    })}
                >
                    {isLoading ? (
                        <Skeleton width={60} />
                    ) : (
                        <>
                            <Calendar /> {`Válido por ${props.duracaoMes} meses`}
                        </>
                    )}
                </div>
                <span className={styles.cardPaymentInfo}>Pagamento único</span>

                <ul
                    className={classnames(styles.cardBenefitsList, {
                        [styles.cardBenefitsListMobile]: isMobile,
                    })}
                >
                    {isLoading ? (
                        [...Array(4)].map((_, index) => (
                            <li
                                key={index}
                                className={classnames(styles.benefitItem, {
                                    [styles.benefitItemMobile]: isMobile,
                                })}
                            >
                                <Skeleton circle width={14} height={14} style={{ marginRight: "8px" }} />
                                <Skeleton width={isMobile ? "70%" : 200} />
                            </li>
                        ))
                    ) : (
                        <>
                            <li
                                className={classnames(styles.benefitItem, {
                                    [styles.benefitItemMobile]: isMobile,
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
                                <span>{props.quantidadeAula} agendamentos</span>
                            </li>
                            {/* temp */}
                            {(typeof props.descricao === "string" ? [] : props.descricao ?? []).map((benefit, index) => (
                                <li
                                    key={index}
                                    className={classnames(styles.benefitItem, {
                                        [styles.benefitItemMobile]: isMobile,
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
                                                fill="#04b57a"
                                            />
                                        </svg>
                                    </div>

                                    <span>{benefit}</span>
                                </li>
                            ))}
                        </>
                    )}
                </ul>
            </div>

            {isLoading ? (
                props.isPersonal ? (
                    <div
                        className={classnames(styles.cardBtnPersonal, {
                            [styles.cardBtnPersonalMobile]: isMobile,
                        })}
                    >
                        <Skeleton width={80} height={36} borderRadius={8} />
                        <Skeleton width={80} height={36} borderRadius={8} />
                    </div>
                ) : (
                    <Skeleton
                        width={450}
                        height={isMobile ? 40 : 48}
                        borderRadius={8}
                    />
                )
            ) : (
                props.isPersonal ? (
                    <div
                        className={classnames(styles.cardBtnPersonal, {
                            [styles.cardBtnPersonalMobile]: isMobile,
                        })}
                    >
                        <SmallerButton
                            type="button"
                            title="Editar"
                            classname={styles.editButton}
                            handleButtonClick={handleOpenEdit}
                            icon={<Pencil color="#000" />}
                        />

                        <SmallerButton
                            type="button"
                            title="Deletar"
                            classname={styles.deleteButton}
                            handleButtonClick={handleOpenDelete}
                            icon={<Trash2 color="#c00" />}
                        />
                    </div>
                ) : (
                    <button
                        className={classnames(styles.cardBtn, { [styles.cardBtnMobile]: isMobile })}
                        onClick={props.onClick}
                    >
                        Comprar
                    </button>
                )
            )}
        </div>
    );
}
