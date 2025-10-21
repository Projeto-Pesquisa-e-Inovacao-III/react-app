import { CardCheckSchedule } from "../../../components/CardCheckSchedule/CardCheckSchedule";
import { CardFilterCheckSchedule } from "../../../components/CardFilterCheckSchedule/CardFilterCheckSchedule";
import UserHeaderMobile from "../../../components/UserHeader/UserHeaderMobile/UserHeaderMobile";
import UserHeaderDesktop from "../../../components/UserHeader/UserHeaderDesktop/UserHeaderDesktop";
import CheckScheduleModal from "../../../components/Modal/CheckScheduleModal/CheckScheduleModal";
import { useMediaQuery } from "@mui/material";
import "./style.css"
import { useEffect, useState } from "react";
import TimerModal from "../../../components/Modal/TimerModal/TimerModal";
import SuccessModal from "../../../components/Modal/SuccessModal/SuccessModal";


//todo: input de filtro tem um texto que está sobreponto o outro; i think the select at CardFilterCheckSchedule does not make sense
export function CheckSchedule() {
    const isMobile = useMediaQuery("(max-width:1024px)");
    const Header = isMobile ? UserHeaderMobile : UserHeaderDesktop;
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [openModalAccept, setModalAccept] = useState<boolean>(false);
    const [openModalDecline, setModalDecline] = useState<boolean>(false);
    const [openSuccessReschedule, setSuccessReschedule] = useState<boolean>(false);
    const [openSuccessAcceptModal, setOpenSuccessAcceptModal] = useState<boolean>(false);
    const [openSuccessDeclineModal, setOpenSuccessDeclineModal] = useState<boolean>(false);

    useEffect(() => {
        if (isMobile) window.scrollTo(0, 0);
    }, [openModal, openModalAccept, openModalDecline, openSuccessReschedule, openSuccessAcceptModal, openSuccessDeclineModal]);


    const dataCard = [
        {
            id: 1,
            clientName: "João Silva",
            age: 28,
            phone: "(11) 98765-4321",
            local: "Academia FitLife",
            address: "Rua das Flores, 123, São Paulo, SP"
        },
        {
            id: 2,
            clientName: "Maria Oliveira",
            age: 32,
            phone: "(11) 91234-5678",
            local: "Academia Power",
            address: "Avenida Brasil, 456, São Paulo, SP"
        },
        {
            id: 3,
            clientName: "Maria Oliveira",
            age: 32,
            phone: "(11) 91234-5678",
            local: "Academia Power",
            address: "Avenida Brasil, 456, São Paulo, SP"
        },
        {
            id: 4,
            clientName: "Maria Oliveira",
            age: 32,
            phone: "(11) 91234-5678",
            local: "Academia Power",
            address: "Avenida Brasil, 456, São Paulo, SP"
        },
        {
            id: 5,
            clientName: "Maria Oliveira",
            age: 32,
            phone: "(11) 91234-5678",
            local: "Academia Power",
            address: "Avenida Brasil, 456, São Paulo, SP"
        },
        {
            id: 6,
            clientName: "Maria Oliveira",
            age: 32,
            phone: "(11) 91234-5678",
            local: "Academia Power",
            address: "Avenida Brasil, 456, São Paulo, SP"
        },
        {
            id: 7,
            clientName: "Maria Oliveira",
            age: 32,
            phone: "(11) 91234-5678",
            local: "Academia Power",
            address: "Avenida Brasil, 456, São Paulo, SP"
        }
    ];

    function handleCallSucessReschedule(){
        setSuccessReschedule(true)
        setOpenModal(false)
    }


    useEffect(() => {
        console.log(openSuccessAcceptModal, openSuccessDeclineModal)
    },[ openSuccessAcceptModal, openSuccessDeclineModal]);

    return(
        <> 
        {!isMobile && <Header type="personal" />}
        <div className="container-check-schedule">
            <div className="title-filter">
                <h1>Solicitações de Agendamentos</h1>
                <div className="card-filter">
                    <CardFilterCheckSchedule />
                </div>
            </div>

            <div className="cards-check-schedule">
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
        {isMobile && <Header type="personal" />}
        {openModal && <CheckScheduleModal  closeThen={setOpenModal} isMobile={isMobile} openSuccess={handleCallSucessReschedule} />}
        {openModalAccept && <TimerModal  callSuccessModal={setOpenSuccessAcceptModal} isMobile={isMobile}  closeThen={setModalAccept} title="Aceitar Agendamento" content="Tem certeza que deseja aceitar o agendamento?" buttonTitle="Aceitar agendamento"/> }
        {openModalDecline && <TimerModal  callSuccessModal={setOpenSuccessDeclineModal}  isMobile={isMobile}  closeThen={setModalDecline} title="Recusar agendamento" content="Tem certeza que deseja Recusar o agendamento?" buttonTitle="Recusar agendamento" isDelete={true} />}
        {openSuccessReschedule && <SuccessModal isMobile={isMobile} closeThen={setSuccessReschedule} title="Reagendamento Confirmado" content="Seu reagendamento foi confirmado e enviado para o cliente"/>}
        {openSuccessAcceptModal && <SuccessModal isMobile={isMobile} closeThen={setOpenSuccessAcceptModal} title="Agendamento Aceito" content="Seu agendamento foi aceito e confirmado." />}
        {openSuccessDeclineModal && <SuccessModal isMobile={isMobile} closeThen={setOpenSuccessDeclineModal} title="Agendamento Recusado" content="Seu agendamento foi recusado." />}
        </>
    )
}