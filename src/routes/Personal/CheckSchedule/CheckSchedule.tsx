import { CardCheckSchedule } from "../../../components/CardCheckSchedule/CardCheckSchedule";
import { CardFilterCheckSchedule } from "../../../components/CardFilterCheckSchedule/CardFilterCheckSchedule";
import CheckScheduleModal from "../../../components/Modal/CheckScheduleModal/CheckScheduleModal";
import styles from "./CheckSchedule.module.css"
import { useEffect, useState } from "react";
import TimerModal from "../../../components/Modal/TimerModal/TimerModal";
import SuccessModal from "../../../components/Modal/SuccessModal/SuccessModal";
import useMobile from "../../../hooks/isMobile";


//todo: input de filtro tem um texto que está sobreponto o outro; i think the select at CardFilterCheckSchedule does not make sense
export function CheckSchedule() {
    const isMobile = useMobile();

    const [openModal, setOpenModal] = useState<boolean>(false);
    const [openModalAccept, setModalAccept] = useState<boolean>(false);
    const [openModalDecline, setModalDecline] = useState<boolean>(false);
    const [openSuccessReschedule, setSuccessReschedule] = useState<boolean>(false);
    const [openSuccessAcceptModal, setOpenSuccessAcceptModal] = useState<boolean>(false);
    const [openSuccessDeclineModal, setOpenSuccessDeclineModal] = useState<boolean>(false);

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
            hour: "14:00",
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
            hour: "14:00",
            status: "pending"
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
            hour: "14:00",
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
            hour: "14:00",
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
            hour: "13:00",
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
            hour: "15:00",
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
            hour: "16:00",
            status: "student_pending"
        }
    ];

    function handleCallSucessReschedule() {
        setSuccessReschedule(true)
        setOpenModal(false)
    }

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
                            RescheduleClick={setOpenModal}
                            AcceptScheduleClick={setModalAccept}
                            DeclineScheculeClick={setModalDecline}
                            cardData={card}
                        />
                    ))}
                </div>
            </div>
            {openModal && <CheckScheduleModal closeThen={setOpenModal} isMobile={isMobile} openSuccess={handleCallSucessReschedule} />}
            {openModalAccept && <TimerModal callSuccessModal={setOpenSuccessAcceptModal} isMobile={isMobile} closeThen={setModalAccept} title="Aceitar Agendamento" content="Tem certeza que deseja aceitar o agendamento?" buttonTitle="Aceitar agendamento" />}
            {openModalDecline && <TimerModal callSuccessModal={setOpenSuccessDeclineModal} isMobile={isMobile} closeThen={setModalDecline} title="Recusar agendamento" content="Tem certeza que deseja Recusar o agendamento?" buttonTitle="Recusar agendamento" isDelete={true} />}
            {openSuccessReschedule && <SuccessModal isMobile={isMobile} closeThen={setSuccessReschedule} title="Reagendamento Confirmado" content="Seu reagendamento foi confirmado e enviado para o cliente" />}
            {openSuccessAcceptModal && <SuccessModal isMobile={isMobile} closeThen={setOpenSuccessAcceptModal} title="Agendamento Aceito" content="Seu agendamento foi aceito e confirmado." />}
            {openSuccessDeclineModal && <SuccessModal isMobile={isMobile} closeThen={setOpenSuccessDeclineModal} title="Agendamento Recusado" content="Seu agendamento foi recusado." />}
        </>
    )
}