import { Banknote, Boxes, Clock, Eye, HistoryIcon, IdCard, LogOut, User, ChevronRight } from 'lucide-react';
import styles from './MoreOptions.module.css';
import useMobile from '../../hooks/isMobile';
import { useContext, useEffect } from 'react';
import { TypeContext } from '../../App';
import { useNavigate } from 'react-router-dom';
import UserAvatar from '../../components/UserAvatar/UserAvatar';
import { useQuery } from '@tanstack/react-query';
import { findUserData } from '../../constants/user';

export default function MoreOptions() {
    const isMobile = useMobile();
    const type = useContext(TypeContext);
    const nav = useNavigate();

    useEffect(() => {
        if (!isMobile) {
            nav("/edit-user");
        }
    }, [isMobile, nav]);

    const userName = useQuery({
        queryKey: ['user'],
        queryFn: () => findUserData(),
        select: (response) => {
            return response.data.nome;
        },
        retry: false,
    });

    const OptionItem = ({ icon, title, onClick, danger }: { icon: React.ReactNode, title: string, onClick: () => void, danger?: boolean }) => (
        <button className={`${styles.optionItem} ${danger ? styles.dangerOption : ''}`} onClick={onClick} type="button">
            <div className={styles.optionContent}>
                <span className={styles.optionIcon}>{icon}</span>
                <span className={styles.optionTitle}>{title}</span>
            </div>
            {!danger && <ChevronRight className={styles.chevronIcon} size={20} />}
        </button>
    );

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.profileInfo}>
                    <UserAvatar withUsernameClassName={"w-20! h-20! text-3xl! shadow-lg border-4 border-white"} userName={userName.data || "Usuário"} useUserImage={true} />
                    <div className={styles.userDetails}>
                        <h2 className={styles.userName}>{userName.data || "Usuário"}</h2>
                        <span className={styles.userRole}>
                            {type?.type?.includes("admin") ? "Administrador" : type?.type?.includes("personal") ? "Personal Trainer" : "Aluno"}
                        </span>
                    </div>
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Minha Conta</h3>
                    <div className={styles.card}>
                        <OptionItem icon={<IdCard size={22} />} title='Suas informações' onClick={() => nav("/edit-user")} />
                    </div>
                </div>

                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Ações e Configurações</h3>
                    <div className={styles.card}>
                        {type?.type?.includes("aluno") && (
                            <>
                                <OptionItem icon={<Banknote size={22} />} title='Histórico de compras' onClick={() => nav("/plans-history")} />
                                <OptionItem icon={<HistoryIcon size={22} />} title='Histórico de agendamentos' onClick={() => nav("/schedule-history")} />
                            </>
                        )}

                        {/* personal não admin */}
                        {type?.type?.includes("personal") && !type?.type?.includes("admin") && (
                            <>
                                <OptionItem icon={<Eye size={22} />} title='Solicitações' onClick={() => nav("/personal/check-schedule")} />
                                <OptionItem icon={<Clock size={22} />} title='Ajustar disponibilidade' onClick={() => nav("/set-availability")} />
                            </>
                        )}

                        {/* personal e admin */}
                        {type?.type?.includes("personal") && type?.type?.includes("admin") && (
                            <>
                                <OptionItem icon={<Eye size={22} />} title='Solicitações' onClick={() => nav("/personal/check-schedule")} />
                                <OptionItem icon={<Boxes size={22} />} title='Pacotes' onClick={() => nav("/packages")} />
                                <OptionItem icon={<Clock size={22} />} title='Ajustar disponibilidade' onClick={() => nav("/set-availability")} />
                                <OptionItem icon={<User size={22} />} title='Criar personal' onClick={() => nav("/create-personal")} />
                            </>
                        )}

                        {/* apenas admin */}
                        {type?.type?.includes("admin") && !type?.type?.includes("personal") && (
                            <>
                                <OptionItem icon={<Boxes size={22} />} title='Pacotes' onClick={() => nav("/packages")} />
                            </>
                        )}
                    </div>
                </div>

                <div className={styles.section}>
                    <div className={styles.card}>
                        <OptionItem icon={<LogOut size={22} />} title='Sair' onClick={() => nav("/logout")} danger={true} />
                    </div>
                </div>
            </div>
        </div>
    );
}