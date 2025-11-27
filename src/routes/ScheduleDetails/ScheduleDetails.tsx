import classNames from 'classnames';
import GoBackButton from '../../components/GoBackButton/GoBackButton';
import styles from './ScheduleDetails.module.css';
import useMobile from '../../hooks/isMobile';
import { CalendarDays, Clock } from 'lucide-react';
import CardInfo from '../../components/CardInfo/CardInfo';
import Button from '../../components/Button/Button';
import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext, useSearchParams } from 'react-router-dom';
import RegisterAbsenceModal from '../../components/Modal/RegisterAbsenceModal/RegisterAbsenceModal';
import { findAppointmentById } from '../../constants/schedule';
import { useQuery } from '@tanstack/react-query';

export default function ScheduleDetails() {
    const isMobile = useMobile();

    const type: string = useOutletContext();

    const [searchParams] = useSearchParams();

    useEffect(() => {
        console.log("ID:", searchParams.get('id'));
    }, []);

    const appointment = useQuery({
        queryKey: ['appointmentDetails', searchParams.get('id')],
        queryFn: () => findAppointmentById(Number(searchParams.get('id'))),
        enabled: !!searchParams.get('id'),
        select: (res) => res.data,
    });

    const date = new Date(`${appointment.data?.dataInicio}`);
    const today = new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });

    const formattedDate = `${date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    })} das ${appointment.data?.dataInicio.split('T')[1].slice(0, 5)} às ${appointment.data?.dataFim.split('T')[1].slice(0, 5)}`;

    const [registerAbsence, setRegisterAbsence] = useState<boolean>(false);

    return (
        <div className={classNames(styles.container, { [styles.containerMobile]: isMobile })}>
            <GoBackButton />
            <div className={styles.wrapperContent}>
                <div className={styles.title}>
                    <h1>Detalhes do agendamento</h1>
                    {appointment.data?.status === "CONCLUIDO" &&
                        <div className={styles.statusIndicatorCheckSchedule} style={{ backgroundColor: "#0ea500", padding: "6px 12px", borderRadius: "8px", color: "#fff" }}>
                            <span className={styles.statusDone}>Concluído</span>
                        </div>
                    }

                    {appointment.data?.status === "PENDENTE_PERSONAL_CONCLUIR" &&
                        <div className={styles.statusIndicatorCheckSchedule} style={{ backgroundColor: "#FFA500", padding: "6px 12px", borderRadius: "8px", color: "#fff" }}>
                            <span className={styles.statusPending}>Pendente</span>
                        </div>
                    }

                    {appointment.data?.status === "PENDENTE_PERSONAL_APROVACAO" &&
                        <div className={styles.statusIndicatorCheckSchedule} style={{ backgroundColor: "#FFA500", padding: "6px 12px", borderRadius: "8px", color: "#fff" }}>
                            <span className={styles.statusPending}>Em análise</span>
                        </div>
                    }

                    {appointment.data?.status === "PENDENTE_CLIENTE_APROVACAO" &&
                        <div className={styles.statusIndicatorCheckSchedule} style={{ backgroundColor: "#FFA500", padding: "6px 12px", borderRadius: "8px", color: "#fff" }}>
                            <span className={styles.statusPending}>Aprovação pendente</span>
                        </div>
                    }

                    {appointment.data?.status === "CANCELADO_PERSONAL" &&
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
                            <span><Clock /></span><span>{appointment.data?.duracaoMinutos} minutos</span>
                        </div>
                    </div>
                </div>

                {type === "aluno" &&
                    <CardInfo isMobile={isMobile} HeaderTitle="Personal" title={appointment.data?.personal.nome} subtitle={`Idade: ${appointment.data?.personal.idade} anos`} includeImg={true} imgUrl={appointment.data?.personal.avatarUrl} />
                }

                {type === "personal" &&
                    <CardInfo isMobile={isMobile} HeaderTitle="Aluno" title="Rapaz" subtitle="Idade: 48 anos" includeImg={true} />
                }

                <div className={styles.contentDetails}>
                    <h2 className={styles.subtitle}>Detalhes</h2>
                    <div className={styles.planDetails}>
                        <span className={styles.planDetailsDescription}>Tipo: {appointment.data?.endereco.tipo}</span>
                        {/* <span className={styles.planDetailsDescription}>Local: {dataMocked.local}</span> */}
                        <span className={styles.planDetailsDescription}>Endereço: {appointment.data?.endereco.cep.logradouro} - {appointment.data?.endereco.cep.bairro}, {appointment.data?.endereco.numero} - {appointment.data?.endereco.cep.uf}</span>
                    </div>
                </div>
            </div>
            {appointment.data?.status === "PENDENTE_PERSONAL_APROVACAO" &&

                <div className={classNames(styles.buttons, { [styles.buttonsMobile]: isMobile })}>
                    {type === "personal" && today > formattedDate &&
                        <div className={styles.buttonAbsence}>
                            <Button type="button" typeButton="decline" title="Registrar ausência" classNameVariable="btn-check-schedule decline" onClick={() => setRegisterAbsence(true)} />
                        </div>
                    }

                    <div className={classNames(styles.buttonGroup, { [styles.buttonGroupStudent]: type === "student" })}>
                        <Button type="button" typeButton="accept" title="Aceitar" classNameDiv={styles.buttonActions} classNameVariable={styles.btnCheckSchedule} />
                        <Button type="button" typeButton="decline" title="Recusar" classNameDiv={styles.buttonActions} classNameVariable={styles.btnCheckSchedule} />
                        <Button type="button" typeButton="other" title="Reagendar" classNameDiv={styles.buttonActions} classNameVariable={styles.btnCheckSchedule} />
                    </div>
                </div>
            }

            {registerAbsence &&
                <RegisterAbsenceModal closeThen={setRegisterAbsence} />
            }
        </div>
    );
}
