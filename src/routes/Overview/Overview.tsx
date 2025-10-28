import { useState } from "react";
import "./desktop.css";
import "./mobile.css";
import ViewCalendarMonthStyled from "../../components/Calendars/ViewCalendarMonthStyled/ViewCalendarMonthStyled";
import { useMediaQuery } from "@mui/material";
import { OverviewCard } from "../../components/OverviewCard/OverviewCard";
import { AppointmentCard } from "../../components/AppointmentCard/AppointmentCard";
import { appointmentCardsData } from "./mocks/appointmentCardMock";
import { cardsArray } from "./mocks/overviewCardMock";
import { useNavigate } from "react-router-dom";
export function Overview({ isPrestador }: { isPrestador?: boolean }) {
    const isMobile = useMediaQuery("(max-width:1024px)");

    const eventsMock = [
        { id: 0, title: "Reunião", date: "2025-10-11", hour: "11:00:00" },
        { id: 1, title: "Aniversário", date: "2025-10-22", hour: "10:00:00" },
    ];
    const nav = useNavigate();

    const [events] = useState(eventsMock);
    const cards = cardsArray(nav);

    const filteredCards = isPrestador
        ? cards.filter(card => card.typeUser === "personal")
        : cards.filter(card => card.typeUser === "usuario");

    const [appointmentCards] = useState(appointmentCardsData);


    return (
        <>
            <div className={`user-view-schedule${isMobile ? "-mobile" : ""}`}>
                <div className={`container-content${isMobile ? "-mobile" : ""}`}>
                    <div className={`overview-left-column${isMobile ? "-mobile" : ""}`}>
                        {isMobile && (
                            <div
                                className={`overview-right-column schedule-page-user-actions-mobile`}

                            >
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
                        <div className={`schedule-page-calendar${isMobile ? "-mobile" : ""}`}>
                            <ViewCalendarMonthStyled isMobile={isMobile} events={events} />
                        </div>
                        <div>
                            <h1>Agendamentos</h1>
                            <div className={isMobile ? "appointment-cards-row-mobile" : "appointment-cards-row"}>
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
                        <div
                            className={`overview-right-column schedule-page-user-actions`}
                        >{filteredCards.map((card, index) => (
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
