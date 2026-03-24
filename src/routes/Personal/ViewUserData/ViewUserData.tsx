import classNames from "classnames";
import useMobile from "../../../hooks/isMobile";
import styles from "./ViewUserData.module.css";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getById } from "../../../constants/user";
import UserAvatar from "../../../components/UserAvatar/UserAvatar";
import { differenceInYears, parse } from "date-fns";
import Skeleton from "react-loading-skeleton";
import { getAnamnesis, getAnamnesisById } from "../../../constants/anamnesis";

export default function ViewUserData() {
    const isMobile = useMobile();
    const [params] = useSearchParams();
    const user = useQuery({
        queryKey: ['userData', params.get("id")],
        queryFn: () => getById(params.get("id") || ""),
        enabled: !!params.get("id"),
        select: (res) => res.data,
    });

    const anamnesis = useQuery({
        queryKey: ['anamnesisData', params.get("id")],
        queryFn: () => getAnamnesisById(params.get("id") || ""),
        enabled: !!params.get("id"),
        select: (res) => res.data,
    });

    console.log(user.data)
    console.log(anamnesis.data)
 
    const age = user.data?.dataNascimento
        ? differenceInYears(new Date(), parse(user.data?.dataNascimento, "yyyy-MM-dd", new Date()))
        : "N/A";
 
    const getActivityLabel = (nivel: string | undefined) => {
        if (!nivel) return "N/A";
        const map: Record<string, string> = {
            SEDENTARIO: "Sedentário",
            LEVE: "Leve",
            MODERADO: "Moderado",
            INTENSO: "Intenso",
        };
        return map[nivel] ?? nivel;
    };
 
    const getCondicaoLabel = (tipo: string) => {
        const map: Record<string, string> = {
            DIABETES: "Diabetes",
            HIPERTENSAO: "Hipertensão",
            DORES_LOMBARES: "Dores Lombares",
            ASMA: "Asma/respiratório",
            PADRAO: tipo,
        };
        return map[tipo] ?? tipo;
    };


 
    const isSedentario = user.data?.nivelDeAtividade === "SEDENTARIO";
 
    return (
        <>
            <div className={classNames(styles.container, { [styles.containerMobile]: isMobile })}>
                <div className={styles.content}>
 
                    <div className={styles.pageHeader}>
                        <div>
                            <h1 className={styles.pageTitle}>Dados &amp; Anamnese</h1>
                        </div>
                    </div>
 
                    <div className={styles.topCard}>
                        <div className={styles.userDetails}>
                            <UserAvatar imgClassName="w-36! h-36! " foto={user.data?.caminhoFoto} />
                            <div className={styles.wrapperInfos}>
                                <div className={styles.info}>
                                    {user.isLoading ? <Skeleton width={150} height={20} /> : <p><strong className={styles.fieldLabel}>NOME COMPLETO</strong><br /><span className={styles.fieldValue}>{user.data?.nome}</span></p>}
                                    {user.isLoading ? <Skeleton width={150} height={20} /> : <p><strong className={styles.fieldLabel}>EMAIL</strong><br /><span className={styles.fieldValue}>{user.data?.email}</span></p>}
                                </div>
                                <div className={styles.info}>
                                    {user.isLoading ? <Skeleton width={150} height={20} /> : <p><strong className={styles.fieldLabel}>IDADE</strong><br /><span className={styles.fieldValue}>{age} Anos</span></p>}
                                    {user.isLoading ? <Skeleton width={150} height={20} /> : <p><strong className={styles.fieldLabel}>TELEFONE</strong><br /><span className={styles.fieldValue}>{user.data?.telefones[0]?.numeroCompleto}</span></p>}
                                </div>
                            </div>
                        </div>
 
                        <div className={styles.measurementsCard}>
                            <h2 className={styles.sectionTitle}>
                                <span className={styles.sectionIcon}>📊</span> Medidas e Objetivos
                            </h2>
                            <div className={styles.measurementsGrid}>
                                <div className={styles.measureItem}>
                                    <span className={styles.measureLabel}>ALTURA</span>
                                    {user.isLoading ? <Skeleton width={60} height={30} /> : <span className={styles.measureValue}>{user.data?.altura ? (user.data.altura * 100).toFixed(0) : "N/A"} <small>cm</small></span>}
                                </div>
                                <div className={styles.measureItem}>
                                    <span className={styles.measureLabel}>PESO</span>
                                    {user.isLoading ? <Skeleton width={60} height={30} /> : <span className={styles.measureValue}>{user.data?.peso ?? "N/A"} <small>kg</small></span>}
                                </div>
                            </div>
                            <div className={styles.objectiveBlock}>
                                <span className={styles.measureLabel}>OBJETIVO PRINCIPAL</span>
                                {user.isLoading ? <Skeleton width={200} height={20} /> : <p className={styles.objectiveValue}>🎯 {user.data?.objectivoPrincipal ?? "N/A"}</p>}
                            </div>
                        </div>
                    </div>
 
                    <div className={styles.bottomRow}>
                        <div className={styles.healthCard}>
                            <h2 className={styles.sectionTitle}>
                                <span className={styles.sectionIcon}>➕</span> Condições de Saúde
                            </h2>
                            {user.isLoading ? (
                                <Skeleton width="100%" height={80} />
                            ) : (
                                <div className={styles.conditionsGrid}>
                                    {user.data?.condicoes && user.data.condicoes.length > 0
                                        ? user.data.condicoes.map((c: { tipo: string; situacao: string }, i: number) => (
                                            <div key={i} className={styles.conditionItem}>
                                                <strong>{getCondicaoLabel(c.tipo)}</strong>
                                                <span>{c.situacao}</span>
                                            </div>
                                        ))
                                        : <p className={styles.noData}>Nenhuma condição relatada</p>
                                    }
                                </div>
                            )}
                            {user.data?.observacaoSaude && (
                                <div className={styles.observationBlock}>
                                    <span className={styles.measureLabel}>OBSERVAÇÕES DE LESÕES ARTICULARES</span>
                                    <p className={styles.observationText}>&quot;{user.data.observacaoSaude}&quot;</p>
                                </div>
                            )}
                        </div>
 
                        <div className={styles.activityCard}>
                            <h2 className={styles.sectionTitle}>
                                <span className={styles.sectionIcon}>🏃</span> Atividade Física
                            </h2>
                            <span className={styles.measureLabel}>NÍVEL ATUAL</span>
                            {user.isLoading ? (
                                <Skeleton width={120} height={32} />
                            ) : (
                                <span className={classNames(styles.activityBadge, { [styles.activityBadgeSedentario]: isSedentario })}>
                                    {isSedentario && "⚠️ "}{getActivityLabel(user.data?.nivelDeAtividade)}
                                </span>
                            )}
                            <span className={classNames(styles.measureLabel, styles.rotinaLabel)}>ROTINA DIÁRIA</span>
                            {user.isLoading ? (
                                <Skeleton width="100%" height={60} />
                            ) : (
                                <p className={styles.rotinaText}>{user.data?.rotina ?? "N/A"}</p>
                            )}
                        </div>
 
                    </div>
                </div>
            </div>
        </>
    );
}