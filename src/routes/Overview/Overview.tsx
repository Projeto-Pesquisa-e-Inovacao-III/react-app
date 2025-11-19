import { useContext, useEffect, useState } from "react";
import styles from "./Overview.module.css";
import ViewCalendarMonthStyled from "../../components/Calendars/ViewCalendarMonthStyled/ViewCalendarMonthStyled";
import { OverviewCard } from "../../components/OverviewCard/OverviewCard";
import { AppointmentCard } from "../../components/AppointmentCard/AppointmentCard";
import { appointmentCardsData } from "./mocks/appointmentCardMock";
import { cardsArray } from "./mocks/overviewCardMock";
import { useNavigate } from "react-router-dom";
import { TypeContext } from "../../App";
import classNames from "classnames";
import useMobile from "../../hooks/isMobile";
import { actualPlan } from "../../constants/products";
export function Overview() {
    const isMobile = useMobile();

    const eventsMock = [
        { id: 0, title: "Reunião", date: "2025-10-11", hour: "11:00:00" },
        { id: 1, title: "Aniversário", date: "2025-10-22", hour: "10:00:00" },
    ];
    const nav = useNavigate();

    const [events] = useState(eventsMock);

    const [actualPlanData, setActualPlanData] = useState("");

    const cards = cardsArray(nav);

    const type = useContext(TypeContext);

    const isPrestador = type === "personal";

    const filteredCards = isPrestador
        ? cards.filter(card => card.typeUser === "personal")
        : cards.filter(card => card.typeUser === "usuario");

    const [appointmentCards] = useState(appointmentCardsData);

    useEffect(() => {
        function getActualPlan() {
            actualPlan().then(response => {
                console.log(response.data);
                setActualPlanData(response.data);
            }).catch(error => {
                console.error("Error fetching actual plan:", error);
            });
        }

        getActualPlan();


    }, []);

    return (
        <>
            <div className={classNames(styles.userViewSchedule, { [styles.userViewScheduleMobile]: isMobile })}>
                <div className={classNames(styles.containerContent, { [styles.containerContentMobile]: isMobile })}>
                    <div className={classNames(styles.overviewLeftColumn, { [styles.overviewLeftColumnMobile]: isMobile })}>
                        {isMobile && (
                            <div className={styles.schedulePageUserActionsMobile}>
                                <OverviewCard
                                    title={"Status de planos"}
                                    subtitle={actualPlanData ? actualPlanData : "Não possui assinatura"}
                                    type={"usuario"}
                                    titletbn={"Planos"}
                                    onClick={() => nav("/packages")}
                                    isMobile={isMobile}
                                />
                                <OverviewCard
                                    title={"Agendamentos Restantes"}
                                    subtitle={"2"}
                                    type={"usuario"}
                                    titletbn={"Agendamentos"}
                                    onClick={() => nav("/schedule")}
                                    isMobile={isMobile}
                                />
                            </div>
                        )}
                        <div className={classNames(styles.schedulePageCalendar, { [styles.schedulePageCalendarMobile]: isMobile })}>
                            <ViewCalendarMonthStyled isMobile={isMobile} events={events} />
                        </div>
                        <div>
                            <h1>Agendamentos</h1>
                            <div className={classNames(styles.appointmentCardsRow, { [styles.appointmentCardsRowMobile]: isMobile })}>
                                {appointmentCards.map((card, index) => (
                                    <AppointmentCard
                                        key={index}
                                        status={card.status}
                                        name={card.name}
                                        photoUrl={card.photoUrl}
                                        type={card.type}
                                        date={card.date}
                                        time={card.time}
                                        address={card.address}
                                        isMobile={isMobile}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    {!isMobile && (
                        <div className={styles.schedulePageUserActions}>
                            <OverviewCard
                                title={"Status de planos"}
                                subtitle={actualPlanData ? actualPlanData : "Não possui assinatura"}
                                type={"usuario"}
                                titletbn={"Planos"}
                                onClick={() => nav("/packages")}
                                isMobile={isMobile}
                            />
                            <OverviewCard
                                title={"Agendamentos Restantes"}
                                subtitle={"2"}
                                type={"usuario"}
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
