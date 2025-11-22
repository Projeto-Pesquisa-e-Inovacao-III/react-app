import { CardCheckSchedule } from "../../../components/CardCheckSchedule/CardCheckSchedule";
import { CardFilterCheckSchedule } from "../../../components/CardFilterCheckSchedule/CardFilterCheckSchedule";
import CheckScheduleModal from "../../../components/Modal/CheckScheduleModal/CheckScheduleModal";
import styles from "./CheckSchedule.module.css"
import { useEffect, useMemo, useState } from "react";
import TimerModal from "../../../components/Modal/TimerModal/TimerModal";
import SuccessModal from "../../../components/Modal/SuccessModal/SuccessModal";
import useMobile from "../../../hooks/isMobile";
import RegisterAbsenceModal from "../../../components/Modal/RegisterAbsenceModal/RegisterAbsenceModal";

type modalTypes = "reschedule" | "accept" | "decline" | "success" | "registerAbsence" | null;

export function CheckSchedule() {
    const isMobile = useMobile();

    const [openModal, setOpenModal] = useState<modalTypes>(null);

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

    //filter
    const [filterStatus, setFilterStatus] = useState<string>("");
    const [filterSearch, setFilterSearch] = useState<string>("");

    const filteredData = useMemo(() => {
        const normalizedSearch = filterSearch.toLowerCase();
        return dataCard.filter(card => {
            const matchesStatus = card.status.toLowerCase().includes(filterStatus);
            const matchesSearch = card.clientName.toLowerCase().includes(normalizedSearch) ||
                card.local.toLowerCase().includes(normalizedSearch) ||
                card.date.toLowerCase().includes(normalizedSearch);

            console.log(`Card ID: ${card.id}, matchesStatus: ${matchesStatus}, matchesSearch: ${matchesSearch}`);
            return matchesStatus && matchesSearch;
        });
    }, [filterStatus, filterSearch]);

    function clearFilters() {
        setFilterStatus("");
        setFilterSearch("");
    }

    const hasFilters = filterStatus !== "" || filterSearch !== "";


    return (
        <>
            <div className={styles.containerCheckSchedule}>
                <div className={styles.titleFilter}>
                    <h1>Solicitações de Agendamentos</h1>
                    <div className={styles.cardFilter}>
                        <CardFilterCheckSchedule
                            searchValue={filterSearch}
                            onSearchChange={setFilterSearch}
                            selectStatusValue={filterStatus}
                            onSelectStatusChange={setFilterStatus}
                            onClear={clearFilters}
                            hasFilters={hasFilters}
                        />
                    </div>
                </div>

                <div className={styles.cardsCheckSchedule}>
                    {filteredData.length > 0 ? filteredData.map((card) => (
                        <CardCheckSchedule
                            key={card.id}
                            RescheduleClick={() => setOpenModal("reschedule")}
                            AcceptScheduleClick={() => setOpenModal("accept")}
                            DeclineScheculeClick={() => setOpenModal("decline")}
                            RegisterAbsenceClick={() => setOpenModal("registerAbsence")}
                            cardData={card}
                        />
                    )) : <p>Nenhum agendamento encontrado.</p>}


                </div>
            </div>
            {openModal === "reschedule" && <CheckScheduleModal closeThen={() => setOpenModal(null)} isMobile={isMobile} openSuccess={() => handleSuccessModal("Reagendamento enviado", "O reagendamento foi enviado com sucesso para o aluno.")} />}

            {openModal === "accept" && <TimerModal callSuccessModal={() => handleSuccessModal("Agendamento Aceito", "O agendamento foi aceito e confirmado.")} isMobile={isMobile} closeThen={() => setOpenModal("success")} title="Aceitar Agendamento" content="Tem certeza que deseja aceitar o agendamento?" buttonTitle="Aceitar agendamento" />}

            {openModal === "decline" && <TimerModal callSuccessModal={() => handleSuccessModal("Agendamento Recusado", "O agendamento foi recusado.")} isMobile={isMobile} closeThen={() => setOpenModal("success")} title="Recusar agendamento" content="Tem certeza que deseja Recusar o agendamento?" buttonTitle="Recusar agendamento" isDelete={true} />}

            {openModal === "success" && <SuccessModal isMobile={isMobile} closeThen={() => setOpenModal(null)} title={successModalInfo?.title} content={successModalInfo?.content} />}

            {openModal === "registerAbsence" &&
                <RegisterAbsenceModal closeThen={() => setOpenModal(null)} callSuccessModal={() => handleSuccessModal("Ausência Registrada", "A ausência foi registrada com sucesso.")} />
            }
        </>
    )
}