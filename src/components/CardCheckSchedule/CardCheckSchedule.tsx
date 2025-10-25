import { Dot } from "lucide-react";
import Button from "../Button";
import "./style.css"

type dataCardProps = {
    id?: number;
    clientName?: string;
    age?: number;
    type?: string;
    phone?: string;
    local?: string;
    address?: string;
    date?: string;
    hour?: string;
    status?: "pending" | "student_pending";
}

export function CardCheckSchedule({ RescheduleClick, AcceptScheduleClick, DeclineScheculeClick, cardData }: {
    RescheduleClick?: React.Dispatch<React.SetStateAction<boolean>>,
    AcceptScheduleClick?: React.Dispatch<React.SetStateAction<boolean>>,
    DeclineScheculeClick?: React.Dispatch<React.SetStateAction<boolean>>,
    cardData: dataCardProps
}) {


    function handleRescheduleClick() {
        RescheduleClick?.(true);
    }

    function handleAcceptClick() {

        AcceptScheduleClick?.(true)

    }

    function handleDeclineClick() {
        DeclineScheculeClick?.(true)
    }

    return (
        <>
            <div className="personal-check-schedule-card">
                <div className="high">
                    <div className="photograph">
                        <img className="imgCard" src="https://placehold.co/60x60/png" alt="" />
                    </div>
                    <div className="content">
                        <div className="titleName">
                            <h1>{cardData.clientName}</h1>
                            {
                                cardData.status === "student_pending" &&
                                <div className="student_pending-check-schedule">
                                    <div className="status-pending-check-schedule">
                                        <svg width="7" height="7" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="3.5" cy="3.5" r="3.5" fill="#D7AC00" />
                                        </svg>

                                        <span className="text-pending-check-schedule">Pendente (aluno)</span>
                                    </div>
                                </div>
                            }
                        </div>

                        <div className="text-in-the-row-check-schedule">
                            <span>Data: <span className="text-in-row-check-schedule">{cardData.date}</span></span>
                            <span>Hora: <span className="text-in-row-check-schedule">{cardData.hour}</span></span>
                        </div>
                        <div className="text-in-the-row-check-schedule">
                            {/* <span>Nome: <span className="text-in-row-check-schedule">{cardData.clientName}</span></span> */}
                            <span>Idade: <span className="text-in-row-check-schedule">{cardData.age} anos</span></span>
                        </div>
                        <div className="text-in-the-row-check-schedule">
                            <span>Tipo: <span className="text-in-row-check-schedule">{cardData.type}</span></span>
                        </div>
                        <span>Celular: {cardData.phone}</span>
                        <span>Local: {cardData.local}</span>
                        <span>Endereço: {cardData.address}</span>

                    </div>
                </div>
                {cardData.status === "student_pending" && (
                    <div className="status-indicator-check-schedule">
                        <Button type="button" title="Recusar" classNameVariable="btn-check-schedule decline" onClick={handleDeclineClick} />
                        <Button type="button" title="Reagendar" classNameVariable="btn-check-schedule reschedule" onClick={handleRescheduleClick} />
                    </div>
                )}
                {cardData.status === "pending" && (
                    <div className="buttons">
                        <Button type="button" title="Aceitar" classNameVariable="btn-check-schedule accept" onClick={handleAcceptClick} />
                        <Button type="button" title="Recusar" classNameVariable="btn-check-schedule decline" onClick={handleDeclineClick} />
                        <Button type="button" title="Reagendar" classNameVariable="btn-check-schedule reschedule" onClick={handleRescheduleClick} />
                    </div>
                )}

            </div>
        </>
    )
}