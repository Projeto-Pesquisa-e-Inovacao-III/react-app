import classNames from "classnames";
import useMobile from "../../../hooks/isMobile";
import styles from "../ViewPersonalData/ViewPersonalData.module.css";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { differenceInYears, parse } from "date-fns";
import { getPersonalById } from "../../../constants/personal";
import { deleteUser, getVerifyNeedDataToAddRole, addRoleToUser, removeRoleFromUser } from "../../../constants/admin";
import { useEffect, useState } from "react";
import { Calendar, Mail, Phone, Briefcase, ArrowLeft, ShieldCheck, Plus, Minus, X, Trash2 } from "lucide-react";
import ProfileCard from "../../../components/ProfileCard/ProfileCard";
import useModal from "../../../hooks/useModal";
import SuccessModal from "../../../components/Modal/SuccessModal/SuccessModal";
import ErrorModal from "../../../components/Modal/ErrorModal/ErrorModal";
import TimerModal from "../../../components/Modal/TimerModal/TimerModal";
import Select from "../../../components/Select/Select";

export default function ViewPersonalData() {
    const isMobile = useMobile();
    const [params] = useSearchParams();
    const personalId = params.get("id");


    const personal = useQuery({
        queryKey: ['personalData', personalId],
        queryFn: () => getPersonalById(personalId || ""),
        enabled: !!personalId,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        select: (res) => res.data,
    });

    const navigate = useNavigate();
    useEffect(() => {
        if (personal.data && !personal.data?.ativo) {
            navigate("/users");
        }
    }, [personalId, navigate, personal.data]);

    const age = personal.data?.dataNascimento
        ? differenceInYears(new Date(), parse(personal.data?.dataNascimento, "yyyy-MM-dd", new Date()))
        : "N/A";

    const userId = Number(personalId);
    const [selectedRole, setSelectedRole] = useState<string>("");
    const [openSelectId, setOpenSelectId] = useState<string | null>(null);
    const { openModal, setOpenModal, textModal, setTextModal } = useModal(null, { title: "", content: "" });

    const handleDeleteUser = async () => {
        try {
            await deleteUser(userId);
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
            await addRoleToUser(userId, selectedRole, data);
            await personal.refetch();
            setTextModal({ title: "Sucesso", content: "Permissão adicionada com sucesso!" });
            setOpenModal("success");

        } catch (error: any) {
            setTextModal({ title: "Erro", content: error?.response?.data?.Exception || "Erro ao adicionar permissão." });
            setOpenModal("error");
        }
    };

    const handleRemoveRole = async (role: string) => {
        try {
            await removeRoleFromUser(userId, role);
            await personal.refetch();
            setTextModal({ title: "Sucesso", content: "Permissão removida com sucesso!" });
            setOpenModal("success");
        } catch (error: any) {
            setTextModal({ title: "Erro", content: error?.response?.data?.Exception || "Erro ao remover permissão." });
            setOpenModal("error");
        }
    };

    const handleAddRole = async () => {
        try {
            const res = await getVerifyNeedDataToAddRole(userId, selectedRole);
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

    const isAtivo = personal.data?.ativo ?? true;
    const roles: string[] = personal.data?.roles || [];

    return (
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
                        name={personal.data?.nome}
                        photoUrl={personal.data?.caminhoFoto}
                        isLoading={personal.isLoading}
                        className="w-96"
                        statusPill={{
                            text: isAtivo ? "Ativo" : "Inativo",
                            isActive: isAtivo
                        }}
                        fields={[
                            {
                                icon: <Calendar size={16} />,
                                label: "Idade",
                                value: age,
                                isLoading: personal.isLoading
                            },
                            {
                                icon: <Mail size={16} />,
                                label: "Email",
                                value: personal.data?.email,
                                isLoading: personal.isLoading
                            },
                            {
                                icon: <Phone size={16} />,
                                label: "Telefone",
                                value: personal.data?.telefones?.[0]?.numeroCompleto || "-",
                                isLoading: personal.isLoading
                            },
                            {
                                icon: <Briefcase size={16} />,
                                label: "CREF",
                                value: personal.data?.cref || "-",
                                isLoading: personal.isLoading
                            }
                        ]}
                    />

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
        </div>
    );
}