import { useRef, useState, useContext } from "react";
import useModalClose from "../../../hooks/useModalClose";
import { TypeContext } from "../../../App";
import styles from "./PopupModal.module.css";
import useClickOutside from "../../../hooks/useClickOutside";
import SmallerButton from "../../SmallerButton/SmallerButton";
import classnames from "classnames";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { acceptUserAppointment, concludeAppointment, findPersonalRequests, refuseAppointment, reportAbsencePersonal } from "../../../constants/schedule";
import { parseISO, startOfDay, endOfDay, format, parse } from "date-fns";
import { AppointmentCard } from "../../AppointmentCard/AppointmentCard";
import { ptBR } from "date-fns/locale";
import useMobile from "../../../hooks/isMobile";
import { Calendar, X } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';
import useModal, { type modalTypes } from "../../../hooks/useModal";
import TimerModal from "../TimerModal/TimerModal";
import SuccessModal from "../SuccessModal/SuccessModal";
import ErrorModal from "../ErrorModal/ErrorModal";
import NewEvent from "../NewEvent/NewEvent";
import { usePagination } from "../../../hooks/usePagination";
import PaginatedList from "../../PaginatedList/PaginatedList";
import ConcludeAppointmentModal from "../ConcludeAppointmentModal/ConcludeAppointmentModal";
import RegisterAbsenceModal from "../RegisterAbsenceModal/RegisterAbsenceModal";
import type { AbsenceAppointment } from "../../../models/schedule";

type PopupModalTypes = modalTypes | "conclude" | "registerAbsence";
type PopupModalProps = {
    closeThen: () => void;
    date: string;
    onNewEvent?: () => void;
};

