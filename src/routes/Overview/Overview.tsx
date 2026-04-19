import { useContext, useEffect, useState } from "react";
import { useDisabledDays } from "../../hooks/useDisabledDays";
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
import { appointmentAtCalendar, findUserAppointments, getPersonalList } from "../../constants/schedule";
import { appoitmentsCount, getAvailabilityHoursTomorrow } from "../../constants/personal";
import { format, parse, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Users, HomeIcon, HeartPulseIcon, CalendarIcon, CalendarCheck, ClipboardClock } from 'lucide-react';
import { LinearProgress } from "@mui/material";
import Button from "../../components/Button/Button";
import SuccessModal from "../../components/Modal/SuccessModal/SuccessModal";
import ErrorModal from "../../components/Modal/ErrorModal/ErrorModal";
import PopupModal from "../../components/Modal/PopupModal/PopupModal";
import { OverviewCardPersonal } from "../../components/Overview/OverviewCardPersonal/OverviewCardPersonal";
import OverviewCardPackageStatus from "../../components/Overview/OverviewCardPackageStatus/OverviewCardPackageStatus";
import Skeleton from "react-loading-skeleton";
import type { appointmentsCards } from "../../models/overview";
import CardWithoutPlan from "../../components/Overview/CardWithoutPlan/CardWithoutPlan";
import AppointmentsEmptyState from "../../components/Overview/AppointmentsEmptyState/AppointmentsEmptyState";
import { findUserData } from "../../constants/user";
import NewEvent from "../../components/Modal/NewEvent/NewEvent";

type ModalType = "success" | "error" | "newEvent" | "cancel" | "accept" | "reschedule" | "rescheduleRequest" | "popup";

const TOTAL_PADRAO = 20;

type BalanceItemProps = { label: string; current: number; total: number; icon?: React.ReactNode };

function BalanceItem({ label, current, total, icon }: Readonly<BalanceItemProps>) {
    const percentage = Math.min(100, Math.max(0, (current / total) * 100));
    return (
        <div className="mb-4">
            <div className="flex justify-between mb-1.5 text-base">
                <span className="font-semibold text-slate-700 flex gap-2">{icon}{label}</span>
                <span className="font-bold text-slate-800">
                    <span className="text-xl">{current}</span> / <span className="text-sm text-slate-500 font-medium">{total}</span>
                </span>
            </div>
            <LinearProgress
                variant="determinate"
                value={percentage}
                sx={{ height: 8, borderRadius: 8, "& .MuiLinearProgress-bar": { backgroundColor: "#093a5d" } }}
            />
        </div>
    );
}

type ClassBalance = { saldoPresencial: number; saldoFuncional: number; saldoResidencial: number };

function ClassBalancePanel({ data }: Readonly<{ data: ClassBalance | undefined }>) {
    return (
        <div>
            <BalanceItem label="Presencial" current={data?.saldoPresencial ?? 0} total={TOTAL_PADRAO} icon={<Users />} />
            <BalanceItem label="Funcional" current={data?.saldoFuncional ?? 0} total={TOTAL_PADRAO} icon={<HeartPulseIcon />} />
            <BalanceItem label="Residencial" current={data?.saldoResidencial ?? 0} total={TOTAL_PADRAO} icon={<HomeIcon />} />
        </div>
    );
}

async function loadAppointmentCounts(
    setToday: (v: number) => void,
    setPending: (v: number) => void,
    todayDate: string,
) {
    try {
        const res = await appoitmentsCount({ status: "APROVADO", data: todayDate });
        setToday(res.data);
    } catch (error) {
        console.error("Error fetching personal appointments today count:", error);
    }
    try {
        const res = await appoitmentsCount({ status: "PENDENTE_PERSONAL_APROVACAO" });
        setPending(res.data);
    } catch (error) {
        console.error("Error fetching personal appointments pending count:", error);
    }
}

type MobileAlunoPanelProps = {
    isPending: boolean;
    hasPlan: boolean;
    classBalanceData: ClassBalance | undefined;
    actualPlan: { nome: string; dataExpiracao: string } | null;
    isMobile: boolean;
    onSchedule: () => void;
    panelStyle: string;
};

