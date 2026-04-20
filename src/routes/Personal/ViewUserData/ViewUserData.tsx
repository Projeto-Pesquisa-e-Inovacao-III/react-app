import classNames from "classnames";
import useMobile from "../../../hooks/isMobile";
import styles from "./ViewUserData.module.css";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getById } from "../../../constants/user";
import UserAvatar from "../../../components/UserAvatar/UserAvatar";
import { differenceInYears, parse } from "date-fns";
import Skeleton from "react-loading-skeleton";
import { getAnamnesisById } from "../../../constants/anamnesis";

export default function ViewUserData() {
    const isMobile = useMobile();
    const [params] = useSearchParams();
    const userId = params.get("id");
    const user = useQuery({
        queryKey: ['userData', userId],
        queryFn: () => getById(userId || ""),
        enabled: !!userId,
        select: (res) => res.data,
    });

    const anamnesis = useQuery({
        queryKey: ['anamnesisData', userId],
        queryFn: () => getAnamnesisById(userId || ""),
        enabled: !!userId,
        select: (res) => res.data,
    });

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


    const isSedentario = anamnesis.data?.nivelDeAtividade === "SEDENTARIO";

    return (
        <>
            <div className={classNames(styles.container, { [styles.containerMobile]: isMobile })}>
                <div className={styles.content}>

                    <div className={styles.pageHeader}>
                        <h1 className={styles.pageTitle}>Dados &amp; Anamnese</h1>
                    </div>

                    <div className={styles.mainGrid}>

                        <div className={styles.profileCard}>
                            <UserAvatar imgClassName="w-32! h-32!" userName={user.data?.nome} withUsernameClassName="w-32! h-32! text-3xl!" foto={user.data?.caminhoFoto} />
                            <div className={styles.userNameBlock}>
                                {user.isLoading ? <Skeleton width={100} height={18} /> : <p className={styles.userName}>{user.data?.nome}</p>}
                            </div>
                            <div className={styles.userFieldsList}>
                                <div className={styles.userField}>
                                    <span className={styles.fieldLabel}>IDADE</span>
                                    {user.isLoading ? <Skeleton width={60} height={16} /> : <span className={styles.fieldValue}>{age} anos</span>}
                                </div>
                                <div className={styles.userField}>
                                    <span className={styles.fieldLabel}>EMAIL</span>
                                    {user.isLoading ? <Skeleton width={140} height={16} /> : <span className={styles.fieldValue}>{user.data?.email}</span>}
                                </div>
                                <div className={styles.userField}>
                                    <span className={styles.fieldLabel}>TELEFONE</span>
                                    {user.isLoading ? <Skeleton width={110} height={16} /> : <span className={styles.fieldValue}>{user.data?.telefones[0]?.numeroCompleto}</span>}
                                </div>
                            </div>
                        </div>

                        <div className={styles.metricCard}>
                            <span className={styles.metricLabel}>ALTURA ATUAL</span>
                            {anamnesis.isLoading ? <Skeleton width={80} height={36} /> : (
                                <span className={styles.metricValue}>
                                    {anamnesis.data?.altura ? (anamnesis.data.altura).toFixed(0) : "N/A"}
                                    <small className={styles.metricUnit}> cm</small>
                                </span>
                            )}
                        </div>

                        <div className={styles.metricCard}>
                            <span className={styles.metricLabel}>PESO CORPORAL</span>
                            {anamnesis.isLoading ? <Skeleton width={80} height={36} /> : (
                                <span className={styles.metricValue}>
                                    {anamnesis.data?.peso ?? "N/A"}
                                    <small className={styles.metricUnit}> kg</small>
                                </span>
                            )}
                        </div>

                        <div className={styles.metricCard}>
                            <span className={styles.metricLabel}>OBJETIVO PRINCIPAL</span>
                            {anamnesis.isLoading ? <Skeleton width={120} height={36} /> : (
                                <span className={styles.metricText}>{anamnesis.data?.objectivoPrincipal ?? "N/A"}</span>
                            )}
                        </div>

                        <div className={styles.healthCard}>
                            <h2 className={styles.sectionTitle}>
                                <span className={styles.sectionIconCircle}>+</span> Condições de Saúde
                            </h2>
                            {anamnesis.isLoading ? (
                                <Skeleton width="100%" height={80} />
                            ) : (
                                <div className={styles.conditionsList}>
                                    {anamnesis.data?.condicoes && anamnesis.data.condicoes.length > 0
                                        ? anamnesis.data.condicoes.map((c: { tipo: string; situacao: string }, i: number) => (
                                            <div key={i} className={styles.conditionItem}>
                                                <div className={styles.conditionItemHeader}>
                                                    <span className={styles.conditionDot} />
                                                    <span className={styles.conditionCategory}>{i === 0 ? "MEDICAÇÃO" : "HISTÓRICO"}</span>
                                                </div>
                                                <span className={styles.conditionValue}>{c.situacao}</span>
                                            </div>
                                        ))
                                        : <p className={styles.noData}>Nenhuma condição relatada</p>
                                    }
                                </div>
                            )}
                            {anamnesis.data?.observacaoSaude && (
                                <div className={styles.observationBlock}>
                                    <div className={styles.observationHeader}>
                                        <span className={styles.observationWarning}>⚠</span>
                                        <span className={styles.observationLabel}>LESÕES ARTICULARES</span>
                                    </div>
                                    <p className={styles.observationText}>&quot;{anamnesis.data.observacaoSaude}&quot;</p>
                                </div>
                            )}
                        </div>

                        <div className={styles.activityCard}>
                            <h2 className={styles.sectionTitle}>
                                <span className={styles.sectionIconCircle}>&#9654;</span> Atividade Física
                            </h2>
                            <div className={styles.activityLevelRow}>
                                <span className={styles.fieldLabel}>NÍVEL ATUAL</span>
                                {anamnesis.isLoading ? (
                                    <Skeleton width={100} height={24} />
                                ) : (
                                    <span className={classNames(styles.activityBadge, { [styles.activityBadgeSedentario]: isSedentario })}>
                                        • {getActivityLabel(anamnesis.data?.nivelDeAtividade).toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <div className={styles.rotinaBlock}>
                                <div className={styles.rotinaHeader}>
                                    <span className={styles.rotinaDot} />
                                    <span className={styles.fieldLabel}>ROTINA DIÁRIA</span>
                                </div>
                                {anamnesis.isLoading ? (
                                    <Skeleton width="100%" height={56} />
                                ) : (
                                    <p className={styles.rotinaText}>{anamnesis.data?.rotina ?? "N/A"}</p>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}