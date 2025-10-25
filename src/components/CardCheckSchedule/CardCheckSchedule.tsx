import Button from "../Button";
import "./style.css"

type dataCardProps = {
    id?: number;
    clientName?: string;
    age?: number;
    phone?: string;
    local?: string;
    address?: string;
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
            <div className="card">
                <div className="high">
                    <div className="photograph">
                        <img className="imgCard" src="https://placehold.co/60x60/png" alt="" />
                    </div>
                    <div className="content">
                        <h1 className="titleName">{cardData.clientName}</h1>
                        <div className="name-age-row">
                            <span>Nome: {cardData.clientName}</span>
                            <span>Idade: {cardData.age} anos</span>
                        </div>
                        <span>Celular: {cardData.phone}</span>
                        <span>Local: {cardData.local}</span>
                        <span>Endereço: {cardData.address}</span>
                    </div>
                </div>
                <div className="buttons">
                    <Button type="button" title="Aceitar" classNameVariable="btn-check-schedule accept" onClick={handleAcceptClick} />
                    <Button type="button" title="Reagendar" classNameVariable="btn-check-schedule reschedule" onClick={handleRescheduleClick} />
                    <Button type="button" title="Recusar" classNameVariable="btn-check-schedule decline" onClick={handleDeclineClick} />
                </div>

            </div>
        </>
    )
}