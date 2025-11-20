import classNames from "classnames";
import Button from "../Button/Button";
import StatusSchedule from "../StatusSchedule/StatusSchedule";
import styles from "./CardCheckSchedule.module.css";
import { useEffect } from "react";

type dataCardProps = {
    id?: number;
    clientName?: string;
    age?: number;
    type?: string;
    phone?: string;
    local?: string;
    address?: string;
    date?: string;
    initialHour?: string;
    finalHour?: string;
    status?: string | "pending" | "student_pending" | "schedule_pending" | "schedule_pending_past" | "done" | "cancelled";
}

export function CardCheckSchedule({ RescheduleClick, AcceptScheduleClick, DeclineScheculeClick, RegisterAbsenceClick, cardData }: {
    RescheduleClick?: React.Dispatch<React.SetStateAction<boolean>>,
    AcceptScheduleClick?: React.Dispatch<React.SetStateAction<boolean>>,
    DeclineScheculeClick?: React.Dispatch<React.SetStateAction<boolean>>,
    RegisterAbsenceClick?: React.Dispatch<React.SetStateAction<boolean>>,
    cardData: dataCardProps
}) {
    const today = new Date();
    const [day, month, year] = cardData.date?.split("/").map(Number) || [0, 0, 0];
    const scheduleDate = new Date(year, month - 1, day);

    function handleRescheduleClick() {
        RescheduleClick?.(true);
    }

    function handleAcceptClick() {

        AcceptScheduleClick?.(true)

    }

    function handleDeclineClick() {
        DeclineScheculeClick?.(true)
    }

    function handleRegisterAbsenceClick() {
        RegisterAbsenceClick?.(true)
    }

    return (
        <>
            <div className={styles.personalCheckScheduleCard}>
                <div className={styles.statusIndicatorCheckSchedule}>
                    {cardData.status === "student_pending" && (<StatusSchedule dotColor="#D7AC00" statusText="Pendente (aprovação aluno)" />)}
                    {cardData.status === "pending" && (<StatusSchedule dotColor="#D7AC00" statusText="Pendente (aprovação do personal)" />)}
                    {cardData.status === "schedule_pending" && (<StatusSchedule dotColor="#D7AC00" statusText="Pendente (aula)" />)}
                    {cardData.status === "done" && (<StatusSchedule dotColor="#4CAF50" statusText="Agendamento concluído" />)}
                    {cardData.status === "cancelled" && (<StatusSchedule dotColor="#FF0000" statusText="Agendamento cancelado" />)}
                </div>
                <div className={classNames(styles.high, { [styles.highStatusWithoutBorder]: cardData.status !== "pending"})}>
                    <div className={styles.photograph}>
                        <img className={styles.imgCard} src="https://placehold.co/60x60/png" alt="" />
                    </div>
                    <div className={styles.content}>
                        <div className={styles.titleName}>
                            <h1>{cardData.clientName}</h1>
                        </div>

                        <div className={styles.textInTheRowCheckSchedule}>
                            <span>Data: <span className={styles.textInRowCheckSchedule}>{cardData.date}</span></span>
                            <span>Hora: <span className={styles.textInRowCheckSchedule}>{cardData.initialHour} - {cardData.finalHour}</span></span>
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
                {cardData.status && cardData.status === "pending" && (
                    <div className={styles.buttons}>
                        <Button type="button" typeButton="accept" title="Aceitar" classNameVariable={`${styles.btnCheckSchedule}`} onClick={handleAcceptClick} />
                        <Button type="button" typeButton="decline" title="Recusar" classNameVariable={`${styles.btnCheckSchedule}`} onClick={handleDeclineClick} />
                        <Button type="button" typeButton="other" title="Reagendar" classNameVariable={`${styles.btnCheckSchedule}`} onClick={handleRescheduleClick} />
                    </div>
                )}

                {cardData.status && cardData.status === "schedule_pending" && scheduleDate < today && (
                    <div className={styles.buttons}>
                        <Button type="button" typeButton="other" title="Registrar ausência" classNameVariable={`${styles.btnCheckSchedule}`} onClick={handleRegisterAbsenceClick} />
                    </div>
                )}

            </div>
        </>
    )
}