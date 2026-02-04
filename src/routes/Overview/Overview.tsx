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
import { Users, HomeIcon, HeartPulseIcon, CalendarIcon, CalendarCheck, PlusIcon, ArrowRight, ShoppingBag } from 'lucide-react';
import { LinearProgress } from "@mui/material";
import Button from "../../components/Button/Button";
import NewEvent from "../../components/NewEvent/NewEvent";
import SuccessModal from "../../components/Modal/SuccessModal/SuccessModal";
import ErrorModal from "../../components/Modal/ErrorModal/ErrorModal";
import TextWithoutPlan from "../../components/Overview/TextWithoutPlan";

type ModalType = "success" | "error" | "newEvent";

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

    const [aulaPresencial, aulaResidencial, aulaFuncional] = useQueries({
        queries: [
            {
                queryKey: ["totalPRESENCIAL"],
                queryFn: () => getTotalByClassType("PRESENCIAL"),
                refetchOnWindowFocus: false,
                enabled: type?.type === "aluno"
            },
            {
                queryKey: ["totalRESIDENCIAL"],
                queryFn: () => getTotalByClassType("RESIDENCIAL"),
                refetchOnWindowFocus: false,
                enabled: type?.type === "aluno"
            },
            {
                queryKey: ["totalFUNCIONAL"],
                queryFn: () => getTotalByClassType("FUNCIONAL"),
                refetchOnWindowFocus: false,
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
        refetchOnWindowFocus: false,

    })

    const appointmentsCards = useQuery({
        queryKey: ["findUserAppointments"],
        queryFn: () => findUserAppointments(),
        retry: false,
        select: (res) => res.data,
        refetchOnWindowFocus: false,
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

        if ((aulaPresencial?.data === 0 && aulaResidencial?.data === 0 && aulaFuncional?.data === 0)) {
            handleErrorModalInfo("Erro", "Você não possui aulas disponíveis para agendamento. Por favor, adquira um plano ou entre em contato com o personal.")
            return
        }


        setModalType("newEvent")
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
                            <ViewCalendarMonthStyled
                                isMobile={isMobile}
                                events={appointments.data?.data}
                                isUserAuthorizedToInteract={type?.type === "aluno" && actualPlanQuery.data ? true : false}
                                canMakeAppointment={aulaPresencial?.data > 0 || aulaResidencial?.data > 0 || aulaFuncional?.data > 0}
                                modalInfo={setModalText}
                                modalType={setModalType}
                            />
                        </div>
                        <div className={classNames(styles.appointmentsSection, { [styles.appointmentsSectionMobile]: isMobile })}>
                            {appointmentsCards.data?.length === 0 ? (
                                <div className="flex flex-col items-center justify-center gap-4">
                                    <div className="rounded-full bg-gray-200 p-5 w-fit">
                                        <CalendarCheck className="" color="#0a3a5c" size={40} />
                                    </div>
                                    <h1>Sem agendamentos para hoje</h1>

                                    {actualPlanQuery?.data?.data ? (
                                        <>
                                            <div>
                                                <h2 className="text-center text-gray-500">Você ainda não agendou nenhuma aula para este período.</h2>
                                                <h2 className="text-center text-gray-500">Garanta seu horário agora mesmo!</h2>
                                            </div>
                                            {type?.type === "aluno" && <Button type="button" title="Agendar Agora" icon={<PlusIcon />} classNameDiv="" classNameVariable="flex items-center gap-2 !text-lg !rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                                                onClick={handleClickNewEvent}
                                            />}
                                        </>
                                    ) : (
                                        <>
                                            <div>
                                                <h2 className="text-center text-gray-500">Para agendar aulas, você precisa ter um plano ativo.</h2>
                                                <h2 className="text-center text-gray-500">Confira nossos planos e escolha o melhor para você!</h2>
                                            </div>
                                            {type?.type === "aluno" && <Button type="button" title="Comprar Plano Agora" classNameDiv="" classNameVariable="flex items-center gap-2 mt-2 !text-lg font-semibold !rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                                                onClick={() => nav("/packages")}
                                            />}
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
                                                time={`${card.data.split("T")[1].substring(0, 5)} - ${card.datafim.split("T")[1].substring(0, 5)}`}
                                                address={card.endereco.bairro + ", " + card.endereco.cidade}
                                                isMobile={isMobile}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    {!isMobile && type?.type === "aluno" && (
                        actualPlanQuery?.data?.data ? (
                            <div className={styles.schedulePageUserActions}>
                                <OverviewCard
                                    title={"Saldo de aulas"}
                                    subtitle={getBalance()}
                                    type={"usuario"}
                                    titletbn={"Ver Meus Agendamentos"}
                                    onClick={() => nav("/schedule")}
                                    isMobile={isMobile}
                                />
                                {/* <OverviewCard
                                title={"Status de planos"}
                                subtitle={actualPlanQuery?.data?.data.nome ?? "Não possui assinatura"}
                                type={"usuario"}
                                titletbn={"Planos"}
                                onClick={() => nav("/packages")}
                                isMobile={isMobile}
                            /> */}

                                {/* todo: card if user dont have an active plan. */}
                                {/* question: should i put this into a component? */}
                                <section className="bg-indigo rounded-xl shadow-lg p-6 text-white relative overflow-hidden group w-full">
                                    <div className="absolute right-0 top-0 text-white/10 transition-transform duration-500">
                                        <span className="material-icons-outlined text-9xl">
                                            <svg width="83" height="99" viewBox="0 0 83 99" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M30.5 49L42.75 39.75L55 49L50.5 33.75L62.75 24H47.5L42.75 9L38 24H22.75L35 33.75L30.5 49ZM85.5 29.25C85.5 5.75 66.25 -13.25 42.75 -13.25C19.25 -13.25 0 5.75 0 29.25C0 40.25 4.25 50 10.75 57.5V98.75L42.75 88L74.75 98.75V57.5C81.25 50 85.5 40.25 85.5 29.25ZM42.75 -2.75C60.5 -2.75 74.75 11.75 74.75 29.25C74.75 47 60.5 61.25 42.75 61.25C25 61.25 10.75 47 10.75 29.25C10.75 11.75 25 -2.75 42.75 -2.75ZM42.75 77.25L21.5 82.75V66.25C27.75 69.75 35 72 42.75 72C50.5 72 57.75 69.75 64 66.25V82.75L42.75 77.25Z" fill="white" fill-opacity="0.1" />
                                            </svg>

                                        </span>
                                    </div>
                                    <div className="relative z-10">
                                        <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 inline-block">Plano Ativo</span>
                                        <h3 className="text-2xl font-black mb-1">{actualPlanQuery?.data?.data.nome}</h3>
                                        <p className="text-white/70 text-sm mb-6 flex items-center gap-2">
                                            <span className="material-icons-outlined text-sm"><CalendarIcon size={17} /></span>
                                            Expira em 24/11/2026
                                        </p>
                                        <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 mb-6 border border-white/10">
                                            <div className="flex justify-between items-center text-sm mb-1">
                                                <span>Progresso restante</span>
                                                <span className="font-bold">80%</span>
                                            </div>
                                            <div className="w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
                                                <div className="bg-white h-full w-[80%]"></div>
                                            </div>
                                        </div>
                                        <button className="text-indigo cursor-pointer w-full py-3 bg-white text-primary font-bold rounded-xl shadow-md hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                                            Histórico de Planos
                                            <span className="material-icons-outlined text-sm"><ArrowRight size={17} /></span>
                                        </button>
                                    </div>
                                </section>
                            </div>
                        ) : (
                            <div className={styles.schedulePageUserActions}>
                                <section className="bg-indigo rounded-xl shadow-xl p-8 h-3/4 text-white relative overflow-hidden group border border-white/10">
                                    <div className="absolute right-0 bottom-0 text-white/10 transition-transform duration-700">
                                        <span className="material-symbols-outlined text-[12rem]">
                                            <svg width="129" height="135" viewBox="0 0 129 135" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M90.2383 158.117L79.0584 146.937L107.408 118.588L39.5292 50.7096L11.18 79.0588L0 67.8788L11.18 56.2996L0 45.1196L16.77 28.3496L5.58999 16.7704L16.77 5.59041L28.3492 16.7704L45.1192 0.000427246L56.2991 11.1804L67.8784 0.000427246L79.0584 11.1804L50.7092 39.5296L118.588 107.408L146.937 79.0588L158.117 90.2388L146.937 101.818L158.117 112.998L141.347 129.768L152.527 141.347L141.347 152.527L129.768 141.347L112.998 158.117L101.818 146.937L90.2383 158.117Z" fill="white" fill-opacity="0.1" />
                                            </svg>
                                        </span>
                                    </div>
                                    <div className="relative z-10 flex flex-col h-full justify-between">
                                        <div>
                                            <div className="mb-6">
                                                <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-black uppercase tracking-wider shadow-sm mb-4 inline-block">Nenhum plano ativo</span>
                                                <h3 className="text-4xl font-black leading-tight mb-3">Comece sua jornada hoje!</h3>
                                                <p className="text-white/80 text-base font-medium mb-6">Assine agora e tenha acesso imediato a uma estrutura completa para o seu treino.</p>
                                            </div>
                                            <ul className="space-y-3 mb-8">
                                                <TextWithoutPlan text="Plano de treino personalizado" />
                                                <TextWithoutPlan text="Agendamentos de consultoria presencial" />
                                                <TextWithoutPlan text="Consultoria online via Whatsapp" /> 
                                                <TextWithoutPlan text="Contato direto com o personal" />
                                            </ul>
                                        </div>
                                        <button className="cursor-pointer w-full py-4 bg-white text-indigo font-black rounded-xl shadow-2xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2 transform active:scale-95">
                                            Ver Opções de Planos
                                            <span className="material-symbols-outlined"><ShoppingBag /></span>
                                        </button>
                                    </div>
                                </section>
                            </div>
                        )
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
                                title={"Aulas pendentes para aprovação"}
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
                        openModalExtern={() => handleSuccessModalInfo("Agendado com sucesso", "Horário agendado com sucesso")}
                        errorModal={(title, description) => handleErrorModalInfo(title, description)}
                        insertedEvents={appointments.data?.data}
                        title="Agendar horário"
                        buttonTitle="Avançar"
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

            {modalType === "error" && (
                <ErrorModal
                    closeThen={() => setModalType(null)}
                    title={modalText.title}
                    content={modalText.description}
                />
            )}
        </>
    );
}
