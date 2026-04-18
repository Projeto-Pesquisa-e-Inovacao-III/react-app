import { useEffect, useRef, useState } from "react";
import styles from "./PackageHistoryModal.module.css";
import useModalClose from "../../../hooks/useModalClose";
import useClickOutside from "../../../hooks/useClickOutside";
import useModal from "../../../hooks/useModal";
import { reactivateProductExhibition, getInactiveProductsExhibitions } from "../../../constants/products";
import type { ProductExhibition } from "../../../models/products";
import { CheckCircle2, ChevronDown, ChevronUp, History, Loader2, RefreshCw, X } from "lucide-react";
import classnames from "classnames";
import { useQuery } from "@tanstack/react-query";

type PackageHistoryModalProps = {
    onClose: () => void;
    onReactivate: (pkg: ProductExhibition) => void;
};

function formatPrice(price: string | number) {
    return Number(price).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function PackageHistoryModal({ onClose, onReactivate }: PackageHistoryModalProps) {
    const { isClosing, handleAnimatedClose } = useModalClose({ onClose });

    const modalRef = useRef<HTMLDivElement>(null);
    useClickOutside({ ref: modalRef, callback: handleAnimatedClose });

    const { openModal, setOpenModal } = useModal(null, { title: "", content: "" });

    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [reactivatingId, setReactivatingId] = useState<number | null>(null);
    const [localInactive, setLocalInactive] = useState<ProductExhibition[] | null>(null);

    const { data: inactiveData, isLoading } = useQuery({
        queryKey: ["inactiveProductsExhibitions"],
        queryFn: () => getInactiveProductsExhibitions(),
        select: (response) => response.data as ProductExhibition[],
    });

    useEffect(() => {
        if (inactiveData) {
            setLocalInactive(inactiveData);
        }
    }, [inactiveData]);

    const inactiveList: ProductExhibition[] = localInactive ?? inactiveData ?? [];

    function toggleExpand(id: number) {
        setExpandedId(prev => (prev === id ? null : id));
    }

    function handleReactivate(pkg: ProductExhibition) {
        if (!pkg.id) return;
        setReactivatingId(pkg.id);
        reactivateProductExhibition(pkg.id)
            .then((response) => {
                const reactivated: ProductExhibition = response.data ?? { ...pkg, status: "ATIVO" };
                setLocalInactive(prev => (prev ?? []).filter(p => p.id !== pkg.id));
                onReactivate(reactivated);
                setOpenModal("success");
                setTimeout(() => setOpenModal(null), 3000);
            })
            .catch((err) => {
                console.error("Erro ao reativar pacote:", err);
            })
            .finally(() => {
                setReactivatingId(null);
            });
    }

    return (
        <>
            <div className={classnames("overlay", {
                [styles.backdropEnter]: !isClosing,
                [styles.closingBackdrop]: isClosing,
            })} />
            <div
                ref={modalRef}
                className={classnames(styles.modal, {
                    [styles.modalEnter]: !isClosing,
                    [styles.modalLeave]: isClosing,
                })}
            >
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <History size={22} color="#0a3a5c" />
                        <h2 className={styles.title}>Histórico de Pacotes</h2>
                    </div>
                    <button className={styles.closeBtn} onClick={handleAnimatedClose} aria-label="Fechar">
                        <X size={20} color="#64748b" />
                    </button>
                </div>
                <p className={styles.subtitle}>
                    Pacotes desativados podem ser reativados a qualquer momento. Nenhum dado é perdido.
                </p>

                <div className={styles.listContainer}>
                    {isLoading ? (
                        <div className={styles.loadingWrapper}>
                            <Loader2 size={28} className={styles.spinner} color="#0a3a5c" />
                            <span className={styles.loadingText}>Carregando histórico...</span>
                        </div>
                    ) : (inactiveList as ProductExhibition[]).length === 0 ? (
                        <div className={styles.emptyWrapper}>
                            <History size={36} color="#94a3b8" />
                            <p className={styles.emptyText}>Nenhum pacote desativado encontrado.</p>
                        </div>
                    ) : (
                        (inactiveList as ProductExhibition[]).map((pkg: ProductExhibition) => (
                            <div key={pkg.id} className={styles.card}>
                                <div className={styles.cardTop}>
                                    <div className={styles.cardInfo}>
                                        <span className={styles.badge}>INATIVO</span>
                                        <div className={styles.cardMeta}>
                                            <span className={styles.cardName}>{pkg.titulo}</span>
                                            <span className={styles.cardPrice}>{formatPrice(pkg.preco)}</span>
                                        </div>
                                        <div className={styles.cardDetails}>
                                            <span className={styles.cardDetailItem}>
                                                Validade: {pkg.duracaoMes} {pkg.duracaoMes === 1 ? "mês" : "meses"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.cardActions}>
                                    <button
                                        className={styles.expandBtn}
                                        onClick={() => toggleExpand(pkg.id!)}
                                        type="button"
                                    >
                                        Ver benefícios
                                        {expandedId === pkg.id
                                            ? <ChevronUp size={14} />
                                            : <ChevronDown size={14} />
                                        }
                                    </button>

                                    <button
                                        className={styles.reactivateBtn}
                                        onClick={() => handleReactivate(pkg)}
                                        disabled={reactivatingId === pkg.id}
                                        type="button"
                                    >
                                        {reactivatingId === pkg.id
                                            ? <Loader2 size={14} className={styles.spinner} />
                                            : <RefreshCw size={14} />
                                        }
                                        Reativar
                                    </button>
                                </div>

                                {expandedId === pkg.id && pkg.beneficios?.length > 0 && (
                                    <ul className={styles.benefitsList}>
                                        <li className="flex items-center gap-1 text-[0.82rem] text-[#475569]"><CheckCircle2 size={14} color="#16a34a" className="shrink-0" /> {pkg.quantidadeAula} {pkg.quantidadeAula != null && pkg.quantidadeAula > 1 ? "agendamentos" : "agendamento"} </li>
                                        {pkg.beneficios.map((b: { valor: string }, i: number) => (
                                            <li key={i} className={styles.benefitItem}>
                                                <CheckCircle2 size={14} color="#16a34a" className="shrink-0" />
                                                {b.valor}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))
                    )}
                </div>

                <div className={styles.footer}>
                    <div className={classnames(styles.toast, { [styles.toastVisible]: openModal === "success" })}>
                        <CheckCircle2 size={18} color="#16a34a" />
                        <span>Pacote reativado com sucesso!</span>
                    </div>
                    <button className={styles.closeFooterBtn} onClick={handleAnimatedClose} type="button">
                        Fechar
                    </button>
                </div>
            </div>
        </>
    );
}
