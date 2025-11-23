import { CardCheckSchedule } from "../../../components/CardCheckSchedule/CardCheckSchedule";
import { CardFilterCheckSchedule } from "../../../components/CardFilterCheckSchedule/CardFilterCheckSchedule";
import CheckScheduleModal from "../../../components/Modal/CheckScheduleModal/CheckScheduleModal";
import styles from "./CheckSchedule.module.css"
import { use, useEffect, useState } from "react";
import TimerModal from "../../../components/Modal/TimerModal/TimerModal";
import SuccessModal from "../../../components/Modal/SuccessModal/SuccessModal";
import useMobile from "../../../hooks/isMobile";
import RegisterAbsenceModal from "../../../components/Modal/RegisterAbsenceModal/RegisterAbsenceModal";
import useSearchFilter from "../../../hooks/useSearchFilter";
import { findPersonalRequests } from "../../../constants/schedule";
import { useQuery } from "@tanstack/react-query";

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

    const personalRequests = useQuery({
        queryKey: ["personalRequests"],
        queryFn: () => findPersonalRequests(),
        retry: false,
    });

    useEffect(() => {
        if (personalRequests.data) {
            // You can handle personalRequests.data here if needed
        }
    }, [personalRequests.data]);

    //filter
    const {
        filteredData,
        hasFilters,
        filterSearch,
        setFilterSearch,
        filterStatus,
        setFilterStatus,
        clearFilters
    } = useSearchFilter(personalRequests.data?.data.content, {
        searchStatus: (item) => item.status,
        searchName: (item) => [item.nome, item.dataInicio],
    });

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
                            key={card.agendamentoId}
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