function MobileAlunoPanel({ isPending, hasPlan, classBalanceData, actualPlan, isMobile, onSchedule, panelStyle }: Readonly<MobileAlunoPanelProps>) {
    if (!isPending && hasPlan) {
        return (
            <div className={panelStyle}>
                <OverviewCard
                    title={"Agendamentos Restantes"}
                    subtitle={<ClassBalancePanel data={classBalanceData} />}
                    type={"usuario"}
                    titletbn={"Agendamentos"}
                    onClick={onSchedule}
                    isMobile={isMobile}
                />
                <OverviewCardPackageStatus actualPlan={actualPlan} />
            </div>
        );
    }
    return <CardWithoutPlan />;
}

type AppointmentsSectionProps = {
    isLoading: boolean;
    isEmpty: boolean | undefined;
    userType: string | null | undefined;
    isMobile: boolean;
    data: appointmentsCards | undefined;
    onNewEvent: () => void;
    onPackages: () => void;
    hasActivePlan: boolean;
    onNavigatePackages: () => void;
};

function AppointmentsSectionContent({
    isLoading,
    isEmpty,
    userType,
    isMobile,
    data,
    onNewEvent,
    hasActivePlan,
    onNavigatePackages,
}: Readonly<AppointmentsSectionProps>) {
    if (isLoading) {
        return (
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
        );
    }
    if (isEmpty) {
        return (
            <AppointmentsEmptyState
                userType={userType}
                hasActivePlan={hasActivePlan}
                isMobile={isMobile}
                onSchedule={onNewEvent}
                onPackages={onNavigatePackages}
            />
        );
    }
    return (
        <>
            <div className="flex items-center justify-between w-full mb-4 flex-wrap gap-2 ">
                <h1>Agendamentos</h1>
                {userType === "aluno" && <Button type="button" title="Novo agendamento" icon={<CalendarIcon />} classNameDiv="" classNameVariable="flex items-center  gap-2 h-10 "
                    onClick={onNewEvent}
                />}
            </div>
            <div className={classNames(styles.appointmentCardsRow, { [styles.appointmentCardsRowMobile]: isMobile })}>
                {data?.map((card, index) => (
                    <AppointmentCard
                        key={index}
                        agendamentoId={card.agendamentoId}
                        status={card.agendamentoStatus}
                        name={userType !== "aluno" ? card.alunoNome : card.personalNome}
                        photoUrl={card.caminhoFoto}
                        type={card.tipoAula}
                        date={card.data ? format(parse(card.data.split("T")[0], "yyyy-MM-dd", new Date()), "dd/MM/yyyy", { locale: ptBR }) : ""}
                        time={`${card.data ? card.data.split("T")[1]?.substring(0, 5) || "" : ""} - ${card.datafim ? card.datafim.split("T")[1]?.substring(0, 5) || "" : ""}`}
                        address={card.endereco ? card.endereco.bairro + ", " + card.endereco.cidade : ""}
                        isMobile={isMobile}
                    />
                ))}
            </div>
        </>
    );
}

