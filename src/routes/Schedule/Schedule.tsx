import { useContext, useEffect, useState } from "react";
import styles from "./Schedule.module.css"
import UserScheduleCard from "../../components/UserScheduleCard/UserScheduleCard";
import ViewCalendarMonthStyled from "../../components/Calendars/ViewCalendarMonthStyled/ViewCalendarMonthStyled";
import NewEvent from "../../components/Modal/NewEvent/NewEvent";
import SuccessModal from "../../components/Modal/SuccessModal/SuccessModal";
import TimerModal from "../../components/Modal/TimerModal/TimerModal";
import SmallerButton from "../../components/SmallerButton/SmallerButton";
import CalendarWeek from "../../components/Calendars/CalendarWeek/CalendarWeek";
import { TypeContext } from "../../App";
import classnames from "classnames";
import useMobile from "../../hooks/isMobile";
import { useSearchParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { acceptUserAppointment, appointmentAtCalendar, findPersonalRequests, findUserAppointments, getPersonalList, refuseAppointment } from "../../constants/schedule";
import { useDisabledDays } from "../../hooks/useDisabledDays";
import { format, parse, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import ErrorModal from "../../components/Modal/ErrorModal/ErrorModal";
import { actualPlan } from "../../constants/products";
import { getTotalByClassType } from "../../constants/overview";
import { useInfinitePagination } from "../../hooks/useInfinitePagination";
import { getAvailabilityHoursTomorrow } from "../../constants/personal";
import PopupModal from "../../components/Modal/PopupModal/PopupModal";

type ModalType = "cancel" | "accept" | "reschedule" | "success" | "newEvent" | "error" | "rescheduleRequest" | "popup" | null;

export type RescheduleAppointment = {
    agendamentoId: number;
    status: string;
    dataInicio: string;
    dataFim: string;
    nome: string;
    foto: string;
    endereco: {
        cep: {
            bairro: string
            id: string
            localidade: string
            logradouro: string
            uf: string
        };
        numero: string
    }
};

export default function Schedule() {
    const isMobile = useMobile();

    const type = useContext(TypeContext);

    const [openModal, setOpenModal] = useState<ModalType>(null);

    const [clickedDate, setClickedDate] = useState<string>("");

    const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

    const [modalInfo, setModalInfo] = useState({ title: "", description: "" });

    const queryClient = useQueryClient();

    const isTypeReady = type !== null && type.type !== null;

    function handleSuccessModalInfo(title: string, description: string) {
        setModalInfo({ title, description });
        setOpenModal("success");
    }

    function handleErrorModalInfo(title: string, description: string) {
        console.log("Erro ao agendar/reagendar");
        setModalInfo({ title, description });
        setOpenModal("error");
    }

    const actualPlanQuery = useQuery({
        queryKey: ["total", "actualPlan"],
        queryFn: () => actualPlan(),
        refetchOnWindowFocus: false,
        enabled: isTypeReady && type?.type === "aluno"
    });

    const classBalanceQuery = useQuery({
        queryKey: ["totalByClassType"],
        queryFn: () => getTotalByClassType(),
        refetchOnWindowFocus: false,
        enabled: type?.type === "aluno"
    });



    function handleOpenNewEventModal() {
        if (!actualPlanQuery?.data?.data.nome) {
            handleErrorModalInfo("Plano necessário", "Você precisa ter um plano ativo para agendar um horário.");
            return
        }

        if ((classBalanceQuery?.data?.saldoPresencial === 0 && classBalanceQuery?.data?.saldoResidencial === 0 && classBalanceQuery?.data?.saldoFuncional === 0)) {
            handleErrorModalInfo("Aulas indisponíveis", "Você não possui aulas disponíveis para agendamento. Por favor, adquira um plano ou entre em contato com o personal.");
            return
        }

        setOpenModal("newEvent");

    }


    async function declineAppointment(id: number) {
        await refuseAppointment(id).then(async () => {
            handleSuccessModalInfo("Agendamento cancelado", "O agendamento foi cancelado com sucesso.");
            queryClient.invalidateQueries({ queryKey: ["userAppointments"] });
            queryClient.invalidateQueries({ queryKey: ['userRescheduleAppointments'] });
        }).catch((error) => {
            console.error("Erro ao cancelar o agendamento:", error);
            handleErrorModalInfo("Erro ao cancelar o agendamento", error.response?.data?.Exception || "Ocorreu um erro ao cancelar o agendamento.");
        });
    }

    useEffect(() => {
        if (isMobile) window.scrollTo(0, 0);
    }, [openModal]);

    const [searchParams] = useSearchParams();

    useEffect(() => {
        setClickedDate("");
        if (searchParams.get("date")) {
            setClickedDate(searchParams.get("date") || "");
            setOpenModal("newEvent");
        }
    }, [searchParams]);


    const appointments = useQuery({
        queryKey: ["appointmentsAtCalendar"],
        queryFn: () => appointmentAtCalendar(),
        refetchOnWindowFocus: false,
        enabled: isTypeReady
    })

    const userAppointments = useQuery({
        queryKey: ["userAppointments"],
        queryFn: () => findUserAppointments(),
        refetchOnWindowFocus: false,
        enabled: isTypeReady,
        select: (res) => {
            console.log("Fetched user appointments:", res.data);
            return [...res.data].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
        }
    })

    const {
        data: userRescheduleAppointments,
        loadMoreRef,
    } = useInfinitePagination<RescheduleAppointment>({
        queryKey: ["userRescheduleAppointments"],
        queryFn: (page) => findPersonalRequests(page).then(res => res.data),
    });

    const appointmentsUser: RescheduleAppointment[] =
        type?.type === "aluno"
            ? userRescheduleAppointments.filter(
                appointment => appointment.status === "PENDENTE_CLIENTE_APROVACAO"
            )
            : userRescheduleAppointments;

    console.log("appointmentsUser", appointmentsUser);

    //todo:
    // const rescheduleRequests = useQuery({
    //     queryKey: ["rescheduleRequests"],
    //     queryFn: () => getAppointmentByStatus({ data: { status: "PENDENTE_CLIENTE_APROVACAO", data: "2025-11-27" } }),
    //     select: (res) => res.data.content,
    //     retry: false,
    //     enabled: type?.type === "aluno"
    // })

    function handleOpenRescheduleRequestModal(id: number, isRescheduleFromPersonal?: boolean) {
        let eventToReschedule = userAppointments.data?.find((event) => event.agendamentoId === id);

        if (isRescheduleFromPersonal) {
            eventToReschedule = appointmentsUser?.find((event) => event.agendamentoId === id);
        }

        setClickedDate(eventToReschedule.data);

        setOpenModal("reschedule");
        return

    }

    async function acceptAppointment(id: number) {
        await acceptUserAppointment(id).then(async (res) => {
            console.log("Agendamento aceito:", res);
            handleSuccessModalInfo("Agendamento Aceito", "O agendamento foi aceito com sucesso.");
            await queryClient.invalidateQueries({ queryKey: ['appointmentDetails'] });
            await queryClient.invalidateQueries({ queryKey: ['userRescheduleAppointments'] });
            await queryClient.invalidateQueries({ queryKey: ['appointmentsAtCalendar'] });
            await queryClient.invalidateQueries({ queryKey: ['userAppointments'] });
        }).catch((error) => {
            console.error("Erro ao concluir o agendamento:", error);
            handleErrorModalInfo("Erro ao recusar o agendamento", error.response?.data?.Exception || "Ocorreu um erro ao recusar o agendamento.");
        });
    }

    const personalList = useQuery({
        queryKey: ["personalList"],
        queryFn: getPersonalList,
        select: (res) => res.data,
        refetchOnWindowFocus: false,
    });

    const availabilityHoursTomorrowQuery = useQuery({
        queryKey: ["availabilityHoursTomorrow"],
        queryFn: () => getAvailabilityHoursTomorrow(personalList.data[0].id),
        refetchOnWindowFocus: false,
        enabled: type?.type === "aluno"
    })

    console.log("availabilityHoursTomorrowQuery", availabilityHoursTomorrowQuery)

    console.log(clickedDate)

    const targetId = personalList.data?.content?.[0]?.id;
    const { disabledDays } = useDisabledDays(type?.type === "aluno" ? targetId : undefined);


    return (
        <>
            {!isTypeReady ? (
                <div className={styles.loadingContainer}>
                    <div className={styles.spinner}></div>
                </div>
            ) : type.type === "personal" ? (
                <CalendarWeek
                    insertedEvents={appointmentsUser || []}
                    openModal={() => setOpenModal("newEvent")}
                    isMobile={isMobile}
                    isLoading={appointments.isLoading}
                />
            ) : (
                <div className={classnames(styles.userViewSchedule, { [styles.mobile]: isMobile })}>

                    <div className={classnames(styles.viewSchedule, { [styles.mobile]: isMobile })}>
                        <div className={classnames(styles.schedulePageCalendar, { [styles.mobile]: isMobile })}>
                            <ViewCalendarMonthStyled
                                isMobile={isMobile}
                                events={appointments.data?.data}
                                isUserAuthorizedToInteract={actualPlanQuery?.data?.data ? true : false}
                                canMakeAppointment={classBalanceQuery?.data?.saldoPresencial > 0 || classBalanceQuery?.data?.saldoResidencial > 0 || classBalanceQuery?.data?.saldoFuncional > 0}
                                modalInfo={setModalInfo}
                                modalType={setOpenModal}
                                availabilityHoursTomorrow={availabilityHoursTomorrowQuery?.data?.data}
                                clickDate={(date) => {
                                    setClickedDate(date);
                                }}
                                disabledDays={disabledDays}
                            />
                        </div>
                        <div className={classnames(styles.schedulePageUserActions, { [styles.mobile]: isMobile })}>
                            <div className={styles.adjustButtonWSchedule}>
                                <SmallerButton
                                    type="button"
                                    icon={isMobile ? undefined : (<svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M5 12h14" />
                                        <path d="M12 5v14" />
                                    </svg>)}
                                    title={`Agendar`}
                                    classname={styles.btnAgendar}
                                    handleButtonClick={() => handleOpenNewEventModal()} />
                            </div>

                            {appointmentsUser.map(event => {
                                return (
                                    <>
                                        <div onClick={() => setSelectedEventId(event.agendamentoId)} key={event.agendamentoId}>
                                            <UserScheduleCard
                                                data={event}
                                                isReschedule={true}
                                                additionalInfo={{ foto: event?.foto, nome: event?.nome }}
                                                date={format(parseISO(event.dataInicio), "d 'de' MMMM", { locale: ptBR })}
                                                initialHour={format(parseISO(event.dataInicio), "HH'h'mm")}
                                                finalHour={format(parseISO(event.dataFim), "HH'h'mm")}
                                                handleCancel={() => setOpenModal("cancel")}
                                                handleAcceptReschedule={() => setOpenModal("accept")}
                                                handleReschedule={() => handleOpenRescheduleRequestModal(event.agendamentoId, true)}
                                                isMobile={isMobile}
                                            />
                                        </div>
                                        <div ref={loadMoreRef} />
                                    </>
                                );
                            })}

                            {userAppointments.data?.map((event, index) => (
                                <div onClick={() => setSelectedEventId(event.agendamentoId)} key={`${event.title}-${index}`}>
                                    <UserScheduleCard
                                        data={event}
                                        date={event?.data ? `${parse(event.data, "yyyy-MM-dd'T'HH:mm:ss", new Date()).getDate()} de ${format(parseISO(event?.data), "MMMM", { locale: ptBR })}` : ""}
                                        initialHour={event?.data ? event?.data.replace(":", "h").split("T")[1].slice(0, 5) : ""}
                                        finalHour={event?.datafim ? event?.datafim.replace(":", "h").split("T")[1].slice(0, 5) : ""}
                                        handleCancel={() => setOpenModal("cancel")}
                                        handleReschedule={() => handleOpenRescheduleRequestModal(event?.agendamentoId)}
                                        isMobile={isMobile}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {
                openModal === "popup" && (
                    <PopupModal
                        closeThen={() => setOpenModal(null)}
                        date={clickedDate}
                        onNewEvent={() => setOpenModal("newEvent")}
                    />
                )
            }

            {openModal === "accept" && <TimerModal callSuccessModal={() => acceptAppointment(selectedEventId!)} isMobile={isMobile} closeThen={() => setOpenModal(null)} title="Aceitar Agendamento" content="Tem certeza que deseja aceitar o agendamento?" buttonTitle="Aceitar agendamento" />}


            {openModal === "newEvent" && (
                <>
                    <NewEvent
                        isMobile={isMobile}
                        close={() => setOpenModal(null)}
                        openModalExtern={() => handleSuccessModalInfo("Agendado com sucesso", "Horário agendado com sucesso")}
                        errorModal={(title, description) => handleErrorModalInfo(title, description)}
                        insertedEvents={appointments.data?.data}
                        title="Agendar horário"
                        buttonTitle="Avançar"
                        clickedDate={clickedDate}
                    />
                </>
            )}

            {openModal === "reschedule" && (
                <>
                    <NewEvent
                        isMobile={isMobile}
                        close={() => setOpenModal(null)}
                        openModalExtern={() => handleSuccessModalInfo("Reagendado com sucesso", "Horário reagendado com sucesso")}
                        errorModal={() => handleErrorModalInfo("Erro ao reagendar", "Não foi possível reagendar o horário")}
                        insertedEvents={appointments.data?.data}
                        title="Reagendar horário"
                        buttonTitle="Reagendar"
                        isReschedule={true}
                        rescheduleId={selectedEventId}
                        clickedDate={clickedDate}
                    />
                </>
            )}

            {openModal === "success" && (
                <SuccessModal
                    isMobile={isMobile}
                    closeThen={() => setOpenModal(null)}
                    title={modalInfo.title}
                    content={modalInfo.description}
                />
            )}

            {openModal === "error" && (
                <ErrorModal
                    closeThen={() => setOpenModal(null)}
                    title={modalInfo.title}
                    content={modalInfo.description}
                />
            )}




            {openModal === "cancel" && (
                <TimerModal
                    isMobile={isMobile}
                    closeThen={() => setOpenModal(null)}
                    title="Cancelar"
                    content={`Você tem certeza que quer cancelar o agendamento?\n
                        Agendamento:
                        Tipo: Personal
                        Personal: Fabio
                        Local: Casa
                        Endereço: Rua Alberto Almeida n° 23
                    `}
                    id={selectedEventId}
                    buttonTitle="Cancelar agendamento"
                    callSuccessModal={() => declineAppointment(selectedEventId!)}
                    isDelete={true}

                    classNameText="!text-left"
                />
            )}
        </>

    );
}
