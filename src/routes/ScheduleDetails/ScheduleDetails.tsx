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
import { acceptUserAppointment, concludeAppointment, findAppointmentById, refuseAppointment, reportAbsencePersonal } from '../../constants/schedule';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { BASE_URL } from '../../system';
import CheckScheduleModal from '../../components/Modal/CheckScheduleModal/CheckScheduleModal';
import TimerModal from '../../components/Modal/TimerModal/TimerModal';
import SuccessModal from '../../components/Modal/SuccessModal/SuccessModal';

type modalTypes = "reschedule" | "accept" | "conclude" | "decline" | "success" | "registerAbsence" | null;

export default function ScheduleDetails() {
    const isMobile = useMobile();
    const queryClient = useQueryClient();

    const type: string = useOutletContext();

    const [searchParams] = useSearchParams();



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

    const [successModalInfo, setSuccessModalInfo] = useState<{
        title: string;
        content: string;
    } | null>(null);

    const [openModal, setOpenModal] = useState<modalTypes>(null);

    const [appointmentId, setAppointmentId] = useState<number>(0);

    function handleSuccessModal(title: string, content: string) {
        setSuccessModalInfo({ title, content });
        setOpenModal("success");
    }


    async function acceptAppointment(id: number) {
        await acceptUserAppointment(id).then((res) => {
            console.log("Agendamento aceito:", res);
            handleSuccessModal("Agendamento Aceito", "O agendamento foi aceito com sucesso.");
            queryClient.invalidateQueries({ queryKey: ["personalRequests"] });
        }).catch((error) => {
            console.error("Erro ao concluir o agendamento:", error);
        });
    }

    async function declineAppointment(id: number) {
        await refuseAppointment(id).then(() => {
            handleSuccessModal("Agendamento Recusado", "O agendamento foi recusado.");
            queryClient.invalidateQueries({ queryKey: ["personalRequests"] });
        }).catch((error) => {
            console.error("Erro ao recusar o agendamento:", error);
        });
    }

    async function registerAbsenceAppointment(data: { type: string; description: string }) {
        const payload = {
            idAgendamento: appointmentId,
            tipoUsuario: data.type,
            descricaoCancelamento: data.description
        };
        console.log("Payload de ausência:", payload);
        await reportAbsencePersonal(payload).then(() => {
            handleSuccessModal("Ausência Registrada", "A ausência foi registrada com sucesso.");
            queryClient.invalidateQueries({ queryKey: ["personalRequests"] });

        }).catch((error) => {
            console.error("Erro ao registrar a ausência:", error);
        });
    }

    function handleConcludeAppointment(id: number) {
        concludeAppointment(id).then(() => {
            handleSuccessModal("Agendamento Concluído", "O agendamento foi concluído com sucesso.");
            queryClient.invalidateQueries({ queryKey: ["personalRequests"] });
        }).catch((error) => {
            console.error("Erro ao concluir o agendamento:", error);
        });
    }

    function handleModal(id: number, type: modalTypes) {
        setAppointmentId(id);
        setOpenModal(type);
    }
    return (
        <>
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

                        {(appointment.data?.status === "PENDENTE_PERSONAL_CONCLUIR" || appointment.data?.status === "APROVADO") &&
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

                        {appointment.data?.status === "CANCELADO_PERSONAL" || appointment.data?.status === "CANCELADO_CLIENTE" &&
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
                        <CardInfo isMobile={isMobile} HeaderTitle="Personal" title={appointment.data?.personal.nome} subtitle={`Idade: ${appointment.data?.personal.idade} anos`} includeImg={true} imgUrl={appointment.data?.personal.avatarUrl ? appointment.data?.personal.avatarUrl : undefined} />
                    }

                    {type === "personal" &&
                        <CardInfo isMobile={isMobile} HeaderTitle="Aluno" title={appointment.data?.aluno.nome} subtitle={`Idade: ${appointment.data?.aluno.idade} anos`} includeImg={true} imgUrl={appointment.data?.aluno.avatarUrl ? appointment.data?.aluno.avatarUrl : undefined} />
                    }

                    <div className={styles.contentDetails}>
                        <h2 className={styles.subtitle}>Detalhes</h2>
                        <div className={styles.planDetails}>
                            <span className={styles.planDetailsDescription}>
                                Tipo:
                                <span className={styles.planDetailsText}>{appointment.data?.tipoAula
                                    ?.toLowerCase()
                                    ?.replace(/^\w/, (c) => c.toUpperCase())}
                                </span>
                            </span>
                            <span className={styles.planDetailsDescription}>
                                Local:
                                <span className={styles.planDetailsText}>
                                    {appointment.data?.endereco.tipo?.toLowerCase()
                                        ?.replace(/^\w/, (c) => c.toUpperCase())}
                                </span>
                            </span>
                            <span className={styles.planDetailsDescription}>Endereço: {appointment.data?.endereco.cep.logradouro} - {appointment.data?.endereco.cep.bairro}, {appointment.data?.endereco.numero} - {appointment.data?.endereco.cep.uf}</span>
                        </div>
                    </div>
                </div>
                {type === "personal" && appointment.data?.status === "PENDENTE_PERSONAL_APROVACAO" &&

                    <div className={classNames(styles.buttons, { [styles.buttonsMobile]: isMobile })}>
                        {type === "personal" && today > formattedDate &&
                            <>
                                <div className={styles.buttonAbsence}>
                                    <Button type="button" typeButton="accept" title="Concluir aula" classNameVariable="btn-check-schedule accept" onClick={() => setRegisterAbsence(true)} />
                                </div>

                                <div className={styles.buttonAbsence}>
                                    <Button type="button" typeButton="decline" title="Registrar ausência" classNameVariable="btn-check-schedule decline" onClick={() => setRegisterAbsence(true)} />
                                </div>
                            </>
                        }

                        <div className={classNames(styles.buttonGroup, { [styles.buttonGroupStudent]: type === "personal" })}>
                            <Button type="button" typeButton="accept" title="Aceitar" classNameDiv={styles.buttonActions} classNameVariable={styles.btnCheckSchedule} onClick={() => {
                                handleModal(appointment.data?.agendamentoId, "accept");
                            }} />
                            <Button type="button" typeButton="decline" title="Recusar" classNameDiv={styles.buttonActions} classNameVariable={styles.btnCheckSchedule} onClick={() => {
                                handleModal(appointment.data?.agendamentoId, "decline");
                            }} />
                            <Button type="button" typeButton="other" title="Reagendar" classNameDiv={styles.buttonActions} classNameVariable={styles.btnCheckSchedule} onClick={() => {
                                handleModal(appointment.data?.agendamentoId, "reschedule");
                            }} />
                        </div>
                    </div>
                }

                {registerAbsence &&
                    <RegisterAbsenceModal closeThen={setRegisterAbsence} />
                }

                {openModal === "reschedule" && <CheckScheduleModal closeThen={() => setOpenModal(null)} isMobile={isMobile} openSuccess={() => handleSuccessModal("Agendamento reagendado", "Agendamento reagendado com sucesso!")} appointmentId={appointmentId} />}

                {openModal === "accept" && <TimerModal callSuccessModal={() => acceptAppointment(appointmentId)} isMobile={isMobile} closeThen={() => setOpenModal(null)} title="Aceitar Agendamento" content="Tem certeza que deseja aceitar o agendamento?" buttonTitle="Aceitar agendamento" />}

                {openModal === "conclude" && <TimerModal callSuccessModal={() => handleConcludeAppointment(appointmentId)} isMobile={isMobile} closeThen={() => setOpenModal(null)} title="Concluir Agendamento" content="Tem certeza que deseja concluir o agendamento?" buttonTitle="Concluir agendamento" />}

                {openModal === "decline" && <TimerModal callSuccessModal={() => declineAppointment(appointmentId)} isMobile={isMobile} closeThen={() => setOpenModal(null)} title="Recusar agendamento" content="Tem certeza que deseja Recusar o agendamento?" buttonTitle="Recusar agendamento" isDelete={true} />}

                {openModal === "success" && <SuccessModal isMobile={isMobile} closeThen={() => setOpenModal(null)} title={successModalInfo?.title} content={successModalInfo?.content} />}

                {openModal === "registerAbsence" &&
                    <RegisterAbsenceModal closeThen={() => setOpenModal(null)} onSubmit={registerAbsenceAppointment} />
                }
            </div>
        </>
    );
}
