import { Banknote, Boxes, Clock, Eye, HistoryIcon, IdCard, LogOut} from 'lucide-react';
import Button from '../../components/Button/Button';
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
    }, [isMobile]);

    const userName = useQuery({
        queryKey: ['user'],
        queryFn: () => findUserData(),
        select: (response) => {
            return response.data.nome;
        },
        retry: false,
    })

    return (
        <>
            <div className={styles.container}>
                <div className={styles.header}>
                    <UserAvatar withUsernameClassName={"w-24! h-24! text-3xl!"} userName={userName.data || "Usuario"} useUserImage={true} />
                    <h2>{userName.data || "Usuario"}</h2>
                </div>
                <div className={styles.options}>
                    <Button icon={<IdCard />} type='button' classNameVariable={styles.buttonOption} title='Suas informações' onClick={() => nav("/edit-user")} />
                    {type?.type?.includes("aluno") &&
                        <>
                            <Button icon={<Banknote />} type='button' classNameVariable={styles.buttonOption} title='Histórico de compras' onClick={() => nav("/plans-history")} />
                            <Button icon={<HistoryIcon />} type='button' classNameVariable={styles.buttonOption} title='Historico de agendamentos' onClick={() => nav("/schedule-history")} />
                        </>
                    }

                    {type?.type?.includes("personal") &&
                        <>
                            <Button icon={<Eye />} type='button' classNameVariable={styles.buttonOption} title='Solicitações' onClick={() => nav("/personal/check-schedule")} />
                            <Button icon={<Boxes />} type='button' classNameVariable={styles.buttonOption} title='Pacotes' onClick={() => nav("/packages")} />
                            <Button icon={<Clock />} type='button' classNameVariable={styles.buttonOption} title='Ajustar disponibilidade' onClick={() => nav("/set-availability")} />
                        </>
                    }
                    <Button icon={<LogOut />} type='button' classNameVariable={styles.buttonOption} title='Sair' onClick={() => nav("/logout")} />
                </div>

            </div>
        </>
    )
}
