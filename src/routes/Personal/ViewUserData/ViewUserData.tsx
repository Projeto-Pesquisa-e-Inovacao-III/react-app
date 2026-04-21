import classNames from "classnames";
import useMobile from "../../../hooks/isMobile";
import styles from "./ViewUserData.module.css";
import { useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getById } from "../../../constants/user";
import { differenceInYears, parse } from "date-fns";
import Skeleton from "react-loading-skeleton";
import { getAnamnesisById } from "../../../constants/anamnesis";
import { Calendar, Mail, Phone, ArrowLeft, ShieldCheck, Plus, Minus, X, Trash2 } from "lucide-react";
import { useContext, useState } from "react";
import { TypeContext } from "../../../App";
import { deleteUser, getVerifyNeedDataToAddRole, addRoleToUser, removeRoleFromUser } from "../../../constants/admin";
import useModal from "../../../hooks/useModal";
import SuccessModal from "../../../components/Modal/SuccessModal/SuccessModal";
import ErrorModal from "../../../components/Modal/ErrorModal/ErrorModal";
import TimerModal from "../../../components/Modal/TimerModal/TimerModal";
import Select from "../../../components/Select/Select";
import ProfileCard from "../../../components/ProfileCard/ProfileCard";
import MetricCard from "../../../components/MetricCard/MetricCard";

