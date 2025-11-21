import { CardCheckSchedule } from "../../../components/CardCheckSchedule/CardCheckSchedule";
import { CardFilterCheckSchedule } from "../../../components/CardFilterCheckSchedule/CardFilterCheckSchedule";
import CheckScheduleModal from "../../../components/Modal/CheckScheduleModal/CheckScheduleModal";
import styles from "./CheckSchedule.module.css"
import { useEffect, useState } from "react";
import TimerModal from "../../../components/Modal/TimerModal/TimerModal";
import SuccessModal from "../../../components/Modal/SuccessModal/SuccessModal";
import useMobile from "../../../hooks/isMobile";
import RegisterAbsenceModal from "../../../components/Modal/RegisterAbsenceModal/RegisterAbsenceModal";

type modalTypes = "reschedule" | "accept" | "decline" | "success" | null;

export function CheckSchedule() {
    const isMobile = useMobile();

    const [openModal, setOpenModal] = useState<modalTypes>(null);

    const [registerAbsence, setRegisterAbsence] = useState<boolean>(false);
    const [successModalInfo, setSuccessModalInfo] = useState<{
        title: string;
        content: string;
    } | null>(null);

    function handleSuccessModal(title: string, content: string) {
        setSuccessModalInfo({ title, content });
        setOpenModal("success");
    }

    const dataCard = [
        {
            id: 1,
            clientName: "João Silva",
            age: 28,
            type: "Personal",
            phone: "(11) 98765-4321",
            local: "Academia FitLife",
            address: "Rua das Flores, 123, São Paulo, SP",
            date: "15/11/2025",
            initialHour: "14:00",
            finalHour: "15:00",
            status: "done"
        },
        {
            id: 2,
            clientName: "Maria Oliveiraaaaaa",
            age: 32,
            type: "Residencial",
            phone: "(11) 91234-5678",
            local: "Academia Power",
            address: "Avenida Brasil, 456, São Paulo, SP",
            date: "15/11/2025",
            initialHour: "13:00",
            finalHour: "14:00",
            status: "cancelled"
        },
        {
            id: 3,
            clientName: "Maria Oliveira",
            age: 32,
            type: "Funcional",
            phone: "(11) 91234-5678",
            local: "Academia Power",
            address: "Avenida Brasil, 456, São Paulo, SP",
            date: "15/11/2025",
            initialHour: "15:00",
            finalHour: "16:00",
            status: "pending"
        },
        {
            id: 4,
            clientName: "Maria Oliveira",
            age: 32,
            type: "Personal",
            phone: "(11) 91234-5678",
            local: "Academia Power",
            address: "Avenida Brasil, 456, São Paulo, SP",
            date: "16/11/2025",
            initialHour: "14:00",
            finalHour: "15:00",
            status: "pending"
        },
        {
            id: 5,
            clientName: "Maria Oliveira",
            age: 32,
            type: "Residencial",
            phone: "(11) 91234-5678",
            local: "Academia Power",
            address: "Avenida Brasil, 456, São Paulo, SP",
            date: "17/11/2025",
            initialHour: "13:00",
            finalHour: "14:00",
            status: "pending"
        },
        {
            id: 6,
            clientName: "Maria Oliveira",
            age: 32,
            type: "Funcional",
            phone: "(11) 91234-5678",
            local: "Academia Power",
            address: "Avenida Brasil, 456, São Paulo, SP",
            date: "18/11/2025",
            initialHour: "15:00",
            finalHour: "16:00",
            status: "pending"
        },
        {
            id: 7,
            clientName: "Maria Oliveira",
            age: 32,
            type: "Personal",
            phone: "(11) 91234-5678",
            local: "Academia Power",
            address: "Avenida Brasil, 456, São Paulo, SP",
            date: "19/11/2025",
            initialHour: "16:00",
            finalHour: "17:00",
            status: "student_pending"
        },
        {
            id: 8,
            clientName: "Carlos Pereira",
            age: 40,
            type: "Funcional",
            phone: "(11) 99876-5432",
            local: "Academia Strong",
            address: "Rua das Palmeiras, 789, São Paulo, SP",
            date: "11/11/2025",
            initialHour: "17:00",
            finalHour: "18:00",
            status: "schedule_pending"
        },
    ];


    return (
        <>
            <div className={styles.containerCheckSchedule}>
                <div className={styles.titleFilter}>
                    <h1>Solicitações de Agendamentos</h1>
                    <div className={styles.cardFilter}>
                        <CardFilterCheckSchedule />
                    </div>
                </div>

                <div className={styles.cardsCheckSchedule}>
                    {dataCard.map((card) => (
                        <CardCheckSchedule
                            key={card.id}
                            RescheduleClick={() => setOpenModal("reschedule")}
                            AcceptScheduleClick={() => setOpenModal("accept")}
                            DeclineScheculeClick={() => setOpenModal("decline")}
                            RegisterAbsenceClick={setRegisterAbsence}
                            cardData={card}
                        />
                    ))}
                </div>
            </div>
            {openModal === "reschedule" && <CheckScheduleModal closeThen={() => setOpenModal(null)} isMobile={isMobile} openSuccess={() => handleSuccessModal("Reagendamento enviado", "O reagendamento foi enviado com sucesso para o aluno.")} />}

            {openModal === "accept" && <TimerModal callSuccessModal={() => handleSuccessModal("Agendamento Aceito", "O agendamento foi aceito e confirmado.")} isMobile={isMobile} closeThen={() => setOpenModal("success")} title="Aceitar Agendamento" content="Tem certeza que deseja aceitar o agendamento?" buttonTitle="Aceitar agendamento" />}

            {openModal === "decline" && <TimerModal callSuccessModal={() => handleSuccessModal("Agendamento Recusado", "O agendamento foi recusado.")} isMobile={isMobile} closeThen={() => setOpenModal("success")} title="Recusar agendamento" content="Tem certeza que deseja Recusar o agendamento?" buttonTitle="Recusar agendamento" isDelete={true} />}

            {openModal === "success" && <SuccessModal isMobile={isMobile} closeThen={() => setOpenModal(null)} title={successModalInfo?.title} content={successModalInfo?.content} />}

            {registerAbsence &&
                <RegisterAbsenceModal closeThen={setRegisterAbsence} />
            }
        </>
    )
}