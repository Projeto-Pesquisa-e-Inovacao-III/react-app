import classNames from "classnames";
import useMobile from "../../../hooks/isMobile";
import styles from "./ViewUserData.module.css";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getById } from "../../../constants/user";
import { differenceInYears, parse } from "date-fns";
import Skeleton from "react-loading-skeleton";
import { getAnamnesisById } from "../../../constants/anamnesis";
import { Calendar, Mail, Phone, ArrowLeft, Dumbbell, CalendarX, FileText } from "lucide-react";
import { useContext } from "react";
import { TypeContext } from "../../../App";
import AdminActionsCard from "../../../components/AdminActionsCard/AdminActionsCard";
import ProfileCard from "../../../components/ProfileCard/ProfileCard";
import MetricCard from "../../../components/MetricCard/MetricCard";
import OverviewCardPackageStatus from "../../../components/Overview/OverviewCardPackageStatus/OverviewCardPackageStatus";
import { getAppointmentResumes } from "../../../constants/schedule";
import { usePagination } from "../../../hooks/usePagination";
import PaginatedList from "../../../components/PaginatedList/PaginatedList";
import SummaryCard from "../../../components/SummaryCard/SummaryCard";

export default function ViewUserData() {
    const isMobile = useMobile();
    const [params] = useSearchParams();
    const userId = params.get("id");
    const type = useContext(TypeContext);
    const isAdmin = type?.type?.includes("admin");

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
        : "Não informado";

    const getActivityLabel = (nivel: string | undefined) => {
        if (!nivel) return "Não informado";
        const map: Record<string, string> = {
            SEDENTARIO: "Sedentário",
            LEVE: "Leve",
            MODERADO: "Moderado",
            INTENSO: "Intenso",
        };
        return map[nivel] ?? nivel;
    };


    const isSedentario = anamnesis.data?.nivelDeAtividade === "SEDENTARIO";
    const roles: string[] = user.data?.roles || [];
    const nav = useNavigate();

    const { page: resumesPage, goToPage: goToResumesPage, animClass: resumesAnimClass } = usePagination(0);

    const resumos = useQuery({
        queryKey: ["appointmentResumes", userId, resumesPage],
        queryFn: () => getAppointmentResumes(Number(userId!), resumesPage, 3),
        enabled: !!userId && (type?.type?.includes("admin") || type?.type?.includes("personal")),
    });

    const paginationInfo = resumos.data?.data?.page ?? null;
    const last3Appointments: any[] = resumos.data?.data?.content ?? [];

    function handleBack() {
        nav(-1);
    }

    return (
        <>
            <div className={classNames(styles.container, { [styles.containerMobile]: isMobile })}>
                <div className={styles.content}>

                    <div className={styles.pageHeader}>
                        <button className={styles.backLink} onClick={handleBack}>
                            <ArrowLeft size={16} />
                            Voltar
                        </button>
                        <h1 className={styles.pageTitle}>Dados &amp; Anamnese</h1>
                    </div>

                    <div className={styles.mainGrid}>

                        <div className={styles.leftColumn}>
                            <ProfileCard
                                name={user.data?.nome}
                                photoUrl={user.data?.caminhoFoto}
                                isLoading={user.isLoading}
                                fields={[
                                    {
                                        icon: <Calendar size={16} />,
                                        label: "IDADE",
                                        value: `${age} anos`,
                                        isLoading: user.isLoading
                                    },
                                    {
                                        icon: <Mail size={16} />,
                                        label: "EMAIL",
                                        value: user.data?.email,
                                        isLoading: user.isLoading
                                    },
                                    {
                                        icon: <Phone size={16} />,
                                        label: "TELEFONE",
                                        value: user.data?.telefones?.[0]?.numeroCompleto || "-",
                                        isLoading: user.isLoading
                                    }
                                ]}
                            />

                            {user.data?.produtoContratado && (
                                <OverviewCardPackageStatus
                                    actualPlan={{
                                        nome: user.data.produtoContratado.produtoExibicao?.titulo,
                                        dataExpiracao: user.data.produtoContratado.dataExpiracao
                                    }}
                                    hideHistoryButton={type?.type?.includes("personal")}
                                />
                            )}
                        </div>

                        <div className={styles.rightColumn}>
                            <div className={styles.metricsRow}>
                                <MetricCard
                                    label="ALTURA ATUAL"
                                    value={anamnesis.data?.altura?.toFixed(0)}
                                    unit="cm"
                                    isLoading={anamnesis.isLoading}
                                />

                                <MetricCard
                                    label="PESO CORPORAL"
                                    value={anamnesis.data?.peso}
                                    unit="kg"
                                    isLoading={anamnesis.isLoading}
                                />

                                <MetricCard
                                    label="OBJETIVO PRINCIPAL"
                                    value={anamnesis.data?.objectivoPrincipal}
                                    isText
                                    isLoading={anamnesis.isLoading}
                                />
                            </div>

                            <div className={styles.detailsRow}>

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
                                        <span className={styles.sectionIconCircle}><Dumbbell /></span> Atividade Física
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
                                            <p className={styles.rotinaText}>{anamnesis.data?.rotina ?? "Não informado"}</p>
                                        )}
                                    </div>
                                </div>
                            </div>


                            {(type?.type?.includes("admin") || type?.type?.includes("personal")) && (
                                <div className={styles.healthCard}>
                                    <h2 className={styles.sectionTitle}>
                                        <span className={styles.sectionIconCircle}><FileText size={10} /></span> Resumos anteriores
                                    </h2>
                                    {resumos.isLoading || (!!userId && resumos.isFetching && !resumos.data) ? (
                                        <div className={styles.lastSchedulesList}>
                                            <Skeleton height={120} borderRadius={8} />
                                        </div>
                                    ) : last3Appointments.length > 0 ? (
                                        <PaginatedList
                                            key={resumesPage}
                                            page={resumesPage}
                                            animClass={resumesAnimClass}
                                            pagination={paginationInfo}
                                            includeNavMargin={!isMobile}
                                            onPageChange={goToResumesPage}
                                            listClassName={styles.lastSchedulesList}
                                            alwaysShowPagination
                                        >
                                            {last3Appointments.map((item: any, idx: number) => {
                                                const dateStr = item.agendamento?.data
                                                    ? new Date(item.agendamento.data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
                                                    : '--';
                                                const muscles: string[] = item.grupoMuscular ?? [];
                                                return (
                                                    <SummaryCard
                                                        key={item.id ?? idx}
                                                        dateStr={dateStr}
                                                        muscles={muscles}
                                                        resumo={item.resumo}
                                                    />
                                                );
                                            })}
                                        </PaginatedList>
                                    ) : (
                                        <div className={styles.lastSchedulesList}>
                                            <div className={styles.lastScheduleEmpty}>
                                                <CalendarX size={24} className={styles.emptyIcon} />
                                                <p>Nenhum agendamento anterior encontrado.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {isAdmin && userId && (
                                <AdminActionsCard
                                    userId={Number(userId)}
                                    roles={roles}
                                    refetch={user.refetch}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}