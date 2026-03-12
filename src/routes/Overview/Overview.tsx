import { useContext, useEffect, useState } from "react";
import styles from "./Overview.module.css";
import ViewCalendarMonthStyled from "../../components/Calendars/ViewCalendarMonthStyled/ViewCalendarMonthStyled";
import { OverviewCard } from "../../components/Overview/OverviewCard/OverviewCard";
import { AppointmentCard } from "../../components/AppointmentCard/AppointmentCard";
import { useNavigate } from "react-router-dom";
import { TypeContext } from "../../App";
import classNames from "classnames";
import useMobile from "../../hooks/isMobile";
import { actualPlan } from "../../constants/products";
import { getTotalByClassType } from "../../constants/overview";
import { useQuery } from "@tanstack/react-query";
import { appointmentAtCalendar, findUserAppointments } from "../../constants/schedule";
import { appoitmentsCount } from "../../constants/personal";
import { format, parse, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Users, HomeIcon, HeartPulseIcon, CalendarIcon, CalendarCheck, PlusIcon, ClipboardClock, CalendarX, Plus } from 'lucide-react';
import { LinearProgress } from "@mui/material";
import Button from "../../components/Button/Button";
import NewEvent from "../../components/NewEvent/NewEvent";
import SuccessModal from "../../components/Modal/SuccessModal/SuccessModal";
import ErrorModal from "../../components/Modal/ErrorModal/ErrorModal";
import { OverviewCardPersonal } from "../../components/Overview/OverviewCardPersonal/OverviewCardPersonal";
import SmallerButton from "../../components/SmallerButton/SmallerButton";
import OverviewCardPackageStatus from "../../components/Overview/OverviewCardPackageStatus/OverviewCardPackageStatus";
import Skeleton from "react-loading-skeleton";
import type { appointmentsCards } from "../../models/overview";
import CardWithoutPlan from "../../components/Overview/CardWithoutPlan/CardWithoutPlan";

type ModalType = "success" | "error" | "newEvent" | "cancel" | "accept" | "reschedule" | "rescheduleRequest";

