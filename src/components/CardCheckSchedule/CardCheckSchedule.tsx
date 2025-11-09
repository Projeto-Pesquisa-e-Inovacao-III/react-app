import Button from "../Button/Button";
import StatusSchedule from "../StatusSchedule/StatusSchedule";
import styles from "./CardCheckSchedule.module.css";

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
    status?: string | "pending" | "student_pending";
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
            <div className={styles.personalCheckScheduleCard}>
                <div className={styles.statusIndicatorCheckSchedule}>
                    {cardData.status === "student_pending" && (<StatusSchedule dotColor="#D7AC00" statusText="Pendente (aluno)" />)}
                    {cardData.status === "pending" && (<StatusSchedule dotColor="#D7AC00" statusText="Pendente (aprovação)" />)}
                    {cardData.status === "done" && (<StatusSchedule dotColor="#4CAF50" statusText="Agendamento concluído" />)}
                </div>
                <div className={styles.high}>
                    <div className={styles.photograph}>
                        <img className={styles.imgCard} src="https://placehold.co/60x60/png" alt="" />
                    </div>
                    <div className={styles.content}>
                        <div className={styles.titleName}>
                            <h1>{cardData.clientName}</h1>
                        </div>

                        <div className={styles.textInTheRowCheckSchedule}>
                            <span>Data: <span className={styles.textInRowCheckSchedule}>{cardData.date}</span></span>
                            <span>Hora: <span className={styles.textInRowCheckSchedule}>{cardData.hour}</span></span>
                        </div>
                        <div className={styles.textInTheRowCheckSchedule}>
                            {/* <span>Nome: <span className={styles.textInRowCheckSchedule}>{cardData.clientName}</span></span> */}
                            <span>Idade: <span className={styles.textInRowCheckSchedule}>{cardData.age} anos</span></span>
                        </div>
                        <div className={styles.textInTheRowCheckSchedule}>
                            <span>Tipo: <span className={styles.textInRowCheckSchedule}>{cardData.type}</span></span>
                        </div>
                        <span>Celular: {cardData.phone}</span>
                        <span>Local: {cardData.local}</span>
                        <span>Endereço: {cardData.address}</span>

                    </div>
                </div>
                {cardData.status === "pending" && (
                    <div className={styles.buttons}>
                        <Button type="button" title="Aceitar" classNameVariable="btn-check-schedule accept" onClick={handleAcceptClick} />
                        <Button type="button" title="Recusar" classNameVariable="btn-check-schedule decline" onClick={handleDeclineClick} />
                        <Button type="button" title="Reagendar" classNameVariable="btn-check-schedule reschedule" onClick={handleRescheduleClick} />
                    </div>
                )}

            </div>
        </>
    )
}