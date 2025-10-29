import { useContext, useState } from "react";
import styles from "./Overview.module.css";
import ViewCalendarMonthStyled from "../../components/Calendars/ViewCalendarMonthStyled/ViewCalendarMonthStyled";
import { useMediaQuery } from "@mui/material";
import { OverviewCard } from "../../components/OverviewCard/OverviewCard";
import { AppointmentCard } from "../../components/AppointmentCard/AppointmentCard";
import { appointmentCardsData } from "./mocks/appointmentCardMock";
import { cardsArray } from "./mocks/overviewCardMock";
import { useNavigate } from "react-router-dom";
import { TypeContext } from "../../App";
import classNames from "classnames";
import useMobile from "../../hooks/isMobile";
export function Overview() {
    const isMobile = useMobile();

    const eventsMock = [
        { id: 0, title: "Reunião", date: "2025-10-11", hour: "11:00:00" },
        { id: 1, title: "Aniversário", date: "2025-10-22", hour: "10:00:00" },
    ];
    const nav = useNavigate();

    const [events] = useState(eventsMock);
    const cards = cardsArray(nav);

    const type = useContext(TypeContext);

    const isPrestador = type === "personal";

    const filteredCards = isPrestador
        ? cards.filter(card => card.typeUser === "personal")
        : cards.filter(card => card.typeUser === "usuario");

    const [appointmentCards] = useState(appointmentCardsData);

    return (
        <>
            <div className={classNames(styles.userViewSchedule, { [styles.userViewScheduleMobile]: isMobile })}>
                <div className={classNames(styles.containerContent, { [styles.containerContentMobile]: isMobile })}>
                    <div className={classNames(styles.overviewLeftColumn, { [styles.overviewLeftColumnMobile]: isMobile })}>
                        {isMobile && (
                            <div className={styles.schedulePageUserActionsMobile}>
                                {filteredCards.map((card, index) => (
                                    <OverviewCard
                                        key={index}
                                        title={card.title}
                                        subtitle={card.subtitle}
                                        type={card.type}
                                        titletbn={card.titletbn}
                                        onClick={card.onClick}
                                        isMobile={isMobile}
                                    />
                                ))}
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
                                        date={card.date}
                                        time={card.time}
                                        isMobile={isMobile}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    {!isMobile && (
                        <div className={styles.schedulePageUserActions}>
                            {filteredCards.map((card, index) => (
                                <OverviewCard
                                    key={index}
                                    title={card.title}
                                    subtitle={card.subtitle}
                                    type={card.type}
                                    titletbn={card.titletbn}
                                    onClick={card.onClick}
                                    isMobile={isMobile}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