export function Overview() {
    const isMobile = useMobile();

    const nav = useNavigate();

    const type = useContext(TypeContext);

    const actualPlanQuery = useQuery({
        queryKey: ["total", "actualPlan"],
        queryFn: () => actualPlan(),
        refetchOnWindowFocus: false,
        enabled: !type?.type?.includes("aluno")
    });

    const classBalanceQuery = useQuery({
        queryKey: ["totalByClassType"],
        queryFn: () => getTotalByClassType(),
        refetchOnWindowFocus: false,
        enabled: !type?.type?.includes("aluno")
    });

    console.log("Class balance data:", classBalanceQuery.data);

    function getBalance() {
        return <ClassBalancePanel data={classBalanceQuery.data} />;
    }

    const appointments = useQuery({
        queryKey: ["appointmentsAtCalendar"],
        queryFn: () => appointmentAtCalendar(),
        retry: false,
        refetchOnWindowFocus: false,
    })

    const personalList = useQuery({
        queryKey: ["personalList"],
        queryFn: getPersonalList,
        select: (res) => res.data,
        refetchOnWindowFocus: false,
        enabled: !type?.type?.includes("aluno")
    });

    const personalId = useQuery({
        queryKey: ["personalId"],
        queryFn: () => findUserData(),
        select: (res) => res.data,
        refetchOnWindowFocus: false,
        enabled: !type?.type?.includes("aluno")
    });

    const targetId = !type?.type?.includes("aluno") && !personalId.isLoading && !personalList.isLoading ? personalId.data?.id : personalList.data?.content?.[0]?.id;

    const { disabledDays, isLoading: isLoadingDisabledDays } = useDisabledDays(targetId);

    console.log("targetId", targetId)
    console.log("disabledDays", disabledDays)

    const appointmentsCards = useQuery({
        queryKey: ["findUserAppointments"],
        queryFn: () => findUserAppointments(),
        retry: false,
        select: (res) => res.data as appointmentsCards,
        refetchOnWindowFocus: false,
    })


    const [countAppointmentsToday, setCountAppointmentsToday] = useState<number | null>(null);
    const [countAppointmentsPending, setCountAppointmentsPending] = useState<number | null>(null);

    useEffect(() => {
        if (type?.type?.includes("personal")) {

            const today = format(startOfDay(new Date()), "yyyy-MM-dd", { locale: ptBR });
            loadAppointmentCounts(setCountAppointmentsToday, setCountAppointmentsPending, today);
        };
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



    const getAvailabilityHoursTomorrowQuery = useQuery({
        queryKey: ["availabilityHoursTomorrow", targetId],
        queryFn: () => getAvailabilityHoursTomorrow(targetId),
        enabled: !!targetId,
        refetchOnWindowFocus: false,
    })

    const isTypeLoading = type?.type === undefined;

    const isLoadingCalendar =
        isTypeLoading ||
            appointments.isPending ||
            type?.type?.includes("aluno") ? personalList.isPending : personalId.isPending ||
        isLoadingDisabledDays



    const [clickedDate, setClickedDate] = useState<string>("");

    return (
        <>
            <div className={classNames(styles.userViewSchedule, { [styles.userViewScheduleMobile]: isMobile })}>
                <div className={classNames(styles.containerContent, { [styles.containerContentMobile]: isMobile })}>
                    <div className={classNames(styles.overviewLeftColumn, { [styles.overviewLeftColumnMobile]: isMobile })}>

                        {isMobile && type?.type?.includes("aluno") && (
                            <MobileAlunoPanel
                                isPending={!!actualPlanQuery?.isPending}
                                hasPlan={!!actualPlanQuery?.data?.data}
                                classBalanceData={classBalanceQuery.data}
                                actualPlan={actualPlanQuery?.data?.data ?? null}
                                isMobile={isMobile}
                                onSchedule={() => nav("/schedule")}
                                panelStyle={styles.schedulePageUserActionsMobile}
                            />
                        )}

                        {isMobile && !type?.type?.includes("aluno") && (
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
                                    isUserAuthorizedToInteract={!type?.type?.includes("aluno") && !!actualPlanQuery.data}
                                    canMakeAppointment={classBalanceQuery.data?.saldoPresencial > 0 || classBalanceQuery.data?.saldoResidencial > 0 || classBalanceQuery.data?.saldoFuncional > 0}
                                    modalInfo={setModalText}
                                    modalType={setModalType}
                                    availabilityHoursTomorrow={getAvailabilityHoursTomorrowQuery.data?.data}
                                    clickDate={setClickedDate}
                                    disabledDays={disabledDays}
                                />
                            )}
                        </div>
                        <div className={classNames(styles.appointmentsSection, { [styles.appointmentsSectionMobile]: isMobile })}>
                            <AppointmentsSectionContent
                                isLoading={appointmentsCards.isLoading}
                                isEmpty={appointmentsCards.data?.length === 0}
                                userType={type?.type}
                                isMobile={isMobile}
                                data={appointmentsCards.data}
                                onNewEvent={handleClickNewEvent}
                                hasActivePlan={!!actualPlanQuery?.data?.data}
                                onPackages={() => nav("/packages")}
                                onNavigatePackages={() => nav("/packages")}
                            />
                        </div>
                    </div>

                    {type?.type === null && (
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

                    {!isMobile && (type?.type?.includes("aluno")) && (
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
                                    actualPlan={actualPlanQuery?.data?.data}
                                />
                            </div>
                        ) : (
                            <div className={styles.schedulePageUserActions}>
                                <CardWithoutPlan />
                            </div>
                        )
                    )}

                    {!isMobile && type?.type && !type.type.includes("aluno") && (
                        <div className={classNames(styles.schedulePageUserActions, styles.schedulePageUserActionsPersonal)}>
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
                        disabledDays={disabledDays}
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

            {
                modalType === "popup" && (
                    <PopupModal
                        closeThen={() => setModalType(null)}
                        date={clickedDate || ""}
                        onNewEvent={handleClickNewEvent}
                    />
                )
            }

        </>
    );
}
