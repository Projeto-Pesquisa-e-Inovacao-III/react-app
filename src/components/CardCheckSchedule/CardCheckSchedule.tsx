import Button from "../Button";
import "./style.css"

export function CardCheckSchedule({RescheduleClick, }: {RescheduleClick?: React.Dispatch<React.SetStateAction<boolean>> }) {

    
    function handleRescheduleClick() {
        RescheduleClick?.(true);
    }

    function handleAcceptClick() {
        // Lógica para aceitar o agendamento
    }

    function handleDeclineClick() {
        // Lógica para recusar o agendamento
    }

    return(
        <>
        <div className="card">
            <div className="high">
                <div className="photograph">
                    <img className="imgCard" src="https://placehold.co/60x60/png" alt="" />
                </div>
                <div className="content">
                    <h1 className="titleName">Carlos Oliveira</h1>
                    <div className="name-age-row">
                        <span>Nome: José Alencar</span>
                        <span>Idade: 30 anos</span>
                    </div>
                    <span>Celular: (11) 98765-4321</span>
                    <span>Local: Casa</span>
                    <span>Endereço: Rua das Flores, 123</span>
                </div>
            </div>
            <div className="buttons">
                <Button type="button" title="Aceitar" classNameVariable="btn-check-schedule accept" />
                <Button type="button" title="Reagendar" classNameVariable="btn-check-schedule reschedule" onClick={handleRescheduleClick} />
                <Button type="button" title="Recusar" classNameVariable="btn-check-schedule decline" />
            </div>

        </div>
        </>
    )
}