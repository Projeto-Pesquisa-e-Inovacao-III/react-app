import { CalendarX, PlusIcon, Plus } from "lucide-react";
import SmallerButton from "../../SmallerButton/SmallerButton";
import styles from "./AppointmentsEmptyState.module.css";

type AppointmentsEmptyStateProps = {
    userType: string | null | undefined;
    hasActivePlan: boolean;
    isMobile: boolean;
    onSchedule: () => void;
    onPackages: () => void;
};

export default function AppointmentsEmptyState({
    userType,
    hasActivePlan,
    isMobile,
    onSchedule,
    onPackages,
}: Readonly<AppointmentsEmptyStateProps>) {
    return (
        <div className={styles.container}>
            <div className={styles.iconWrapper}>
                <CalendarX color="#0a3a5c" size={40} />
            </div>

            {userType?.includes("aluno") && hasActivePlan && (
                <>
                    <h1 className={styles.title}>Sem agendamentos para hoje</h1>
                    <div className={styles.subtitleWrapper}>
                        <h2 className={styles.subtitle}>Você ainda não agendou nenhuma aula para este período.</h2>
                        <h2 className={styles.subtitle}>Garanta seu horário agora mesmo!</h2>
                    </div>
                    <SmallerButton
                        type="button"
                        title="Agendar Agora"
                        icon={<PlusIcon />}
                        classname={`${isMobile ? styles.fullWidth : styles.scheduleButton}`}
                        handleButtonClick={onSchedule}
                    />
                </>
            )}

            {userType?.includes("aluno") && !hasActivePlan && (
                <>
                    <h1 className={styles.title}>Nenhum pacote ativo</h1>
                    <div className={styles.subtitleWrapper}>
                        <h2 className={styles.subtitle}>Para agendar aulas, você precisa ter um plano ativo.</h2>
                        <h2 className={styles.subtitle}>Confira nossos pacotes e escolha o melhor para você!</h2>
                    </div>
                    <SmallerButton
                        type="button"
                        title="Comprar Pacote Agora"
                        classname={`${isMobile ? styles.fullWidth : styles.packagesButton}`}
                        icon={<Plus />}
                        handleButtonClick={onPackages}
                    />
                </>
            )}

            {!userType?.includes("aluno") && (
                <div className={styles.subtitleWrapper}>
                    <h2 className={styles.subtitle}>Você ainda não possui agendamentos pendentes.</h2>
                </div>
            )}
        </div>
    );
}
