import { CardCheckSchedule } from "../../../components/CardCheckSchedule/CardCheckSchedule";
import { CardFilterCheckSchedule } from "../../../components/CardFilterCheckSchedule/CardFilterCheckSchedule";
import UserHeaderMobile from "../../../components/UserHeader/UserHeaderMobile/UserHeaderMobile";
import UserHeaderDesktop from "../../../components/UserHeader/UserHeaderDesktop/UserHeaderDesktop";
import CheckScheduleModal from "../../../components/Modal/CheckScheduleModal/CheckScheduleModal";
import { useMediaQuery } from "@mui/material";
import "./style.css"
import { useState } from "react";



export function CheckSchedule() {
    const isMobile = useMediaQuery("(max-width:1024px)");
    const Header = isMobile ? UserHeaderMobile : UserHeaderDesktop;
    const [openModal, setOpenModal] = useState<boolean>(false);

    
     
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
                <CardCheckSchedule RescheduleClick={setOpenModal} />
            </div>
        </div>
        {isMobile && <Header type="personal" />}
        {openModal && <CheckScheduleModal closeThen={setOpenModal} />}
        </>
    )
}