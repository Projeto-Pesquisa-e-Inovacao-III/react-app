import classNames from 'classnames';
import GoBackButton from '../../components/GoBackButton/GoBackButton';
import styles from './ScheduleDetails.module.css';
import useMobile from '../../hooks/isMobile';
import { CalendarDays, Clock } from 'lucide-react';
import CardInfo from '../../components/CardInfo/CardInfo';
import Button from '../../components/Button/Button';
import { useContext, useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import RegisterAbsenceModal from '../../components/Modal/RegisterAbsenceModal/RegisterAbsenceModal';
import { acceptUserAppointment, appointmentAtCalendar, concludeAppointment, findAppointmentById, refuseAppointment, reportAbsencePersonal } from '../../constants/schedule';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import TimerModal from '../../components/Modal/TimerModal/TimerModal';
import SuccessModal from '../../components/Modal/SuccessModal/SuccessModal';
import { startOfDay } from 'date-fns';
import NewEvent from '../../components/NewEvent/NewEvent';
import ErrorModal from '../../components/Modal/ErrorModal/ErrorModal';
import type { AbsenceAppointment } from '../../models/schedule';
import Skeleton from 'react-loading-skeleton';
import { TypeContext } from '../../App';

type modalTypes = "reschedule" | "accept" | "conclude" | "decline" | "success" | "registerAbsence" | "cancel" | "error" | null;

export default function ScheduleDetails() {
    const isMobile = useMobile();
    const queryClient = useQueryClient();

    const type = useContext(TypeContext);


    console.log("User type in ScheduleDetails:", type);

    const [searchParams] = useSearchParams();


    const appointment = useQuery({
        queryKey: ['appointmentDetails'],
        queryFn: () => findAppointmentById(Number(searchParams.get('id'))),
        enabled: !!searchParams.get('id'),
        select: (res) => res.data,
    });

    const appointments = useQuery({
        queryKey: ["appointmentsAtCalendar"],
        queryFn: () => appointmentAtCalendar(),
    })

    const [buttonsActionsCondition, setButtonsActionsCondition] = useState<boolean>(false);

    const location = useLocation();

    useEffect(() => {
        const today = new Date(startOfDay(new Date()));

        const appt = new Date(startOfDay(appointment.data?.dataInicio));

        setButtonsActionsCondition(today >= appt);
    }, [location.pathname, appointment.data?.dataInicio]);

    const formattedDate = `${new Date(`${appointment.data?.dataInicio}`).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    })} das ${appointment.data?.dataInicio.split('T')[1].slice(0, 5)} às ${appointment.data?.dataFim.split('T')[1].slice(0, 5)}`;

    const [successModalInfo, setSuccessModalInfo] = useState<{
        title: string;
        content: string;
    } | null>(null);

    const [openModal, setOpenModal] = useState<modalTypes>(null);

    const [appointmentId, setAppointmentId] = useState<number>(0);

    function handleSuccessModal(title: string, content: string) {
        setOpenModal("success");
        setSuccessModalInfo({ title, content });
    }

    function handleErrorModal(title: string, content: string) {
        setSuccessModalInfo({ title, content });
        setOpenModal("error");
    }


    async function acceptAppointment(id: number) {
        await acceptUserAppointment(id).then(async (res) => {
            console.log("Agendamento aceito:", res);
            handleSuccessModal("Agendamento Aceito", "O agendamento foi aceito com sucesso.");
            await queryClient.invalidateQueries({ queryKey: ['appointmentDetails'] });
            await queryClient.invalidateQueries({ queryKey: ['appointmentsAtCalendar'] });
        }).catch((error) => {
            console.error("Erro ao concluir o agendamento:", error);
        });
    }

    async function declineAppointment(id: number) {
        await refuseAppointment(id).then(async () => {
            handleSuccessModal("Agendamento Recusado", "O agendamento foi recusado.");
            await queryClient.invalidateQueries({ queryKey: ['appointmentDetails'] });
            await queryClient.invalidateQueries({ queryKey: ['appointmentsAtCalendar'] });
        }).catch((error) => {
            console.error("Erro ao recusar o agendamento:", error);
            handleErrorModal("Erro ao recusar o agendamento", error.response?.data?.Exception || "Ocorreu um erro ao recusar o agendamento.");
        });
    }

    async function cancelAppointment(id: number) {
        await refuseAppointment(id).then(async () => {
            handleSuccessModal("Agendamento Cancelado", "O agendamento foi cancelado.");
            await queryClient.invalidateQueries({ queryKey: ['appointmentDetails'] });
            await queryClient.invalidateQueries({ queryKey: ['appointmentsAtCalendar'] });
        }).catch((error) => {
            console.error("Erro ao cancelar o agendamento:", error);
            handleErrorModal("Erro ao cancelar o agendamento", error.response?.data?.Exception || "Ocorreu um erro ao cancelar o agendamento.");
        });
    }

    async function registerAbsenceAppointment(data: { type: string; description: string }) {
        const payload: AbsenceAppointment = {
            idAgendamento: appointmentId,
            tipoUsuario: data.type,
            descricaoCancelamento: data.description === "" ? "" : data.description
        };

        console.log("Payload de ausência:", payload);
        await reportAbsencePersonal(payload).then(async () => {
            handleSuccessModal("Ausência Registrada", "A ausência foi registrada com sucesso.");
            await queryClient.invalidateQueries({ queryKey: ['appointmentDetails'] });
            await queryClient.invalidateQueries({ queryKey: ['appointmentsAtCalendar'] });

        }).catch((error) => {
            console.error("Erro ao registrar a ausência:", error);
        });
    }

    function handleConcludeAppointment(id: number) {
        concludeAppointment(id).then(async () => {
            handleSuccessModal("Agendamento Concluído", "O agendamento foi concluído com sucesso.");
            await queryClient.invalidateQueries({ queryKey: ['appointmentDetails'] });
            await queryClient.invalidateQueries({ queryKey: ['appointmentsAtCalendar'] });

        }).catch((error) => {
            console.error("Erro ao concluir o agendamento:", error);
        });
    }

    async function handleSuccessReschedule() {
        await queryClient.invalidateQueries({ queryKey: ['appointmentDetails'] });
        await queryClient.invalidateQueries({ queryKey: ['appointmentsAtCalendar'] });

        handleSuccessModal("Reagendado com sucesso", "Horário reagendado com sucesso");
    }

    function handleModal(id: number, type: modalTypes) {
        setAppointmentId(id);
        setOpenModal(type);
    }


    console.log("Dados do agendamento:", appointment.data);



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

                        {appointment.data?.status === "PENDENTE_PERSONAL_CONCLUIR" &&
                            (<div className={styles.statusIndicatorCheckSchedule} style={{ backgroundColor: "#FFA500", padding: "6px 12px", borderRadius: "8px", color: "#fff" }}>
                                <span className={styles.statusPending}>Pendente</span>
                            </div>)
                        }

                        {appointment.data?.status === "APROVADO" &&
                            (<div className={styles.statusIndicatorCheckSchedule} style={{ backgroundColor: "#FFA500", padding: "6px 12px", borderRadius: "8px", color: "#fff" }}>
                                <span className={styles.statusPending}>Marcado</span>
                            </div>)
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

                        {(appointment.data?.status === "CANCELADO_PERSONAL" || appointment.data?.status === "CANCELADO_CLIENTE") &&
                            <div className={styles.statusIndicatorCheckSchedule} style={{ backgroundColor: "#FF0000", padding: "6px 12px", borderRadius: "8px", color: "#fff" }}>
                                <span className={styles.statusCancelled}>Cancelado</span>
                            </div>
                        }

                        {(appointment.data?.status === "AUSENCIA_PERSONAL" || appointment.data?.status === "AUSENCIA_CLIENTE") &&
                            <div className={styles.statusIndicatorCheckSchedule} style={{ backgroundColor: "#FF0000", padding: "6px 12px", borderRadius: "8px", color: "#fff" }}>
                                <span className={styles.statusCancelled}>Ausência</span>
                            </div>
                        }
                    </div>
                    <div className={classNames(styles.contentRow)}>
                        <div className={styles.content}>
                            <div className={styles.textWithIcon}>
                                <span><CalendarDays /></span><span>{appointment.isLoading ? <Skeleton width={250} /> : formattedDate}</span>
                            </div>
                            <div className={styles.textWithIcon}>
                                <span><Clock /></span><span>{appointment.isLoading ? <Skeleton width={250} /> : `${appointment.data?.duracaoMinutos} minutos`}</span>
                            </div>
                        </div>
                    </div>
                    {!type || type?.type === null &&
                        <CardInfo isMobile={isMobile} HeaderTitle="Personal" title={<Skeleton width={150} height={20} />} subtitle={<Skeleton width={150} height={20} />} includeImg={true} imgUrl={appointment.data?.personal?.avatarUrl ? appointment.data?.personal?.avatarUrl : undefined} isLoading={appointment.isLoading} />
                    }

                    {type?.type === "aluno" &&
                        <CardInfo isMobile={isMobile} HeaderTitle="Personal" title={appointment.data?.personal?.nome} subtitle={`Idade: ${appointment.data?.personal?.idade} anos`} includeImg={true} imgUrl={appointment.data?.personal?.avatarUrl ? appointment.data?.personal?.avatarUrl : undefined} isLoading={appointment.isLoading} />
                    }

                    {type?.type === "personal" &&
                        <CardInfo isMobile={isMobile} HeaderTitle="Aluno" title={appointment.data?.aluno?.nome} subtitle={`Idade: ${appointment.data?.aluno?.idade} anos`} includeImg={true} imgUrl={appointment.data?.aluno?.avatarUrl ? appointment.data?.aluno?.avatarUrl : undefined} isLoading={appointment.isLoading} />
                    }

                    <div className={styles.contentDetails}>
                        <h2 className={styles.subtitle}>Detalhes</h2>
                        <div className={styles.planDetails}>
                            <span className={styles.planDetailsDescription}>
                                Tipo:
                                <span className={styles.planDetailsText}>{appointment.isLoading ? <Skeleton width={250} className='mb-2' /> : appointment.data?.tipoAula
                                    ?.toLowerCase()
                                    ?.replace(/^\w/, (c: string) => c.toUpperCase())}
                                </span>
                            </span>
                            <span className={styles.planDetailsDescription}>
                                Local:
                                <span className={styles.planDetailsText}>
                                    {appointment.isLoading ? <Skeleton width={250} className='mb-1 mt-1' /> : appointment.data?.endereco.tipo?.toLowerCase()
                                        ?.replace(/^\w/, (c: string) => c.toUpperCase())}
                                </span>
                            </span>
                            <span className={styles.planDetailsDescription}>Endereço: {appointment.isLoading ? <Skeleton width={250} className='mb-1 mt-1' /> : appointment.data?.endereco.cep.logradouro} - {appointment.data?.endereco.cep.bairro}, {appointment.data?.endereco.numero} - {appointment.data?.endereco.cep.uf}</span>
                            {appointment.data?.endereco.complemento && <span className={styles.planDetailsDescription}>Complemento: {appointment.data?.endereco.complemento}</span>}
                        </div>
                    </div>
                </div>

                <div className={classNames(styles.buttons, { [styles.buttonsMobile]: isMobile, [styles.buttonsActionsPersonal]: appointment.data?.status === "PENDENTE_PERSONAL_CONCLUIR" && buttonsActionsCondition })}>
                    {type?.type === "personal" && buttonsActionsCondition && appointment.data?.status === "PENDENTE_PERSONAL_CONCLUIR" &&
                        <>

                            <div className={styles.buttonAbsence}>
                                {appointment.isLoading ? (
                                    <Skeleton width="100%" height={40} />
                                ) : (
                                    <Button type="button" typeButton="accept" title="Concluir aula" classNameVariable="btn-check-schedule accept" onClick={() => handleModal(appointment.data?.id, "conclude")} />
                                )}
                            </div>

                            <div className={styles.buttonAbsence}>
                                {appointment.isLoading ? (
                                    <Skeleton width="100%" height={40} />
                                ) : (
                                    <Button type="button" typeButton="decline" title="Registrar ausência" classNameVariable="btn-check-schedule decline" onClick={() => {
                                        handleModal(appointment.data?.id, "registerAbsence");
                                    }} />
                                )}
                            </div>
                        </>
                    }

                    {
                        (
                            (type?.type === "personal" && (

                                appointment.data?.status === "PENDENTE_PERSONAL_APROVACAO"
                            ))
                            ||
                            (type?.type === "aluno" && appointment.data?.status === "PENDENTE_CLIENTE_APROVACAO")
                        ) && (
                            <div className={classNames(styles.buttonGroup, { [styles.buttonGroupStudent]: type?.type === "personal" || type?.type === "aluno" })}>
                                <Button type="button" typeButton="accept" title="Aceitar" classNameDiv={styles.buttonActions} classNameVariable={styles.btnCheckSchedule} onClick={() => {
                                    handleModal(appointment.data?.id, "accept");
                                }} />
                                <Button type="button" typeButton="decline" title="Recusar" classNameDiv={styles.buttonActions} classNameVariable={styles.btnCheckSchedule} onClick={() => {
                                    handleModal(appointment.data?.id, "decline");
                                }} />
                                <Button type="button" typeButton="other" title="Reagendar" classNameDiv={styles.buttonActions} classNameVariable={styles.btnCheckSchedule} onClick={() => {
                                    handleModal(appointment.data?.id, "reschedule");
                                }} />
                            </div>
                        )
                    }

                    {(!type || type?.type === null || appointment.isLoading || !appointment.data) && (
                        <div className={classNames(styles.buttonGroup)}>
                            <Skeleton width={200} height={60} />
                            <Skeleton width={200} height={60} />
                        </div>
                    )}

                    {appointment.data?.status === "APROVADO" && (
                        <div className={classNames(styles.buttonGroup)}>
                            <Button type="button" typeButton="other" title="Reagendar" classNameDiv={styles.buttonActions} classNameVariable={styles.btnCheckSchedule} onClick={() => {
                                handleModal(appointment.data?.id, "reschedule");
                            }} />
                            <Button type="button" typeButton="decline" title="Cancelar" classNameDiv={styles.buttonActions} classNameVariable={styles.btnCheckSchedule} onClick={() => {
                                handleModal(appointment.data?.id, "cancel");
                            }} />
                        </div>
                    )}
                            

                    {type?.type === "aluno" && appointment.data?.status === "PENDENTE_PERSONAL_APROVACAO" && (
                        <div className={classNames(styles.buttonGroup)}>
                            <Button type="button" typeButton="other" title="Reagendar" classNameDiv={styles.buttonActions} classNameVariable={styles.btnCheckSchedule} onClick={() => {
                                handleModal(appointment.data?.id, "reschedule");
                            }} />
                            <Button type="button" typeButton="decline" title="Cancelar" classNameDiv={styles.buttonActions} classNameVariable={styles.btnCheckSchedule} onClick={() => {
                                handleModal(appointment.data?.id, "cancel");
                            }} />
                        </div>
                    )}
                </div>

                {openModal === "accept" && <TimerModal callSuccessModal={() => acceptAppointment(appointmentId)} isMobile={isMobile} closeThen={() => setOpenModal(null)} title="Aceitar Agendamento" content="Tem certeza que deseja aceitar o agendamento?" buttonTitle="Aceitar agendamento" />}

                {openModal === "conclude" && <TimerModal callSuccessModal={() => handleConcludeAppointment(appointmentId)} isMobile={isMobile} closeThen={() => setOpenModal(null)} title="Concluir Agendamento" content="Tem certeza que deseja concluir o agendamento?" buttonTitle="Concluir agendamento" />}

                {openModal === "decline" && <TimerModal callSuccessModal={() => declineAppointment(appointmentId)} isMobile={isMobile} closeThen={() => setOpenModal(null)} title="Recusar agendamento" content="Tem certeza que deseja Recusar o agendamento?" buttonTitle="Recusar agendamento" isDelete={true} />}

                {openModal === "cancel" && <TimerModal callSuccessModal={() => cancelAppointment(appointmentId)} isMobile={isMobile} closeThen={() => setOpenModal(null)} title="Cancelar agendamento" content="Tem certeza que deseja Cancelar o agendamento?" buttonTitle="Cancelar agendamento" isDelete={true} />}

                {openModal === "success" && <SuccessModal isMobile={isMobile} closeThen={() => setOpenModal(null)} title={successModalInfo?.title} content={successModalInfo?.content} />}

                {openModal === "error" && <ErrorModal closeThen={() => setOpenModal(null)} title={successModalInfo?.title} content={successModalInfo?.content} />}

                {openModal === "registerAbsence" &&
                    <RegisterAbsenceModal closeThen={() => setOpenModal(null)} onSubmit={registerAbsenceAppointment} />
                }

                {openModal === "reschedule" && (
                    <>
                        <NewEvent
                            isMobile={isMobile}
                            close={() => setOpenModal(null)}
                            openModalExtern={handleSuccessReschedule}
                            errorModal={() => handleErrorModal("Erro ao reagendar", "Não foi possível reagendar o horário")}
                            insertedEvents={appointments.data?.data}
                            title="Reagendar horário"
                            buttonTitle="Reagendar"
                            isReschedule={true}
                            rescheduleId={appointmentId}
                            clickedDate={appointment.data?.dataInicio.split("T")[0] || ""}
                            typeUser={type?.type || undefined}
                            appoitmentData={appointment.data}
                            goToNextStep={type?.type === "personal" ? false : true}
                        />
                    </>
                )}
            </div>
        </>
    );
}