export default function ViewUserData() {
    const isMobile = useMobile();
    const [params] = useSearchParams();
    const userId = params.get("id");
    const type = useContext(TypeContext);
    const isAdmin = type?.type?.includes("admin");

    const [selectedRole, setSelectedRole] = useState<string>("");
    const [openSelectId, setOpenSelectId] = useState<string | null>(null);
    const { openModal, setOpenModal, textModal, setTextModal } = useModal(null, { title: "", content: "" });

    const handleDeleteUser = async () => {
        try {
            await deleteUser(Number(userId));
            setTextModal({ title: "Sucesso", content: "Usuário deletado com sucesso!" });
            setOpenModal("success");
            setTimeout(() => {
                window.location.href = "/users";
            }, 300);
        } catch (error: any) {
            setTextModal({ title: "Erro", content: error?.response?.data?.Exception || "Erro ao deletar usuário." });
            setOpenModal("error");
        }
    };

    const handleAddRoleConfirm = async (data?: any) => {
        try {
            await addRoleToUser(Number(userId), selectedRole, data);
            await user.refetch();
            setTextModal({ title: "Sucesso", content: "Permissão adicionada com sucesso!" });
            setOpenModal("success");

        } catch (error: any) {
            setTextModal({ title: "Erro", content: error?.response?.data?.Exception || "Erro ao adicionar permissão." });
            setOpenModal("error");
        }
    };

    const handleRemoveRole = async (role: string) => {
        try {
            await removeRoleFromUser(Number(userId), role);
            await user.refetch();
            setTextModal({ title: "Sucesso", content: "Permissão removida com sucesso!" });
            setOpenModal("success");
        } catch (error: any) {
            setTextModal({ title: "Erro", content: error?.response?.data?.Exception || "Erro ao remover permissão." });
            setOpenModal("error");
        }
    };

    const handleAddRole = async () => {
        try {
            const res = await getVerifyNeedDataToAddRole(Number(userId), selectedRole);
            if (res.needData) {
                const cpf = prompt("Digite o CPF para esta role (opcional):");
                const cref = prompt("Digite o CREF para esta role (opcional):");
                await handleAddRoleConfirm({ cpf: cpf || null, cref: cref || null });
            } else {
                await handleAddRoleConfirm();
            }
        } catch (error: any) {
            setTextModal({ title: "Erro", content: error?.response?.data?.Exception || "Erro ao verificar necessidade de dados para role." });
            setOpenModal("error");
        }
    };

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
    const roles: string[] = user.data?.roles || [];

    return (
        <>
            <div className={classNames(styles.container, { [styles.containerMobile]: isMobile })}>
                <div className={styles.content}>

                    <div className={styles.pageHeader}>
                        <Link to="/users" className={styles.backLink}>
                            <ArrowLeft size={16} />
                            Voltar
                        </Link>
                        <h1 className={styles.pageTitle}>Dados &amp; Anamnese</h1>
                    </div>

                    <div className={styles.mainGrid}>

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

                            {isAdmin && (
                                <div className={styles.adminCard}>
                                    <div className={styles.adminCardHeader}>
                                        <ShieldCheck size={28} color="#1e3a8a" />
                                        <h2 className={styles.adminCardTitle}>Ações Administrativas</h2>
                                    </div>

                                    <span className={styles.sectionLabel}>GERENCIAMENTO DE PERMISSÕES</span>

                                    <div className={styles.roleControls}>
                                        <div className={styles.roleSelectWrapper}>
                                            <Select
                                                id="roleSelect"
                                                onSelectStatusChange={setSelectedRole}
                                                openSelectId={openSelectId}
                                                setOpenSelectId={setOpenSelectId}
                                                selectPlaceholder="Selecione a permissão"
                                                showSearchInput={false}
                                                showSelectAll={false}
                                                values={[
                                                    { label: "Administrativo", value: "ADMIN", disabled: roles.includes("ADMIN") },
                                                    { label: "Personal", value: "PERSONAL", disabled: roles.includes("PERSONAL") },
                                                    { label: "Aluno", value: "ALUNO", disabled: roles.includes("ALUNO") },
                                                ]}
                                                containerClassName="w-full!"
                                                triggerClassName="h-[44px]! px-4 w-full!"
                                                selectWrapperClassName="bg-[#f8fafc]! border border-[#e2e8f0]! rounded-lg!"
                                            />
                                        </div>

                                        <button onClick={handleAddRole} className={styles.addRoleBtn}>
                                            <Plus size={16} />
                                            Adicionar Permissão
                                        </button>

                                        <button onClick={() => handleRemoveRole(selectedRole)} className={styles.removeRoleBtn}>
                                            <Minus size={16} />
                                            Remover Permissão
                                        </button>
                                    </div>

                                    <div className={styles.badgesList}>
                                        {roles.length > 0 ? roles.map((role, idx) => (
                                            <div key={idx} className={styles.roleBadge}>
                                                {role}
                                                <button onClick={() => handleRemoveRole(role)} className={styles.roleBadgeRemove}>
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        )) : (
                                            <span style={{ fontSize: 13, color: '#6b7280' }}>No roles assigned.</span>
                                        )}
                                    </div>

                                    <div className={styles.dangerZone}>
                                        <div className={styles.dangerInfo}>
                                            <h4 className={styles.dangerTitle}>Zona Perigosa</h4>
                                            <p className={styles.dangerDesc}>Apaga permanentemente este usuário e todos os dados associados. Esta ação não pode ser desfeita.</p>
                                        </div>
                                        <button
                                            onClick={() => setOpenModal("timer")}
                                            className={styles.deleteUserBtn}
                                        >
                                            <Trash2 size={16} />
                                            Apagar Usuário
                                        </button>
                                    </div>

                                </div>
                            )}

                        </div>

                    </div>
                </div>
            </div>

            {openModal === "success" && (
                <SuccessModal
                    isMobile={isMobile}
                    closeThen={() => setOpenModal(null)}
                    title={textModal.title}
                    content={textModal.content}
                />
            )}

            {openModal === "timer" && (
                <TimerModal
                    isMobile={isMobile}
                    isDelete={true}
                    closeThen={() => setOpenModal(null)}
                    callSuccessModal={() => {
                        handleDeleteUser();
                        setOpenModal(null);
                    }}
                    title="Apagar usuário?"
                    buttonTitle="Apagar"
                    content="Tem certeza que deseja deletar este usuário? Isso é irreversível."
                />
            )}

            {openModal === "error" && (
                <ErrorModal
                    closeThen={() => setOpenModal(null)}
                    title={textModal.title}
                    content={textModal.content}
                />
            )}
        </>
    );
}