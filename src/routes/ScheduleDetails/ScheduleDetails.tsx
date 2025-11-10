import classNames from 'classnames';
import GoBackButton from '../../components/GoBackButton/GoBackButton';
import styles from './ScheduleDetails.module.css';
import useMobile from '../../hooks/isMobile';
import { CalendarDays, Clock } from 'lucide-react';
export default function ScheduleDetails() {
    const isMobile = useMobile();

    return (
        <div className={styles.container}>
            <GoBackButton />
            <div className={styles.title}>
                <h1>Detalhes do agendamento</h1>
            </div>
            <div className={classNames(styles.contentRow)}>
                <div className={styles.content}>
                    <span><CalendarDays />12 de Janeiro das 14:00 às 15:00</span>
                    <span><Clock />60 minutos</span>
                </div>
            </div>

            <div className={styles.contentRow}>
                <h2 className={styles.subtitle}>Detalhes do pedido</h2>
                <div className={classNames(styles.content, styles.orderDetails)}>
                    <span>Produto: Plano Mensal</span>
                    <span>Valor: R$ 29,90</span>
                    <span>Data da compra: 01/05/2024</span>
                </div>
            </div>
            <div className={styles.dashed}></div>
            <div className={styles.contentRow}>
                <div className={styles.planDetails}>
                    <h2 className={styles.subtitle}>Plano mensal</h2>
                    <span className={styles.planDetailsDescription}>Lorem ipsum dolor sit, amet consectetur adipisicing elit. At, id nesciunt pariatur similique neque nihil.</span>
                </div>
                <div className={classNames(styles.cardDetails, { [styles.cardDetailsMobile]: isMobile })}>
                    <span className={styles.highlight}>Subtotal: <span>R$ 29,90</span></span>
                    <span className={styles.highlight}>Desconto: <span>R$ 0,00</span></span>
                    <div className={styles.dashed}></div>
                    <span className={styles.highlight}>Total: <span>R$ 29,90</span></span>
                </div>
            </div>
        </div >
    );
}