export function Overview() {
    const isMobile = useMobile();

    const nav = useNavigate();

    const type = useContext(TypeContext);

    const actualPlanQuery = useQuery({
        queryKey: ["total", "actualPlan"],
        queryFn: () => actualPlan(),
        refetchOnWindowFocus: false,
        enabled: type?.type === "aluno"
    });

    const classBalanceQuery = useQuery({
        queryKey: ["totalByClassType"],
        queryFn: () => getTotalByClassType(),
        refetchOnWindowFocus: false,
        enabled: type?.type === "aluno"
    });

    console.log("Class balance data:", classBalanceQuery.data);

    function getBalance() {

        type BalanceItemProps = {
            label: string;
            current: number;
            total: number;
            icon?: React.ReactNode;
        };

        const BalanceItem = ({ label, current, total, icon }: BalanceItemProps) => {
            const percentage = Math.min(100, Math.max(0, (current / total) * 100));

            // const getColor = () => {
            //     if (percentage < 40) return "#ef4444"; // vermelho
            //     if (percentage < 70) return "#f59e0b"; // amarelo
            //     return "#093a5d"; // verde
            // };


            return (
                <div className="mb-4">
                    <div className="flex justify-between mb-1.5 text-base">
                        <span className="font-semibold text-slate-700 flex gap-2">
                            {icon}{label}
                        </span>
                        <span className="font-bold text-slate-800">
                            <span className="text-xl">{current}</span> / <span className="text-sm text-slate-500 font-medium">{total}</span>
                        </span>
                    </div>


                    <LinearProgress
                        variant="determinate"
                        value={percentage}
                        sx={{
                            height: 8,
                            borderRadius: 8,
                            "& .MuiLinearProgress-bar": {
                                backgroundColor: "#093a5d",
                            },
                        }}
                    />
                </div>
            );
        };

        const TOTAL_PADRAO = 20;

        return (
            <div>
                <BalanceItem
                    label="Presencial"
                    current={classBalanceQuery.data?.saldoPresencial ?? 0}
                    total={TOTAL_PADRAO}
                    icon={<Users />}
                />

                <BalanceItem
                    label="Funcional"
                    current={classBalanceQuery.data?.saldoFuncional ?? 0}
                    total={TOTAL_PADRAO}
                    icon={<HeartPulseIcon />}
                />

                <BalanceItem
                    label="Residencial"
                    current={classBalanceQuery.data?.saldoResidencial ?? 0}
                    total={TOTAL_PADRAO}
                    icon={<HomeIcon />}
                />
            </div>
        );
    }

    const appointments = useQuery({
        queryKey: ["appointmentsAtCalendar"],
        queryFn: () => appointmentAtCalendar(),
        retry: false,
        refetchOnWindowFocus: false,

    })

    const appointmentsCards = useQuery({
        queryKey: ["findUserAppointments"],
        queryFn: () => findUserAppointments(),
        retry: false,
        select: (res) => res.data as appointmentsCards,
        refetchOnWindowFocus: false,
    })


    const [countAppointmentsToday, setCountAppointmentsToday] = useState<number | null>(null);
    const [countAppointmentsPending, setCountAppointmentsPending] = useState<number | null>(null);

    function fetchAppointmentsCountToday() {
        if (type?.type !== "personal") return;

        const today = format(startOfDay(new Date()), "yyyy-MM-dd", { locale: ptBR });
        appoitmentsCount({ status: "APROVADO", data: today }).then((response) => {
            setCountAppointmentsToday(response.data);
        }).catch((error) => {
            console.error("Error fetching personal appointments today count:", error);
            return 0;
        });

        appoitmentsCount({ status: "PENDENTE_PERSONAL_APROVACAO" }).then((response) => {
            setCountAppointmentsPending(response.data);
        }).catch((error) => {
            console.error("Error fetching personal appointments today count:", error);
            return 0;
        });
    }

    useEffect(() => {
        fetchAppointmentsCountToday();
    }, [type]);

    const [modalText, setModalText] = useState<{ title: string; description: string }>({ title: "", description: "" });
    function handleErrorModalInfo(title: string, description: string) {
        setModalText({ title, description });
        openModal("error");
    }


    const [modalType, setModalType] = useState<ModalType | null>(null);
    function openModal(type: ModalType) {
        setModalType(type);
    }

    function handleSuccessModalInfo(title: string, description: string) {
        openModal("success");
        setModalText({ title, description });
    }

    function handleClickNewEvent() {
        if (!actualPlanQuery.data) {
            handleErrorModalInfo("Erro", "Você precisa ter um plano ativo para agendar uma aula.")
            return
        }

        if ((classBalanceQuery.data?.saldoPresencial === 0 && classBalanceQuery.data?.saldoResidencial === 0 && classBalanceQuery.data?.saldoFuncional === 0)) {
            handleErrorModalInfo("Erro", "Você não possui aulas disponíveis para agendamento. Por favor, adquira um plano ou entre em contato com o personal.")
            return
        }


        setModalType("newEvent")
    }


    const isTypeLoading = type?.type === undefined;

    const isLoadingCalendar =
        isTypeLoading ||
        appointments.isPending

    return (
        <>
            <div className={classNames(styles.userViewSchedule, { [styles.userViewScheduleMobile]: isMobile })}>
                <div className={classNames(styles.containerContent, { [styles.containerContentMobile]: isMobile })}>
                    <div className={classNames(styles.overviewLeftColumn, { [styles.overviewLeftColumnMobile]: isMobile })}>

                        {isMobile && type?.type === "aluno" && (
                            !actualPlanQuery?.isPending && actualPlanQuery?.data?.data ? (
                                <div className={styles.schedulePageUserActionsMobile}>

                                    <OverviewCard
                                        title={"Agendamentos Restantes"}
                                        subtitle={getBalance()}
                                        type={"usuario"}
                                        titletbn={"Agendamentos"}
                                        onClick={() => nav("/schedule")}
                                        isMobile={isMobile}
                                    />
                                    <OverviewCardPackageStatus actualPlan={actualPlanQuery?.data?.data.nome ?? "Não possui assinatura"} />

                                </div>
                            ) : (
                                <CardWithoutPlan />
                            )
                        )}

                        {isMobile && type?.type !== "aluno" && (
                            <div className={styles.schedulePageUserActionsMobile}>
                                <OverviewCardPersonal
                                    title={"Aulas para realizar hoje"}
                                    subtitle={countAppointmentsToday ?? 0}
                                    icon={<CalendarCheck color="#0a3557" />}
                                    iconColor=""
                                    titletbn={"Agendamentos"}
                                    onClick={() => nav("/schedule")}
                                    isMobile={isMobile}
                                />
                                <OverviewCardPersonal
                                    title={"Aulas pendentes para aprovação"}
                                    subtitle={countAppointmentsPending ?? 0}
                                    titletbn={"Solicitações"}
                                    icon={<ClipboardClock color="#0a3557" />}
                                    onClick={() => nav("/personal/check-schedule")}
                                    isMobile={isMobile}
                                />
                            </div>
                        )}

                        <div className={classNames(styles.schedulePageCalendar, { [styles.schedulePageCalendarMobile]: isMobile })}>
                            {isLoadingCalendar ? (
                                <div className="w-full bg-white rounded-xl p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <Skeleton height={28} />
                                        <div className="flex gap-2">
                                            <Skeleton height={36} circle={true} />
                                            <Skeleton height={36} circle={true} />
                                            <Skeleton height={36} borderRadius={6} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-7 gap-2 mb-3">
                                        {[...Array(7)].map((_, i) => (
                                            <Skeleton key={`day-${i}`} height={16} />
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-7 gap-2">
                                        {[...Array(35)].map((_, i) => (
                                            <div key={`cell-${i}`} className="w-full">
                                                <Skeleton height={70} borderRadius={8} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <ViewCalendarMonthStyled
                                    isMobile={isMobile}
                                    events={appointments.data?.data}
                                    isUserAuthorizedToInteract={type?.type === "aluno" && actualPlanQuery.data ? true : false}
                                    canMakeAppointment={classBalanceQuery.data?.saldoPresencial > 0 || classBalanceQuery.data?.saldoResidencial > 0 || classBalanceQuery.data?.saldoFuncional > 0}
                                    modalInfo={setModalText}
                                    modalType={setModalType}
                                />
                            )}
                        </div>
                        <div className={classNames(styles.appointmentsSection, { [styles.appointmentsSectionMobile]: isMobile })}>
                            {appointmentsCards.isLoading ? (
                                <div className="flex flex-col items-center justify-center gap-4">
                                    <div className="rounded-full bg-gray-200 p-5 w-fit">
                                        <Skeleton height={26} width={30} borderRadius={90} />
                                    </div>
                                    <Skeleton height={28} width={180} />

                                    <div className="space-y-4">
                                        {[...Array(3)].map((_, i) => (
                                            <div key={`card-skeleton-${i}`} className="w-full">
                                                <Skeleton height={20} width={500} borderRadius={8} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : appointmentsCards.data?.length === 0 ? (
                                <div className="flex flex-col items-center justify-center gap-4">
                                    <div className="rounded-full bg-gray-200 p-5 w-fit">
                                        <CalendarX className="" color="#0a3a5c" size={40} />
                                    </div>

                                    {type?.type === "aluno" && (
                                        actualPlanQuery?.data?.data ? (
                                            <>
                                                <h1 className="text-center">Sem agendamentos para hoje</h1>
                                                <div>
                                                    <h2 className="text-center text-gray-500">Você ainda não agendou nenhuma aula para este período.</h2>
                                                    <h2 className="text-center text-gray-500">Garanta seu horário agora mesmo!</h2>
                                                </div>
                                                {type?.type === "aluno" &&
                                                    <SmallerButton
                                                        type="button"
                                                        title="Agendar Agora"
                                                        icon={<PlusIcon />}
                                                        classname={`${isMobile ? "w-full" : "w-1/4!"} py-2.5 px-0 flex items-center gap-2 text-base rounded-lg bg-blue-600 text-white hover:bg-blue-700`}
                                                        handleButtonClick={handleClickNewEvent}
                                                    />}
                                            </>
                                        ) : (
                                            <>
                                                <h1 className="text-center">Nenhum pacote ativo</h1>
                                                <div>
                                                    <h2 className="text-center text-gray-500">Para agendar aulas, você precisa ter um plano ativo.</h2>
                                                    <h2 className="text-center text-gray-500">Confira nossos pacotes e escolha o melhor para você!</h2>
                                                </div>
                                                {type?.type === "aluno" &&
                                                    <SmallerButton
                                                        type="button"
                                                        title="Comprar Pacote Agora"
                                                        classname={`${isMobile ? "w-full" : "w-1/3!"} flex items-center gap-2 mt-2 text-lg font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700`}
                                                        icon={<Plus />}
                                                        handleButtonClick={() => nav("/packages")}
                                                    />}
                                            </>
                                        )
                                    )}

                                    {type?.type === "personal" && (
                                        <>
                                            <div>
                                                <h2 className="text-center text-gray-500">Você ainda não possui agendamentos pendentes.</h2>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center justify-between w-full mb-4 flex-wrap gap-2 ">
                                        <h1>Agendamentos</h1>
                                        {type?.type === "aluno" && <Button type="button" title="Novo agendamento" icon={<CalendarIcon />} classNameDiv="" classNameVariable="flex items-center  gap-2 h-10 "
                                            onClick={handleClickNewEvent}
                                        />}
                                    </div>
                                    <div className={classNames(styles.appointmentCardsRow, { [styles.appointmentCardsRowMobile]: isMobile })}>
                                        {appointmentsCards.data?.map((card, index) => (
                                            <AppointmentCard
                                                key={index}
                                                agendamentoId={card.agendamentoId}
                                                status={card.agendamentoStatus}
                                                name={type?.type === "personal" ? card.alunoNome : card.personalNome}
                                                photoUrl={card.caminhoFoto}
                                                type={card.tipoAula}
                                                date={format(parse(card.data.split("T")[0], "yyyy-MM-dd", new Date()), "dd/MM/yyyy", { locale: ptBR })}
                                                time={`${card.data.split("T")[1].substring(0, 5)} - ${card.dataFim.split("T")[1].substring(0, 5)}`}
                                                address={card.endereco.bairro + ", " + card.endereco.cidade}
                                                isMobile={isMobile}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {!type || type?.type === null && (
                        <div className={styles.schedulePageUserActions}>
                            <div className="bg-white rounded-xl shadow-xl p-6">
                                <Skeleton height={24} width={350} className="mb-4" />
                                <Skeleton height={20} width={450} className="mb-4" />
                                <Skeleton height={20} width={450} className="mb-4" />
                                <Skeleton height={20} width={450} className="mb-6" />
                                <Skeleton height={40} width={450} />
                            </div>
                            <div className="bg-white rounded-xl shadow-xl p-6">
                                <Skeleton height={24} width={350} className="mb-4" />
                                <Skeleton height={40} width={450} className="mb-4" />
                                <Skeleton height={40} width={450} className="mb-4" />
                                <Skeleton height={48} width={450} />
                            </div>
                        </div>
                    )}

                    {!isMobile && (!type || type?.type === "aluno") && (
                        isLoadingCalendar ? (
                            <div className={styles.schedulePageUserActions}>
                                <div className="bg-white rounded-xl shadow-xl p-6">
                                    <Skeleton height={24} width={350} className="mb-4" />
                                    <Skeleton height={20} width={450} className="mb-4" />
                                    <Skeleton height={20} width={450} className="mb-4" />
                                    <Skeleton height={20} width={450} className="mb-6" />
                                    <Skeleton height={40} width={450} />
                                </div>
                                <div className="bg-white rounded-xl shadow-xl p-6">
                                    <Skeleton height={24} width={350} className="mb-4" />
                                    <Skeleton height={40} width={450} className="mb-4" />
                                    <Skeleton height={40} width={450} className="mb-4" />
                                    <Skeleton height={48} width={450} />
                                </div>
                            </div>
                        ) : actualPlanQuery?.data?.data ? (
                            <div className={styles.schedulePageUserActions}>
                                <OverviewCard
                                    title={"Saldo de aulas"}
                                    subtitle={getBalance()}
                                    type={"usuario"}
                                    titletbn={"Ver Meus Agendamentos"}
                                    onClick={() => nav("/schedule")}
                                    isMobile={isMobile}
                                />
                                <OverviewCardPackageStatus
                                    actualPlan={actualPlanQuery?.data?.data ?? "Não possui assinatura"}
                                />
                            </div>
                        ) : (
                            <div className={styles.schedulePageUserActions}>
                                <CardWithoutPlan />
                            </div>
                        )
                    )}

                    {!isMobile && type?.type && type.type !== "aluno" && (
                        <div className={classNames(styles.schedulePageUserActions, { [styles.schedulePageUserActionsPersonal]: type?.type === "personal" })}>
                            <OverviewCardPersonal
                                title={"Aulas para realizar hoje"}
                                subtitle={countAppointmentsToday ?? <Skeleton />}
                                icon={<CalendarCheck color="#0a3557" />}
                                iconColor=""
                                titletbn={"Agendamentos"}
                                onClick={() => nav("/schedule")}
                                isMobile={isMobile}
                            />
                            <OverviewCardPersonal
                                title={"Aulas pendentes para aprovação"}
                                subtitle={countAppointmentsPending ?? <Skeleton />}
                                titletbn={"Solicitações"}
                                icon={<ClipboardClock color="#0a3557" />}
                                onClick={() => nav("/personal/check-schedule")}
                                isMobile={isMobile}
                            />
                        </div>
                    )}

                </div>
            </div >

            {modalType === "newEvent" && (
                <>
                    <NewEvent
                        isMobile={isMobile}
                        close={() => setModalType(null)}
                        openModalExtern={() => handleSuccessModalInfo("Agendado com sucesso", "Horário agendado com sucesso")}
                        errorModal={(title, description) => handleErrorModalInfo(title, description)}
                        insertedEvents={appointments.data?.data}
                        title="Agendar horário"
                        buttonTitle="Avançar"
                    />
                </>
            )
            }

            {
                modalType === "success" && (
                    // export default function SuccessModal({ isMobile, closeThen, title, content }: { isMobile: boolean; closeThen: React.Dispatch<React.SetStateAction<boolean>>; title?: string; content?: string }) {
                    <SuccessModal
                        isMobile={isMobile}
                        closeThen={() => setModalType(null)}
                        title={modalText.title}
                        content={modalText.description}
                    />
                )
            }

            {
                modalType === "error" && (
                    <ErrorModal
                        closeThen={() => setModalType(null)}
                        title={modalText.title}
                        content={modalText.description}
                    />
                )
            }
        </>
    );
}