export default function PopupModal({ closeThen, date, onNewEvent }: Readonly<PopupModalProps>) {
    const isMobile = useMobile();
    const typeContext = useContext(TypeContext);
    const type = typeContext?.type;
    const popupRef = useRef<HTMLDivElement>(null);
    const closingAction = useRef<"close" | "newEvent">("close");

    const { isClosing, handleAnimatedClose } = useModalClose({
        onClose: () => {
            if (closingAction.current === "newEvent" && onNewEvent) {
                onNewEvent();
            } else {
                closeThen();
            }
        },
        duration: 200,
        lockScroll: false
    });


    const { page, goToPage, animClass } = usePagination(0);

    const schedules = useQuery({
        queryKey: ["schedules", date, page],
        queryFn: () => {
            const dateOnly = date.substring(0, 10);
            const formattedDate = parse(dateOnly, "yyyy-MM-dd", new Date());

            const dataInic = format(startOfDay(formattedDate), "yyyy-MM-dd'T'HH:mm:ss");
            const dataFim = format(endOfDay(formattedDate), "yyyy-MM-dd'T'HH:mm:ss");

            return findPersonalRequests(page, "3", dataInic, dataFim);
        },
    });

    const agendamentos = schedules.data?.data?.content || [];
    const pagination = schedules.data?.data?.page ?? null;

    const formattedDate = format(parseISO(date), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

    const queryClient = useQueryClient();

    async function handleInvalidateQueries() {
        await queryClient.invalidateQueries({ queryKey: ["appointmentDetails"] });
        await queryClient.invalidateQueries({ queryKey: ["personal-requests"] });
        await queryClient.invalidateQueries({ queryKey: ["userRescheduleAppointments"] });
        await queryClient.invalidateQueries({ queryKey: ["userRescheduleAppointmentsMobile"] });
        await queryClient.invalidateQueries({ queryKey: ["appointmentsAtCalendar"] });
    }

    const { textModal, setTextModal } = useModal(null, { title: "", content: "" });

    const [openModal, setOpenModal] = useState<PopupModalTypes>(null);

    const [appointmentId, setAppointmentId] = useState<number>(0);


    function handleModal(id: number, type: PopupModalTypes) {
        setAppointmentId(id);
        setOpenModal(type);
    }

    async function acceptAppointment(id: number) {
        await acceptUserAppointment(id).then(async () => {
            await handleInvalidateQueries();
            setTextModal({ title: "Agendamento Aceito", content: "O agendamento foi aceito com sucesso." });
            setOpenModal("success");
        }).catch((error) => {
            console.error("Erro ao concluir o agendamento:", error);
            setTextModal({ title: "Erro ao aceitar agendamento", content: "Ocorreu um erro ao aceitar o agendamento. " + error });
            setOpenModal("error");
        });
    }

    async function declineAppointment(id: number) {
        await refuseAppointment(id).then(async () => {
            await handleInvalidateQueries();
            setTextModal({ title: "Agendamento Recusado", content: "O agendamento foi recusado." });
            setOpenModal("success");
        }).catch((error) => {
            console.error("Erro ao recusar o agendamento:", error);
            setTextModal({ title: "Erro ao recusar agendamento", content: "Ocorreu um erro ao recusar o agendamento. " + error });
            setOpenModal("error");
        });
    }

    async function handleSuccessReschedule() {
        await handleInvalidateQueries();
        setTextModal({ title: "Agendamento Reagendado", content: "O agendamento foi reagendado com sucesso." });
        setOpenModal("success");
    }

    async function handleConcludeAppointment(id: number, data: { resumo: string; grupoMuscular: string[] }) {
        try {
            await concludeAppointment(id, data);
            await handleInvalidateQueries();
            setTextModal({ title: "Aula Concluída", content: "A aula foi concluída com sucesso." });
            setOpenModal("success");
        } catch (error) {
            console.error("Erro ao concluir a aula:", error);
            setTextModal({ title: "Erro ao concluir", content: "Ocorreu um erro ao concluir a aula." });
            setOpenModal("error");
        }
    }

    async function registerAbsenceAppointment(data: { type: string; description: string }) {
        const payload: AbsenceAppointment = {
            idAgendamento: appointmentId,
            tipoUsuario: data.type,
            descricaoCancelamento: data.description || ""
        };
        try {
            await reportAbsencePersonal(payload);
            await handleInvalidateQueries();
            setTextModal({ title: "Ausência Registrada", content: "A ausência foi registrada com sucesso." });
            setOpenModal("success");
        } catch (error) {
            console.error("Erro ao registrar a ausência:", error);
            setTextModal({ title: "Erro ao registrar", content: "Ocorreu um erro ao registrar a ausência." });
            setOpenModal("error");
        }
    }

    function handleErrorModalInfo(title: string, description: string) {
        setTextModal({ title, content: description });
        setOpenModal("error");
    }

    useClickOutside({
        ref: popupRef,
        callback: handleAnimatedClose,
        disabled: openModal !== null,
    });

    function handleClosePopup() {
        setOpenModal(null);
        handleAnimatedClose();
    }

    return (
        <>
            <div
                className={classnames("overlay", {
                    [styles.backdropEnter]: !isClosing,
                    [styles.closingBackdrop]: isClosing,
                })}
                onClick={handleAnimatedClose}
            />
            <div ref={popupRef} className={classnames(styles.popupModal, {
                [styles.popupEnter]: !isClosing,
                [styles.closing]: isClosing,
            })}>
                <div className={styles.popupIndicator} />
                <div className={styles.header}>
                    <div>
                        <h2>Agendamentos</h2>
                        <p>{capitalizedDate}</p>
                    </div>
                    <button className={styles.closeButton} onClick={handleAnimatedClose}>
                        <X className={styles.closeIcon} size={24} />
                    </button>
                </div>
                {schedules.isLoading ? (
                    <div className={styles.cardList}>
                        {Array.from({ length: 3 }).map((_, i) => (
                            <Skeleton key={i} height={120} borderRadius={12} style={{ marginBottom: 12 }} />
                        ))}
                    </div>
                ) : agendamentos.length > 0 && (
                    <PaginatedList
                        key={page}
                        page={page}
                        animClass={animClass}
                        pagination={pagination}
                        onPageChange={goToPage}
                        listClassName={styles.cardList}
                    >
                        {agendamentos.map((agendamento: any) => (
                            <AppointmentCard
                                key={agendamento.agendamentoId}
                                agendamentoId={agendamento.agendamentoId}
                                status={agendamento.status}
                                name={agendamento.nome}
                                photoUrl={agendamento.foto}
                                onConfirm={() => handleModal(agendamento.agendamentoId, "accept")}
                                onCancel={() => handleModal(agendamento.agendamentoId, "decline")}
                                onReschedule={() => handleModal(agendamento.agendamentoId, "reschedule")}
                                onConclude={() => handleModal(agendamento.agendamentoId, "conclude")}
                                onRegisterAbsence={() => handleModal(agendamento.agendamentoId, "registerAbsence")}
                                type={agendamento.tipoAula}
                                date={agendamento.dataInicio ? format(parse(agendamento.dataInicio.split("T")[0], "yyyy-MM-dd", new Date()), "dd/MM/yyyy", { locale: ptBR }) : ""}
                                time={`${agendamento.dataInicio ? agendamento.dataInicio.split("T")[1]?.substring(0, 5) || "" : ""} - ${agendamento.dataFim ? agendamento.dataFim.split("T")[1]?.substring(0, 5) || "" : ""}`}
                                address={agendamento.endereco ? agendamento.endereco.cep.bairro + ", " + agendamento.endereco.cep.localidade : ""}
                                isMobile={isMobile}
                            />
                        ))}
                    </PaginatedList>
                )}

                {type?.includes("aluno") && (
                    <SmallerButton classname="h-12" type="button" title="Novo agendamento" handleButtonClick={() => {
                        closingAction.current = "newEvent";
                        handleAnimatedClose();
                    }} icon={<Calendar size={24} />} />
                )}
            </div>

            {openModal === "accept" && <TimerModal callSuccessModal={() => acceptAppointment(appointmentId)} isMobile={isMobile} closeThen={() => setOpenModal(null)} title="Aceitar Agendamento" content="Tem certeza que deseja aceitar o agendamento?" buttonTitle="Aceitar agendamento" />}
            {openModal === "decline" && <TimerModal isDelete={true} callSuccessModal={() => declineAppointment(appointmentId)} isMobile={isMobile} closeThen={() => setOpenModal(null)} title="Recusar Agendamento" content="Tem certeza que deseja recusar o agendamento?" buttonTitle="Recusar agendamento" />}
            {
                openModal === "reschedule" && (
                    <>
                        <NewEvent
                            isMobile={isMobile}
                            close={handleClosePopup}
                            openModalExtern={handleSuccessReschedule}
                            errorModal={handleErrorModalInfo}
                            insertedEvents={agendamentos}
                            title="Reagendar horário"
                            buttonTitle={!type?.includes("personal") ? "Avançar" : "Reagendar"}
                            isReschedule={true}
                            rescheduleId={appointmentId}
                            appoitmentData={(() => {
                                const a = agendamentos.find((event: any) => event.agendamentoId === appointmentId);
                                if (!a) return null;
                                return {
                                    ...a,
                                    aluno: {
                                        nome: a.nome,
                                        idade: a.idade,
                                        avatarUrl: a.foto
                                    }
                                };
                            })()}
                            typeUser={type || []}
                            clickedDate={date}
                            goToNextStep={!type?.includes("personal")}
                        />
                    </>
                )
            }
            {openModal === "conclude" && (
                <ConcludeAppointmentModal
                    isMobile={isMobile}
                    closeThen={() => setOpenModal(null)}
                    onSubmit={(data) => handleConcludeAppointment(appointmentId, data)}
                />
            )}
            {openModal === "registerAbsence" && (
                <RegisterAbsenceModal
                    closeThen={() => setOpenModal(null)}
                    onSubmit={registerAbsenceAppointment}
                />
            )}
            {openModal === "success" && <SuccessModal title={textModal.title} content={textModal.content} closeThen={handleClosePopup} isMobile={isMobile} />}
            {openModal === "error" && <ErrorModal title={textModal.title} content={textModal.content} closeThen={handleClosePopup} />}
        </>
    );
}