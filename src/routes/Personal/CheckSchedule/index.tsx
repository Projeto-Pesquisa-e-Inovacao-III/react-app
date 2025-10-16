import { CardCheckSchedule } from "../../../components/CardCheckSchedule/CardCheckSchedule";
import { CardFilterCheckSchedule } from "../../../components/CardFilterCheckSchedule/CardFilterCheckSchedule";
import UserHeaderMobile from "../../../components/UserHeader/UserHeaderMobile/UserHeaderMobile";
import UserHeaderDesktop from "../../../components/UserHeader/UserHeaderDesktop/UserHeaderDesktop";
import { useMediaQuery } from "@mui/material";
import "./style.css"


export function CheckSchedule() {
    const isMobile = useMediaQuery("(max-width:1024px)");
    const Header = isMobile ? UserHeaderMobile : UserHeaderDesktop;
    
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
            
                <CardCheckSchedule />
                <CardCheckSchedule />
                <CardCheckSchedule />
                <CardCheckSchedule />
                <CardCheckSchedule />
            </div>
            
        </div>
        {isMobile && <Header type="personal" />}
        </>
    )
}