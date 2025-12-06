import { useContext, useEffect, useState } from "react";
import styles from "./Overview.module.css";
import ViewCalendarMonthStyled from "../../components/Calendars/ViewCalendarMonthStyled/ViewCalendarMonthStyled";
import { OverviewCard } from "../../components/OverviewCard/OverviewCard";
import { AppointmentCard } from "../../components/AppointmentCard/AppointmentCard";
import { useNavigate } from "react-router-dom";
import { TypeContext } from "../../App";
import classNames from "classnames";
import useMobile from "../../hooks/isMobile";
import { actualPlan } from "../../constants/products";
import { getTotalByClassType } from "../../constants/overview";
import { useQueries, useQuery } from "@tanstack/react-query";
import { appointmentAtCalendar, findUserAppointments } from "../../constants/schedule";
import { appoitmentsCount } from "../../constants/personal";
import { format, parse, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Users, HomeIcon, HeartPulseIcon, CalendarIcon } from 'lucide-react';
import { LinearProgress } from "@mui/material";
import Button from "../../components/Button/Button";
import NewEvent from "../../components/NewEvent/NewEvent";
import SuccessModal from "../../components/Modal/SuccessModal/SuccessModal";

export function Overview() {
    const isMobile = useMobile();

    const nav = useNavigate();

    const type = useContext(TypeContext);

    const actualPlanQuery = useQuery({
        queryKey: ["total", "actualPlan"],
        queryFn: () => actualPlan(),
        enabled: type?.type === "aluno"
    });

    const [aulaPresencial, aulaResidencial, aulaFuncional] = useQueries({
        queries: [
            {
                queryKey: ["totalPRESENCIAL"],
                queryFn: () => getTotalByClassType("PRESENCIAL"),
                enabled: type?.type === "aluno"
            },
            {
                queryKey: ["totalRESIDENCIAL"],
                queryFn: () => getTotalByClassType("RESIDENCIAL"),
                enabled: type?.type === "aluno"
            },
            {
                queryKey: ["totalFUNCIONAL"],
                queryFn: () => getTotalByClassType("FUNCIONAL"),
                enabled: type?.type === "aluno"
            }
        ]
    });


    function getBalance() {

        type BalanceItemProps = {
            label: string;
            current: number;
            total: number;
            icon?: React.ReactNode;
        };

        const BalanceItem = ({ label, current, total, icon }: BalanceItemProps) => {
            const percentage = Math.min(100, Math.max(0, (current / total) * 100));

            const getColor = () => {
                if (percentage < 40) return "#ef4444"; // vermelho
                if (percentage < 70) return "#f59e0b"; // amarelo
                return "#093a5d"; // verde
            };


            return (
                <div className="mb-4">
                    <div className="flex justify-between mb-1.5 text-base">
                        <span className="font-semibold text-slate-700 flex gap-2">
                            {icon}{label}
                        </span>
                        <span className="font-bold text-slate-800">
                            {current}
                            <span className="ml-1 font-normal text-slate-400">/ {total}</span>
                        </span>
                    </div>


                    <LinearProgress
                        variant="determinate"
                        value={percentage}
                        sx={{
                            height: 4,
                            borderRadius: 8,
                            "& .MuiLinearProgress-bar": {
                                backgroundColor: getColor(),
                            },
                        }}
                    />
                </div>
            );
        };

        const TOTAL_PADRAO = 20;

        return (
            <div className="py-2">
                <BalanceItem
                    label="Presencial"
                    current={aulaPresencial?.data ?? 0}
                    total={TOTAL_PADRAO}
                    icon={<Users />}
                />

                <BalanceItem
                    label="Funcional"
                    current={aulaFuncional?.data ?? 0}
                    total={TOTAL_PADRAO}
                    icon={<HeartPulseIcon />}
                />

                <BalanceItem
                    label="Residencial"
                    current={aulaResidencial?.data ?? 0}
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
    })

    const appointmentsCards = useQuery({
        queryKey: ["findUserAppointments"],
        queryFn: () => findUserAppointments(),
        retry: false,
        select: (res) => res.data,
    })

    useEffect(() => {
        console.log("User appointments:", appointmentsCards.data);
    }, [appointmentsCards.data]);

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

    const [clickedDate, setClickedDate] = useState<string>("");
    const [modalText, setModalText] = useState<{ title: string; description: string }>({ title: "", description: "" });
    function handleErrorModalInfo(title: string, description: string) {
        setModalText({ title, description });
    }

    type ModalType = "success" | "error" | "newEvent";

    const [modalType, setModalType] = useState<ModalType | null>(null);
    function openModal(type: ModalType) {
        setModalType(type);
    }

    function handleSuccessModalInfo(title: string, description: string) {
        openModal("success");
        setModalText({ title, description });
    }

    return (
        <>
            <div className={classNames(styles.userViewSchedule, { [styles.userViewScheduleMobile]: isMobile })}>
                <div className={classNames(styles.containerContent, { [styles.containerContentMobile]: isMobile })}>
                    <div className={classNames(styles.overviewLeftColumn, { [styles.overviewLeftColumnMobile]: isMobile })}>

                        {isMobile && type?.type === "aluno" && (
                            <div className={styles.schedulePageUserActionsMobile}>
                                <OverviewCard
                                    title={"Agendamentos Restantes"}
                                    subtitle={getBalance()}
                                    type={"usuario"}
                                    titletbn={"Agendamentos"}
                                    onClick={() => nav("/schedule")}
                                    isMobile={isMobile}
                                />
                                <OverviewCard
                                    title={"Status de planos"}
                                    subtitle={actualPlanQuery?.data?.data.nome ?? "Não possui assinatura"}
                                    type={"usuario"}
                                    titletbn={"Planos"}
                                    onClick={() => nav("/packages")}
                                    isMobile={isMobile}
                                />
                            </div>
                        )}

                        {isMobile && type?.type !== "aluno" && (
                            <div className={styles.schedulePageUserActionsMobile}>
                                <OverviewCard
                                    title={"Aulas para realizar hoje"}
                                    subtitle={countAppointmentsToday ?? 0}
                                    titletbn={"Agendamentos"}
                                    onClick={() => nav("/schedule")}
                                    isMobile={isMobile}
                                />
                                <OverviewCard
                                    title={"pendencia de aprovação"}
                                    subtitle={countAppointmentsPending ?? 0}
                                    titletbn={"Solicitações"}
                                    onClick={() => nav("/personal/check-schedule")}
                                    isMobile={isMobile}
                                />
                            </div>
                        )}

                        <div className={classNames(styles.schedulePageCalendar, { [styles.schedulePageCalendarMobile]: isMobile })}>
                            <ViewCalendarMonthStyled isMobile={isMobile} events={appointments.data?.data} />
                        </div>
                        <div className={classNames(styles.appointmentsSection, { [styles.appointmentsSectionMobile]: isMobile })}>
                            <div className="flex items-center justify-between w-full mb-4 flex-wrap gap-2 ">
                                <h1>Agendamentos</h1>
                                <Button type="button" title="Novo agendamento" icon={<CalendarIcon />} classNameDiv="" classNameVariable="flex items-center  gap-2 h-10 " onClick={() => openModal("newEvent")} />
                            </div>
                            {appointmentsCards.data?.length === 0 ? (
                                <p>Você não possui agendamentos.</p>
                            ) : (
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
                                            time={`${card.data.split("T")[1].substring(0, 5)} - ${card.datafim.split("T")[1].substring(0, 5)}`}
                                            address={card.endereco.bairro + ", " + card.endereco.cidade}
                                            isMobile={isMobile}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    {!isMobile && type?.type === "aluno" && (
                        <div className={styles.schedulePageUserActions}>
                            <OverviewCard
                                title={"Saldo de aulas restantes"}
                                subtitle={getBalance()}
                                type={"usuario"}
                                titletbn={"Agendamentos"}
                                onClick={() => nav("/schedule")}
                                isMobile={isMobile}
                            />
                            <OverviewCard
                                title={"Status de planos"}
                                subtitle={actualPlanQuery?.data?.data.nome ?? "Não possui assinatura"}
                                type={"usuario"}
                                titletbn={"Planos"}
                                onClick={() => nav("/packages")}
                                isMobile={isMobile}
                            />
                        </div>
                    )}

                    {!isMobile && type?.type !== "aluno" && (
                        <div className={classNames(styles.schedulePageUserActions, { [styles.schedulePageUserActionsPersonal]: type?.type === "personal" })}>
                            <OverviewCard
                                title={"Aulas para realizar hoje"}
                                subtitle={countAppointmentsToday ?? 0}
                                titletbn={"Agendamentos"}
                                onClick={() => nav("/schedule")}
                                isMobile={isMobile}
                            />
                            <OverviewCard
                                title={"Aulas pendentes de aprovação"}
                                subtitle={countAppointmentsPending ?? 0}
                                titletbn={"Solicitações"}
                                onClick={() => nav("/personal/check-schedule")}
                                isMobile={isMobile}
                            />
                        </div>
                    )}

                </div>
            </div>

            {modalType === "newEvent" && (
                <>
                    <NewEvent
                        isMobile={isMobile}
                        close={() => setModalType(null)}
                        openModal={() => handleSuccessModalInfo("Agendado com sucesso", "Horário agendado com sucesso")}
                        errorModal={(title, description) => handleErrorModalInfo(title, description)}
                        insertedEvents={appointments.data?.data}
                        title="Agendar horário"
                        buttonTitle="Avançar"
                        clickedDate={clickedDate}
                    />
                </>
            )}

            {modalType === "success" && (
// export default function SuccessModal({ isMobile, closeThen, title, content }: { isMobile: boolean; closeThen: React.Dispatch<React.SetStateAction<boolean>>; title?: string; content?: string }) {
                <SuccessModal
                    isMobile={isMobile}
                    closeThen={() => setModalType(null)}
                    title={modalText.title}
                    content={modalText.description}
                />
            )}
        </>
    );
}
