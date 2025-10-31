import { Banknote, HistoryIcon, IdCard, MapPin } from 'lucide-react';
import Button from '../../components/Button/Button';
import styles from './MoreOptions.module.css';
import useMobile from '../../hooks/isMobile';
import { useContext } from 'react';
import { TypeContext } from '../../App';
import UserHeaderMobile from '../../components/UserHeader/UserHeaderMobile/UserHeaderMobile';
import { useNavigate } from 'react-router-dom';

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
                    <Button icon={<IdCard />} type='button' classNameVariable={styles.buttonOption} title='Suas informações' onClick={() => handleNavigate("/edit-user")}/>
                    <Button icon={<MapPin />} type='button' classNameVariable={styles.buttonOption} title='Endereços Cadastrados' />
                    <Button icon={<Banknote />} type='button' classNameVariable={styles.buttonOption} title='Histórico de compras' />
                    <Button icon={<HistoryIcon />} type='button' classNameVariable={styles.buttonOption} title='Historico de agendamentos' />
                </div>
            </div>

            {isMobile && <UserHeaderMobile type={type} />}
        </>
    )
}
