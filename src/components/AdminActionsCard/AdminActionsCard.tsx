import { useState } from "react";
import { ShieldCheck, Plus, Minus, X, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminActionsCard.module.css";
import Select from "../Select/Select";
import useModal from "../../hooks/useModal";
import useMobile from "../../hooks/isMobile";
import SuccessModal from "../Modal/SuccessModal/SuccessModal";
import ErrorModal from "../Modal/ErrorModal/ErrorModal";
import TimerModal from "../Modal/TimerModal/TimerModal";
import InputModal from "../Modal/InputModal/InputModal";
import { deleteUser, addRoleToUser, removeRoleFromUser } from "../../constants/admin";
import { AxiosError } from "axios";

interface AdminActionsCardProps {
    userId: number;
    roles: string[];
    refetch: () => void;
}

export default function AdminActionsCard({ userId, roles, refetch }: AdminActionsCardProps) {
    const isMobile = useMobile();
    const navigate = useNavigate();
    
    const [selectedRole, setSelectedRole] = useState<string>("");
    const [openSelectId, setOpenSelectId] = useState<string | null>(null);
    const { openModal, setOpenModal, textModal, setTextModal } = useModal(null, { title: "", content: "" });

    async function handleDeleteUser() {
        try {
            await deleteUser(userId);
            setTextModal({ title: "Sucesso", content: "Usuário deletado com sucesso!" });
            setOpenModal("success");
            setTimeout(() => {
                navigate("/users");
            }, 300);
        } catch (error: unknown) {
            const err = error as AxiosError<{Exception: string}>;
            setTextModal({ title: "Erro", content: err?.response?.data?.Exception || "Erro ao deletar usuário." });
            setOpenModal("error");
        }
    };

    async function handleAddRoleConfirm(data?: any) {
        try {
            await addRoleToUser(userId, selectedRole, data);
            await refetch();
            setTextModal({ title: "Sucesso", content: "Permissão adicionada com sucesso!" });
            setOpenModal("success");

        } catch (error: unknown) {
            const err = error as AxiosError<{Exception: string}>;
            setTextModal({ title: "Erro", content: err?.response?.data?.Exception || "Erro ao adicionar permissão." });
            setOpenModal("error");
        }
    };

    async function handleRemoveRole(role: string) {
        try {
            await removeRoleFromUser(userId, role);
            await refetch();
            setTextModal({ title: "Sucesso", content: "Permissão removida com sucesso!" });
            setOpenModal("success");
        } catch (error: unknown) {
            const err = error as AxiosError<{Exception: string}>;
            setTextModal({ title: "Erro", content: err?.response?.data?.Exception || "Erro ao remover permissão." });
            setOpenModal("error");
        }
    };

    function handleErrorModalInfos(title: string, content: string) {
        setTextModal({ title, content });
        setOpenModal("error");
    }

    async function handleAddRole() {
        if (!selectedRole) {
            handleErrorModalInfos("Erro", "Selecione uma permissão.");
            return;
        }
        if(selectedRole == "PERSONAL") {
            setTextModal({ title: "CREF Necessário", content: "Digite o CREF para esta permissão:" });
            setOpenModal("input");
            return;
        }
    };

    return (
        <>
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
                        <span style={{ fontSize: 13, color: '#6b7280' }}>Nenhuma permissão atribuída.</span>
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

            {openModal === "input" && (
                <InputModal
                    isMobile={isMobile}
                    closeThen={() => setOpenModal(null)}
                    title={textModal.title}
                    content={textModal.content}
                    inputPlaceholder="000000-G/UF"
                    buttonTitle="Confirmar"
                    onConfirm={(value) => {
                        if (!value) {
                            handleErrorModalInfos("Erro", "CREF é obrigatório para esta role.");
                            return;
                        }
                        handleAddRoleConfirm({ cref: value });
                    }}
                />
            )}
        </>
    );
}
