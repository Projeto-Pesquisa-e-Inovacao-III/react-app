import { Banknote, Boxes, Eye, HistoryIcon, IdCard, LogOut, MapPin, Package, User, Users } from 'lucide-react';
import Button from '../../components/Button/Button';
import styles from './MoreOptions.module.css';
import useMobile from '../../hooks/isMobile';
import { useContext } from 'react';
import { TypeContext } from '../../App';
import { useNavigate } from 'react-router-dom';
import Logout from '../User/Logout/Logout';

export default function MoreOptions() {
    const isMobile = useMobile();
    const type = useContext(TypeContext);
    const nav = useNavigate();
    function handleNavigate(option: string) {
        nav(`${option}`);
    }

    return (
        <>
            <div className={styles.container}>
                <div className={styles.header}>
                    <img src="https://thispersondoesnotexist.com/" alt="" />
                    <h2>Usuario</h2>
                </div>
                <div className={styles.options}>
                    <Button icon={<IdCard />} type='button' classNameVariable={styles.buttonOption} title='Suas informações' onClick={() => nav("/edit-user")} />
                    {type == "student" &&
                        <>
                            <Button icon={<MapPin />} type='button' classNameVariable={styles.buttonOption} title='Endereços Cadastrados' />
                            <Button icon={<Banknote />} type='button' classNameVariable={styles.buttonOption} title='Histórico de compras' onClick={() => nav("/plans-history")} />
                            <Button icon={<HistoryIcon />} type='button' classNameVariable={styles.buttonOption} title='Historico de agendamentos' />
                        </>
                    }

                    {type == "personal" &&
                        <>
                            <Button icon={<Eye />} type='button' classNameVariable={styles.buttonOption} title='Solicitações' onClick={() => nav("/personal/check-schedule")} />
                            <Button icon={<Boxes />} type='button' classNameVariable={styles.buttonOption} title='Pacotes' onClick={() => nav("/packages")} />
                        </>
                    }
                    <Button icon={<LogOut />} type='button' classNameVariable={styles.buttonOption} title='Sair' onClick={() => nav("/logout")} />
                </div>

            </div>
        </>
    )
}
