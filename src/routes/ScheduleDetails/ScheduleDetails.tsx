import classNames from 'classnames';
import GoBackButton from '../../components/GoBackButton/GoBackButton';
import styles from './ScheduleDetails.module.css';
import useMobile from '../../hooks/isMobile';
import { Ban, Building2, CalendarClock, CalendarDays, Check, ClipboardCheck, Clock, MapPin, MessageSquare, Navigation, Send, Sparkles, UserX, X } from 'lucide-react';
import Button from '../../components/Button/Button';
import { useContext, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import RegisterAbsenceModal from '../../components/Modal/RegisterAbsenceModal/RegisterAbsenceModal';
import { acceptUserAppointment, appointmentAtCalendar, concludeAppointment, findAppointmentById, refuseAppointment, reportAbsencePersonal } from '../../constants/schedule';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import TimerModal from '../../components/Modal/TimerModal/TimerModal';
import SuccessModal from '../../components/Modal/SuccessModal/SuccessModal';
import { startOfDay } from 'date-fns';
import useClickOutside from '../../hooks/useClickOutside';
import NewEvent from '../../components/Modal/NewEvent/NewEvent';
import ErrorModal from '../../components/Modal/ErrorModal/ErrorModal';
import type { AbsenceAppointment } from '../../models/schedule';
import Skeleton from 'react-loading-skeleton';
import { TypeContext } from '../../App';
import UserAvatar from '../../components/UserAvatar/UserAvatar';

type modalTypes = "reschedule" | "accept" | "conclude" | "decline" | "success" | "registerAbsence" | "cancel" | "error" | null;

const STATUS_CONFIG: Record<string, { text: string; color: string; textColor?: string; class: string }> = {
    CONCLUIDO: { text: "Concluído", color: "#0ea500", class: "statusDone" },
    PENDENTE_PERSONAL_CONCLUIR: { text: "Pendente", color: "#FFA500", class: "statusPending" },
    APROVADO: { text: "Marcado", color: "#0ea500", class: "statusPending" },
    PENDENTE_PERSONAL_APROVACAO: { text: "Em análise", color: "#ffcc00d8", textColor: "#9c5120", class: "statusPending" },
    PENDENTE_CLIENTE_APROVACAO: { text: "Aprovação pendente", color: "#FFA500", class: "statusPending" },
    CANCELADO_PERSONAL: { text: "Cancelado", color: "#FF0000", class: "statusCancelled" },
    CANCELADO_CLIENTE: { text: "Cancelado", color: "#FF0000", class: "statusCancelled" },
    AUSENCIA_PERSONAL: { text: "Ausência", color: "#FF0000", class: "statusCancelled" },
    AUSENCIA_CLIENTE: { text: "Ausência", color: "#FF0000", class: "statusCancelled" },
};



interface AiMessage { role: 'user' | 'ai'; text: string; }

export default function ScheduleDetails() {
    const isMobile = useMobile();
    const queryClient = useQueryClient();
    const type = useContext(TypeContext);
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
    });

    const [buttonsActionsCondition, setButtonsActionsCondition] = useState<boolean>(false);
    const location = useLocation();

    useEffect(() => {
        const today = new Date(startOfDay(new Date()));
        const appt = new Date(startOfDay(appointment.data?.dataInicio));
        setButtonsActionsCondition(today >= appt);
    }, [location.pathname, appointment.data?.dataInicio]);

    const [successModalInfo, setSuccessModalInfo] = useState<{ title: string; content: string; } | null>(null);
    const [openModal, setOpenModal] = useState<modalTypes>(null);
    const [appointmentId, setAppointmentId] = useState<number>(0);

    const [aiPanelOpen, setAiPanelOpen] = useState(false);
    const [isAiPanelClosing, setIsAiPanelClosing] = useState(false);
    const [aiMessages, setAiMessages] = useState<AiMessage[]>([]);
    const [aiLoading, setAiLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const aiPanelRef = useRef<HTMLDivElement>(null);

    function closeAiPanel() {
        setIsAiPanelClosing(true);
        setTimeout(() => {
            setAiPanelOpen(false);
            setIsAiPanelClosing(false);
        }, 280);
    };

    useClickOutside({
        ref: aiPanelRef,
        callback: () => {
            if (aiPanelOpen && !isAiPanelClosing) {
                closeAiPanel();
            }
        }
    });

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [aiMessages]);

    function handleSuccessModal(title: string, content: string) {
        setOpenModal("success");
        setSuccessModalInfo({ title, content });
    }

    function handleErrorModal(title: string, content: string) {
        setSuccessModalInfo({ title, content });
        setOpenModal("error");
    }

    const handleActionSuccess = async (title: string, content: string) => {
        handleSuccessModal(title, content);
        await queryClient.invalidateQueries({ queryKey: ['appointmentDetails'] });
        await queryClient.invalidateQueries({ queryKey: ['appointmentsAtCalendar'] });
    };

    const handleActionError = (title: string, error: any, defaultMessage: string) => {
        console.error(`${title}:`, error);
        handleErrorModal(title, error?.response?.data?.Exception || defaultMessage);
    };

    async function acceptAppointment(id: number) {
        try {
            await acceptUserAppointment(id);
            await handleActionSuccess("Agendamento Aceito", "O agendamento foi aceito com sucesso.");
        } catch (error) { console.error("Erro ao aceitar o agendamento:", error); }
    }

    async function declineAppointment(id: number) {
        try {
            await refuseAppointment(id);
            await handleActionSuccess("Agendamento Recusado", "O agendamento foi recusado.");
        } catch (error) { handleActionError("Erro ao recusar o agendamento", error, "Ocorreu um erro ao recusar o agendamento."); }
    }

    async function cancelAppointment(id: number) {
        try {
            await refuseAppointment(id);
            await handleActionSuccess("Agendamento Cancelado", "O agendamento foi cancelado.");
        } catch (error) { handleActionError("Erro ao cancelar o agendamento", error, "Ocorreu um erro ao cancelar o agendamento."); }
    }

    async function registerAbsenceAppointment(data: { type: string; description: string }) {
        const payload: AbsenceAppointment = {
            idAgendamento: appointmentId,
            tipoUsuario: data.type,
            descricaoCancelamento: data.description || ""
        };
        try {
            await reportAbsencePersonal(payload);
            await handleActionSuccess("Ausência Registrada", "A ausência foi registrada com sucesso.");
        } catch (error) { console.error("Erro ao registrar a ausência:", error); }
    }

    async function handleConcludeAppointment(id: number) {
        try {
            await concludeAppointment(id);
            await handleActionSuccess("Agendamento Concluído", "O agendamento foi concluído com sucesso.");
        } catch (error) { console.error("Erro ao concluir o agendamento:", error); }
    }

    async function handleSuccessReschedule() {
        await handleActionSuccess("Reagendado com sucesso", "Horário reagendado com sucesso");
    }

    function handleModal(id: number, type: modalTypes) {
        setAppointmentId(id);
        setOpenModal(type);
    }

    interface MapProps { endereco: string; }

    function GoogleMapEmbed({ endereco }: MapProps) {
        const encodedAddress = encodeURIComponent(endereco);
        const mapUrl = `https://www.google.com/maps?q=${encodedAddress}&output=embed`;
        return (
            <div style={{ width: '100%', height: '400px', borderRadius: '8px', overflow: 'hidden' }}>
                <iframe title="Mapa do Endereço" width="100%" height="100%" style={{ border: 0 }} loading="lazy" src={mapUrl} />
            </div>
        );
    }

    function handleWhatsAppClick() {
        window.open(`https://api.whatsapp.com/send?phone=5511945584686&text=Ol%C3%A1%2C%20tudo%20bem%3F`, "_blank");
    }

    function handleGoogleMapsClick() {
        const encodedAddress = encodeURIComponent(
            appointment.data?.endereco?.cep?.logradouro + ", " +
            appointment.data?.endereco?.cep?.bairro + ", " +
            appointment.data?.endereco?.numero + " – " +
            appointment.data?.endereco?.cep?.uf
        );
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`, "_blank");
    }

    const lastNote = appointment.data?.descricao || '"sla nois quebro o musculo dele"';
    const studentName = appointment.data?.aluno?.nome || 'aluno';

    return (
        <>
            <div className={styles.outerWrapper}>
                {/* Main container */}
                <div className={classNames(styles.container, { [styles.containerMobile]: isMobile })}>
                    <div className={styles.header}>
                        <GoBackButton />
                        {appointment.data?.status && STATUS_CONFIG[appointment.data.status] && (
                            <div className={styles.statusIndicatorCheckSchedule} style={{ backgroundColor: STATUS_CONFIG[appointment.data.status].color, color: STATUS_CONFIG[appointment.data.status].textColor, padding: "6px 12px", borderRadius: "8px" }}>
                                <span className={styles[STATUS_CONFIG[appointment.data.status].class]}>
                                    {STATUS_CONFIG[appointment.data.status].text}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className={styles.wrapperContent}>
                        <div className={styles.title}>
                            <h1>Detalhes do agendamento</h1>
                        </div>
                        <div className={styles.mainGrid}>
                            <div className={styles.bottomRow}>
                                {/* Left column: profile */}
                                <div className={styles.leftColumn}>
                                    <div className={styles.professionalCard}>
                                        {type?.type?.includes("personal") ? (
                                            <Link className="cursor-pointer" style={{ textDecoration: 'none', color: 'inherit' }} to={`/users/view-user-data?id=${appointment.data?.aluno.id}`}>
                                                <div className={styles.avatarSection}>
                                                    <UserAvatar imgClassName="w-32! h-32!" withUsernameClassName={"w-32! h-32! text-2xl!"} foto={appointment.data?.aluno?.avatarUrl} userName={appointment.data?.aluno?.nome} />
                                                    <div className={styles.professionalName}>{!type?.type?.includes("aluno") ? appointment.data?.aluno?.nome : appointment.data?.personal?.nome}</div>
                                                    <div className={styles.professionalSub}>{!type?.type?.includes("aluno") ? "Aluno" : "Personal Trainer"}</div>
                                                </div>
                                            </Link>
                                        ) : (
                                            <div className={styles.avatarSection}>
                                                <UserAvatar imgClassName="w-32! h-32!" withUsernameClassName={"w-32! h-32! text-2xl!"} foto={appointment.data?.personal?.avatarUrl} userName={appointment.data?.personal?.nome} />
                                                <div className={styles.professionalName}>{!type?.type?.includes("aluno") ? appointment.data?.aluno?.nome : appointment.data?.personal?.nome}</div>
                                                <div className={styles.professionalSub}>{!type?.type?.includes("aluno") ? "Aluno" : "Personal Trainer"}</div>
                                            </div>
                                        )}
                                        <div className={styles.ageDivider}>
                                            <span className={styles.ageLabel}>Idade</span>
                                            <span className={styles.ageValue}>
                                                {!type?.type?.includes("aluno") ? appointment.data?.aluno?.idade : appointment.data?.personal?.idade} anos
                                            </span>
                                        </div>
                                        {type?.type?.includes("aluno") && (
                                            <div className={styles.contactButtons}>
                                                <button className={styles.contactBtn} onClick={handleWhatsAppClick}>
                                                    <MessageSquare size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div className={styles.dateTimeRow}>
                                        <div className={styles.dateTimeCard}>
                                            <CalendarDays size={18} />
                                            <div>
                                                <span className={styles.dateTimeLabel}>Data</span>
                                                <span className={styles.dateTimeValue}>
                                                    {appointment.isLoading ? <Skeleton width={100} /> :
                                                        new Date(appointment.data?.dataInicio).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </span>
                                            </div>
                                        </div>
                                        <div className={styles.dateTimeCard}>
                                            <Clock size={18} />
                                            <div>
                                                <span className={styles.dateTimeLabel}>Horário</span>
                                                <span className={styles.dateTimeValue}>
                                                    {appointment.isLoading ? <Skeleton width={80} /> :
                                                        `${appointment.data?.dataInicio?.split('T')[1]?.slice(0, 5) || '--:--'} - ${appointment.data?.dataFim?.split('T')[1]?.slice(0, 5) || '--:--'}`}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Info column */}
                                <div className={styles.infoColumn}>
                                    <div className={styles.typeAmbientRow}>
                                        <div className={styles.infoCard}>
                                            <div className={styles.infoCardLabel}><Building2 size={14} /> Tipo de Atendimento</div>
                                            <div className={styles.infoCardValue}>
                                                {appointment.data?.tipoAula?.toLowerCase()?.replace(/^\w/, (c: string) => c.toUpperCase())}
                                            </div>
                                        </div>
                                        <div className={styles.infoCard}>
                                            <div className={styles.infoCardLabel}><MapPin size={14} /> Ambiente</div>
                                            <div className={styles.infoCardValue}>
                                                {appointment.data?.endereco?.tipo?.toLowerCase()?.replace(/^\w/, (c: string) => c.toUpperCase())}
                                            </div>
                                        </div>
                                        {/* AI trigger card */}
                                        <button
                                            className={classNames(styles.infoCard, styles.aiTriggerCard, { [styles.aiTriggerCardActive]: aiPanelOpen })}
                                            onClick={() => {
                                                if (aiPanelOpen) {
                                                    closeAiPanel();
                                                } else {
                                                    setAiPanelOpen(true);
                                                }
                                            }}
                                            title="Dica do Treinador IA"
                                        >
                                            <Sparkles size={28} className={styles.aiTriggerIcon} />
                                        </button>
                                    </div>

                                    <div className={styles.mapCard}>
                                        <div className={styles.mapCardHeader}>
                                            <span className={styles.infoCardLabel}>Endereço Completo</span>
                                            <a onClick={() => handleGoogleMapsClick()} className={styles.directionsLink}><Navigation size={13} /> Direções</a>
                                        </div>
                                        <div className={styles.addressText}>
                                            {appointment.data?.endereco?.cep?.logradouro} – {appointment.data?.endereco?.cep?.bairro}, {appointment.data?.endereco?.numero} – {appointment.data?.endereco?.cep?.uf}
                                        </div>
                                        {appointment.isLoading ? (
                                            <Skeleton height={400} borderRadius={8} />
                                        ) : (
                                            <GoogleMapEmbed endereco={`${appointment.data?.endereco?.cep?.logradouro} ${appointment.data?.endereco?.cep?.bairro} ${appointment.data?.endereco?.numero} ${appointment.data?.endereco?.cep?.uf}`} />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className={classNames(styles.buttons, { [styles.buttonsMobile]: isMobile, [styles.buttonsActionsPersonal]: appointment.data?.status === "PENDENTE_PERSONAL_CONCLUIR" && buttonsActionsCondition })}>
                        {type?.type?.includes("personal") && buttonsActionsCondition && appointment.data?.status === "PENDENTE_PERSONAL_CONCLUIR" &&
                            <>
                                <div className={styles.buttonAbsence}>
                                    {appointment.isLoading ? <Skeleton width="100%" height={40} /> : (
                                        <Button type="button" typeButton="accept" title="Concluir aula" icon={<ClipboardCheck size={16} strokeWidth={2.5} />} classNameVariable="btn-check-schedule accept" onClick={() => handleModal(appointment.data?.id, "conclude")} />
                                    )}
                                </div>
                                <div className={styles.buttonAbsence}>
                                    {appointment.isLoading ? <Skeleton width="100%" height={40} /> : (
                                        <Button type="button" typeButton="decline" title="Registrar ausência" icon={<UserX size={16} strokeWidth={2.5} />} classNameVariable="btn-check-schedule decline" onClick={() => handleModal(appointment.data?.id, "registerAbsence")} />
                                    )}
                                </div>
                            </>
                        }

                        {((!type?.type?.includes("aluno") && appointment.data?.status === "PENDENTE_PERSONAL_APROVACAO") || (type?.type?.includes("aluno") && appointment.data?.status === "PENDENTE_CLIENTE_APROVACAO")) && (
                            <div className={classNames(styles.buttonGroup, { [styles.buttonGroupStudent]: type?.type?.includes("personal") || type?.type?.includes("admin") || type?.type?.includes("aluno") })}>
                                <Button type="button" typeButton="accept" title="Aceitar" icon={<Check size={16} strokeWidth={2.5} />} classNameDiv={styles.buttonActions} classNameVariable={styles.btnCheckSchedule} onClick={() => handleModal(appointment.data?.id, "accept")} />
                                <Button type="button" typeButton="decline" title="Recusar" icon={<X size={16} strokeWidth={2.5} />} classNameDiv={styles.buttonActions} classNameVariable={styles.btnCheckSchedule} onClick={() => handleModal(appointment.data?.id, "decline")} />
                                <Button type="button" typeButton="other" title="Reagendar" icon={<CalendarClock size={16} strokeWidth={2} />} classNameDiv={styles.buttonActions} classNameVariable={styles.btnCheckSchedule} onClick={() => handleModal(appointment.data?.id, "reschedule")} />
                            </div>
                        )}

                        {(!type || type?.type === null || appointment.isLoading || !appointment.data) && (
                            <div className={classNames(styles.buttonGroup)}>
                                <Skeleton width={200} height={60} />
                                <Skeleton width={200} height={60} />
                            </div>
                        )}

                        {appointment.data?.status === "APROVADO" && (
                            <div className={classNames(styles.buttonGroup)}>
                                <Button type="button" typeButton="other" title="Reagendar" icon={<CalendarClock size={16} strokeWidth={2} />} classNameDiv={styles.buttonActions} classNameVariable={styles.btnCheckSchedule} onClick={() => handleModal(appointment.data?.id, "reschedule")} />
                                <Button type="button" typeButton="decline" title="Cancelar" icon={<Ban size={16} strokeWidth={2.5} />} classNameDiv={styles.buttonActions} classNameVariable={styles.btnCheckSchedule} onClick={() => handleModal(appointment.data?.id, "cancel")} />
                            </div>
                        )}

                        {type?.type?.includes("aluno") && appointment.data?.status === "PENDENTE_PERSONAL_APROVACAO" && (
                            <div className={classNames(styles.buttonGroup)}>
                                <Button type="button" typeButton="other" title="Reagendar" icon={<CalendarClock size={16} strokeWidth={2} />} classNameDiv={styles.buttonActions} classNameVariable={styles.btnCheckSchedule} onClick={() => handleModal(appointment.data?.id, "reschedule")} />
                                <Button type="button" typeButton="decline" title="Cancelar" icon={<Ban size={16} strokeWidth={2.5} />} classNameDiv={styles.buttonActions} classNameVariable={styles.btnCheckSchedule} onClick={() => handleModal(appointment.data?.id, "cancel")} />
                            </div>
                        )}
                    </div>
                </div>

                {(aiPanelOpen || isAiPanelClosing) && (
                    <>
                        <div className={classNames(styles.aiBackdrop, { [styles.aiBackdropExit]: isAiPanelClosing })} />
                        <div ref={aiPanelRef} className={classNames(styles.aiPanel, { [styles.aiPanelMobile]: isMobile, [styles.aiPanelExit]: isAiPanelClosing })}>
                        <div className={styles.aiPanelHeader}>
                            <div className={styles.aiPanelHeaderLeft}>
                                <div className={styles.aiIconBadge}>
                                    <Sparkles size={18} />
                                </div>
                                <div>
                                    <div className={styles.aiPanelTitle}>Dica do Treinador IA</div>
                                    <div className={styles.aiPanelSubtitle}>Análise personalizada</div>
                                </div>
                            </div>
                            <button className={styles.aiCloseBtn} onClick={closeAiPanel}>
                                <X size={18} />
                            </button>
                        </div>

                        <div className={styles.aiPanelBody}>
                            <div className={styles.aiAnalysisSection}>
                                <p className={styles.aiAnalysisLabel}>Análise do último treino:</p>
                                <div className={styles.aiQuote}>
                                    <em>"{lastNote}"</em>
                                </div>
                                {appointment.data?.analiseIa ? (
                                    <>
                                        <p className={styles.aiAnalysisText}>{appointment.data.analiseIa.intro}</p>
                                        <ul className={styles.aiTipsList}>
                                            {appointment.data.analiseIa.tips.map((tip: any, i: number) => (
                                                <li key={i} className={styles.aiTipItem}>
                                                    <span className={styles.aiTipDot} />
                                                    <span><strong>{tip.title}</strong> {tip.text}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                ) : (
                                    <p className={styles.aiAnalysisText}>A IA está analisando os dados do treino para gerar dicas personalizadas. Volte em breve!</p>
                                )}
                            </div>

                            {aiMessages.length > 0 && (
                                <div className={styles.aiChat}>
                                    {aiMessages.map((msg, i) => (
                                        <div key={i} className={classNames(styles.aiChatBubble, { [styles.aiChatBubbleUser]: msg.role === 'user', [styles.aiChatBubbleAi]: msg.role === 'ai' })}>
                                            {msg.text}
                                        </div>
                                    ))}
                                    {aiLoading && (
                                        <div className={classNames(styles.aiChatBubble, styles.aiChatBubbleAi, styles.aiLoading)}>
                                            <span /><span /><span />
                                        </div>
                                    )}
                                    <div ref={chatEndRef} />
                                </div>
                            )}
                        </div>
                    </div>
                    </>
                )}
            </div>

            {isMobile && !aiPanelOpen && (
                <button className={styles.aiFab} onClick={() => setAiPanelOpen(true)}>
                    <Sparkles size={22} color='#2e5580'/>
                </button>
            )}

            {openModal === "accept" && <TimerModal callSuccessModal={() => acceptAppointment(appointmentId)} isMobile={isMobile} closeThen={() => setOpenModal(null)} title="Aceitar Agendamento" content="Tem certeza que deseja aceitar o agendamento?" buttonTitle="Aceitar agendamento" />}
            {openModal === "conclude" && <TimerModal callSuccessModal={() => handleConcludeAppointment(appointmentId)} isMobile={isMobile} closeThen={() => setOpenModal(null)} title="Concluir Agendamento" content="Tem certeza que deseja concluir o agendamento?" buttonTitle="Concluir agendamento" />}
            {openModal === "decline" && <TimerModal callSuccessModal={() => declineAppointment(appointmentId)} isMobile={isMobile} closeThen={() => setOpenModal(null)} title="Recusar agendamento" content="Tem certeza que deseja Recusar o agendamento?" buttonTitle="Recusar agendamento" isDelete={true} />}
            {openModal === "cancel" && <TimerModal callSuccessModal={() => cancelAppointment(appointmentId)} isMobile={isMobile} closeThen={() => setOpenModal(null)} title="Cancelar agendamento" content="Tem certeza que deseja Cancelar o agendamento?" buttonTitle="Cancelar agendamento" isDelete={true} />}
            {openModal === "success" && <SuccessModal isMobile={isMobile} closeThen={() => setOpenModal(null)} title={successModalInfo?.title} content={successModalInfo?.content} />}
            {openModal === "error" && <ErrorModal closeThen={() => setOpenModal(null)} title={successModalInfo?.title} content={successModalInfo?.content} />}
            {openModal === "registerAbsence" && <RegisterAbsenceModal closeThen={() => setOpenModal(null)} onSubmit={registerAbsenceAppointment} />}
            {openModal === "reschedule" && (
                <NewEvent
                    isMobile={isMobile}
                    close={() => setOpenModal(null)}
                    openModalExtern={handleSuccessReschedule}
                    errorModal={() => handleErrorModal("Erro ao reagendar", "Não foi possível reagendar o horário")}
                    insertedEvents={appointments.data?.data}
                    title="Reagendar horário"
                    buttonTitle={!type?.type?.includes("personal") ? "Avançar" : "Reagendar"}
                    isReschedule={true}
                    rescheduleId={appointmentId}
                    clickedDate={appointment.data?.dataInicio?.split("T")[0] || ""}
                    typeUser={type?.type || []}
                    appoitmentData={appointment.data}
                    goToNextStep={!type?.type?.includes("personal")}
                />
            )}
        </>
    );
}
