import classNames from 'classnames';
import GoBackButton from '../../components/GoBackButton/GoBackButton';
import styles from './ScheduleDetails.module.css';
import useMobile from '../../hooks/isMobile';
import { CalendarDays, Clock } from 'lucide-react';
import CardInfo from '../../components/CardInfo/CardInfo';
import Button from '../../components/Button/Button';
export default function ScheduleDetails() {
    const isMobile = useMobile();

    const dataMocked = {
        id: 1,
        clientName: "João Silva",
        age: 28,
        type: "Personal",
        phone: "(11) 98765-4321",
        local: "Academia FitLife",
        address: "Rua das Flores, 123, São Paulo, SP",
        date: "2025-11-15",
        initialHour: "14:00",
        finalHour: "15:00",
        duration: "60 minutos",
        status: "pending"
    }

    const date = new Date(`${dataMocked.date}T${dataMocked.initialHour}`);

    const formattedDate = `${date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    })} das ${dataMocked.initialHour} às ${dataMocked.finalHour}`;

    return (
        <div className={classNames(styles.container, { [styles.containerMobile]: isMobile })}>
            <GoBackButton />
            <div className={styles.wrapperContent}>
                <div className={styles.title}>
                    <h1>Detalhes do agendamento</h1>
                    {dataMocked.status === "done" &&
                        <div className={styles.statusIndicatorCheckSchedule} style={{ backgroundColor: "#0ea500", padding: "6px 12px", borderRadius: "8px", color: "#fff" }}>
                            <span className={styles.statusDone}>Concluído</span>
                        </div>
                    }

                    {dataMocked.status === "pending" &&
                        <div className={styles.statusIndicatorCheckSchedule} style={{ backgroundColor: "#FFA500", padding: "6px 12px", borderRadius: "8px", color: "#fff" }}>
                            <span className={styles.statusPending}>Pendente</span>
                        </div>
                    }

                    {dataMocked.status === "cancelled" &&
                        <div className={styles.statusIndicatorCheckSchedule} style={{ backgroundColor: "#FF0000", padding: "6px 12px", borderRadius: "8px", color: "#fff" }}>
                            <span className={styles.statusCancelled}>Cancelado</span>
                        </div>
                    }
                </div>
                <div className={classNames(styles.contentRow)}>
                    <div className={styles.content}>
                        <div className={styles.textWithIcon}>
                            <span><CalendarDays /></span><span>{formattedDate}</span>
                        </div>
                        <div className={styles.textWithIcon}>
                            <span><Clock /></span><span>{dataMocked.duration}</span>
                        </div>
                    </div>
                </div>

                <CardInfo isMobile={isMobile} HeaderTitle="Personal" title="Fábio" subtitle="Idade: 88 anos" includeImg={true} />

                <div className={styles.contentDetails}>
                    <h2 className={styles.subtitle}>Detalhes</h2>
                    <div className={styles.planDetails}>
                        <span className={styles.planDetailsDescription}>Tipo: {dataMocked.type}</span>
                        <span className={styles.planDetailsDescription}>Local: {dataMocked.local}</span>
                        <span className={styles.planDetailsDescription}>Endereço: {dataMocked.address}</span>
                    </div>
                </div>
            </div>
            {dataMocked.status === "pending" &&
                <div className={classNames(styles.buttons, { [styles.buttonsMobile]: isMobile })}>
                    <Button type="button" title="Aceitar" classNameVariable="btn-check-schedule accept" />
                    <Button type="button" title="Recusar" classNameVariable="btn-check-schedule decline" />
                    <Button type="button" title="Reagendar" classNameVariable="btn-check-schedule reschedule" />
                </div>
            }
        </div >
    );
}
