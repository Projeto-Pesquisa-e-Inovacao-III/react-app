import classNames from "classnames";
import Button from "../Button/Button";
import StatusSchedule from "../StatusSchedule/StatusSchedule";
import styles from "./CardCheckSchedule.module.css";
import { format, parse, parseISO } from "date-fns";
import UserAvatar from "../UserAvatar/UserAvatar";

export type dataCardProps = {
    agendamentoId?: number;
    nome?: string;
    personalNome?: string;
    idade?: number;
    tipo?: string;
    local?: string;
    telefone?: {
        ddd: string;
        numero: string;
        pais?: string;
    };
    endereco: {
        cep: {
            bairro: string
            id: string
            localidade: string
            logradouro: string
            uf: string
        };
        numero: string
    }
    foto: string;
    dataInicio: string;
    dataFim?: string;
    horaInicio?: string;
    horaFim?: string;
    tipoAula?: string;
    status?: string | "PENDENTE_PERSONAL_APROVACAO" | "student_pending" | "APROVADO" | "schedule_pending_past" | "done" | "cancelled";
}


type CardCheckScheduleProps = {
    RescheduleClick?: React.Dispatch<React.SetStateAction<boolean>>,
    AcceptScheduleClick?: React.Dispatch<React.SetStateAction<boolean>>,
    ConcludeScheduleClick?: React.Dispatch<React.SetStateAction<boolean>>,
    DeclineScheculeClick?: React.Dispatch<React.SetStateAction<boolean>>,
    RegisterAbsenceClick?: React.Dispatch<React.SetStateAction<boolean>>,
    cardData: dataCardProps
}

export function CardCheckSchedule({ RescheduleClick, AcceptScheduleClick, ConcludeScheduleClick, DeclineScheculeClick, RegisterAbsenceClick, cardData }: CardCheckScheduleProps) {
    const today = new Date();
    const [year, month, day] = cardData.dataInicio?.split("T")[0].split("-").map(Number) || [0, 0, 0];
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

    function handleConcludeClick() {
        ConcludeScheduleClick?.(true)
    }
    
    
    return (
        <>
            <div className={styles.personalCheckScheduleCard}>
                <div className={styles.statusIndicatorCheckSchedule}>
                    {cardData.status === "CONCLUIDO" && (<StatusSchedule dotColor="#4CAF50" statusText="Agendamento concluído" />)}
                    {cardData.status === "student_pending" && (<StatusSchedule dotColor="#D7AC00" statusText="Pendente (aprovação aluno)" />)}
                    {cardData.status === "PENDENTE_PERSONAL_APROVACAO" && (<StatusSchedule dotColor="#D7AC00" statusText="Pendente (aprovação do personal)" />)}
                    {cardData.status === "PENDENTE_CLIENTE_APROVACAO" && (<StatusSchedule dotColor="#D7AC00" statusText="Pendente (aprovação do aluno)" />)}
                    {cardData.status === "APROVADO" && (<StatusSchedule dotColor="#D7AC00" statusText="Pendente (aula)" />)}
                    {cardData.status === "PENDENTE_PERSONAL_CONCLUIR" && (<StatusSchedule dotColor="#D7AC00" statusText="Pendente (conclusão)" />)}
                    {cardData.status === "CANCELADO_PERSONAL" && (<StatusSchedule dotColor="#FF0000" statusText="Cancelado pelo personal" />)}
                    {cardData.status === "CANCELADO_CLIENTE" && (<StatusSchedule dotColor="#FF0000" statusText="Cancelado pelo cliente" />)}
                    {cardData.status === "AUSENCIA_CLIENTE" && (<StatusSchedule dotColor="#FF0000" statusText="Ausência (cliente)" />)}
                    {cardData.status === "AUSENCIA_PERSONAL" && (<StatusSchedule dotColor="#FF0000" statusText="Ausência (personal)" />)}
                </div>
                <div className={classNames(styles.high, { [styles.highStatusWithoutBorder]: cardData.status !== "PENDENTE_PERSONAL_APROVACAO" })}>
                    <div className={styles.photograph}>
                        <UserAvatar {...{ foto: `http://localhost:8080/usuarios/foto/${cardData.foto}` }} />
                    </div>
                    <div className={styles.content}>
                        <div className={styles.titleName}>
                            <h1>{cardData.nome}</h1>
                        </div>

                        <div className={styles.textInTheRowCheckSchedule}>
                            <span>Data: <span className={styles.textInRowCheckSchedule}>{format(parseISO(cardData.dataInicio), "dd/MM/yyyy")}</span></span>
                            <span>Hora: <span className={styles.textInRowCheckSchedule}>{cardData.dataInicio?.split("T")[1].slice(0, 5)} - {cardData.dataFim?.split("T")[1].slice(0, 5)}</span></span>
                        </div>
                        <div className={styles.textInTheRowCheckSchedule}>
                            <span>Nome: <span className={styles.textInRowCheckSchedule}>{cardData.nome}</span></span>
                            <span>Idade: <span className={styles.textInRowCheckSchedule}>{cardData.idade} anos</span></span>
                        </div>
                        <div className={styles.textInTheRowCheckSchedule}>
                            <span>Tipo: <span className={styles.textInRowCheckSchedule}>{cardData.tipoAula}</span></span>
                        </div>
                        <span>Celular: {cardData.telefone?.ddd} {cardData.telefone?.numero}</span>
                        <span>Local: {cardData.local}</span>
                        <span>Endereço: {cardData.endereco.cep.logradouro}, {cardData.endereco.numero} - {cardData.endereco.cep.uf}</span>

                    </div>
                </div>
                {cardData.status && (cardData.status === "PENDENTE_PERSONAL_APROVACAO") && (
                    <div className={styles.buttons}>
                        <Button type="button" typeButton="accept" title="Aceitar" classNameDiv={styles.buttonActions} classNameVariable={`${styles.btnCheckSchedule}`} onClick={handleAcceptClick} />
                        <Button type="button" typeButton="decline" title="Recusar" classNameDiv={styles.buttonActions} classNameVariable={`${styles.btnCheckSchedule}`} onClick={handleDeclineClick} />
                        <Button type="button" typeButton="other" title="Reagendar" classNameDiv={styles.buttonActions} classNameVariable={`${styles.btnCheckSchedule}`} onClick={handleRescheduleClick} />
                    </div>
                )}

                {cardData.status && cardData.status === "PENDENTE_PERSONAL_CONCLUIR" && scheduleDate.getTime() < today.getTime() && (
                    <div className={styles.buttons}>
                        <Button type="button" typeButton="accept" title="Concluir agendamento" classNameDiv={styles.buttonActions} classNameVariable={`${styles.btnCheckSchedule}`} onClick={handleConcludeClick} />

                        <Button type="button" typeButton="decline" title="Registrar ausência" classNameDiv={styles.buttonActions} classNameVariable={`${styles.btnCheckSchedule}`} onClick={handleRegisterAbsenceClick} />
                    </div>
                )}

            </div>
        </>
    )
}