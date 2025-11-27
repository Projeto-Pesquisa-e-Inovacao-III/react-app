import { useContext, useEffect, useState } from "react";
import styles from "./Overview.module.css";
import ViewCalendarMonthStyled from "../../components/Calendars/ViewCalendarMonthStyled/ViewCalendarMonthStyled";
import { OverviewCard } from "../../components/OverviewCard/OverviewCard";
import { AppointmentCard } from "../../components/AppointmentCard/AppointmentCard";
import { appointmentCardsData } from "./mocks/appointmentCardMock";
import { useNavigate } from "react-router-dom";
import { TypeContext } from "../../App";
import classNames from "classnames";
import useMobile from "../../hooks/isMobile";
import { actualPlan } from "../../constants/products";
import { getTotalByClassType } from "../../constants/overview";
import { useQueries, useQuery } from "@tanstack/react-query";
import { appointmentAtCalendar, findPersonalRequests, findUserAppointments, getAppointmentByStatus } from "../../constants/schedule";
import { appoitmentsCount } from "../../constants/personal";
import { format, parse, startOfDay } from "date-fns";
import { locale } from "dayjs";
import { ptBR } from "date-fns/locale";

export function Overview() {
    const isMobile = useMobile();

    const nav = useNavigate();

    const type = useContext(TypeContext);

    const [appointmentCards] = useState(appointmentCardsData);

    const actualPlanQuery = useQuery({
        queryKey: ["total", "actualPlan"],
        queryFn: () => actualPlan(),
        enabled: type?.type === "aluno"
    });

    const [aulaPresencial, aulaResidencial, aulaFuncional] = useQueries({
        queries: [
            {
                queryKey: ["total", "PRESENCIAL"],
                queryFn: () => getTotalByClassType("PRESENCIAL"),
                enabled: type?.type === "aluno"
            },
            {
                queryKey: ["total", "RESIDENCIAL"],
                queryFn: () => getTotalByClassType("RESIDENCIAL"),
                enabled: type?.type === "aluno"
            },
            {
                queryKey: ["total", "FUNCIONAL"],
                queryFn: () => getTotalByClassType("FUNCIONAL"),
                enabled: type?.type === "aluno"
            }
        ]
    });

    function getBalance() {
        const balance = (
            <div>
                <p>{`Presencial: ${aulaPresencial?.data ?? 0}`}</p>
                <p>{`Funcional: ${aulaFuncional?.data ?? 0}`}</p>
                <p>{`Residencial: ${aulaResidencial?.data ?? 0}`}</p>
            </div>
        );
        return balance;
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

        if (!type || type?.type !== "personal") return;

        const today = new Date();
        appoitmentsCount({ status: "APROVADO", data: today.toISOString().split("T")[0] }).then((response) => {
            console.log("Personal appointments today count:", response);

            setCountAppointmentsToday(response.data);
        }).catch((error) => {
            console.error("Error fetching personal appointments today count:", error);
            return 0;
        });

        appoitmentsCount({ status: "PENDENTE_PERSONAL_APROVACAO" }).then((response) => {
            console.log("Personal appointments pending count:", response);
            setCountAppointmentsPending(response.data);
        }).catch((error) => {
            console.error("Error fetching personal appointments today count:", error);
            return 0;
        });
    }

    useEffect(() => {
        fetchAppointmentsCountToday();
    }, []);

    return (
        <>
            <div className={classNames(styles.userViewSchedule, { [styles.userViewScheduleMobile]: isMobile })}>
                <div className={classNames(styles.containerContent, { [styles.containerContentMobile]: isMobile })}>
                    <div className={classNames(styles.overviewLeftColumn, { [styles.overviewLeftColumnMobile]: isMobile })}>
                        {isMobile && (
                            <div className={styles.schedulePageUserActionsMobile}>
                                <OverviewCard
                                    title={"Agendamentos Restantes"}
                                    subtitle={"123"}
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
                        <div className={classNames(styles.schedulePageCalendar, { [styles.schedulePageCalendarMobile]: isMobile })}>
                            <ViewCalendarMonthStyled isMobile={isMobile} events={appointments.data?.data} />
                        </div>
                        <div>
                            <h1>Agendamentos</h1>
                            <div className={classNames(styles.appointmentCardsRow, { [styles.appointmentCardsRowMobile]: isMobile })}>
                                {appointmentsCards.data?.map((card, index) => (
                                    <AppointmentCard
                                        key={index}
                                        status={card.agendamentoStatus}
                                        name={card.personalNome}
                                        photoUrl={card.fotoUsuario}
                                        type={card.tipoAula}
                                        date={format(parse(card.data.split("T")[0], "yyyy-MM-dd", new Date()), "dd/MM/yyyy", { locale: ptBR })}
                                        time={`${card.data.split("T")[1].substring(0, 5)} - ${card.datafim.split("T")[1].substring(0, 5)}`}
                                        address={card.endereco.bairro + ", " + card.endereco.cidade}
                                        isMobile={isMobile}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    {!isMobile && type?.type === "aluno" && (
                        <div className={styles.schedulePageUserActions}>
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

                    {!isMobile && type?.type !== "aluno" && (
                        <div className={styles.schedulePageUserActions}>
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
                                titletbn={"Agendamentos"}
                                onClick={() => nav("/schedule")}
                                isMobile={isMobile}
                            />
                        </div>
                    )}

                </div>
            </div>
        </>
    );
}
