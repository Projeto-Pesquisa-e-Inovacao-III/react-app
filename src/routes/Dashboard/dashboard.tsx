import { useMediaQuery } from "@mui/material";
import UserHeaderDesktop from "../../components/UserHeader/UserHeaderDesktop/UserHeaderDesktop";
import UserHeaderMobile from "../../components/UserHeader/UserHeaderMobile/UserHeaderMobile";
import KPICards from "../../components/Dashboard/Cards/KPICards/KPICards";
import "./style.css"
export default function Dashboard() {
    const isMobile = useMediaQuery('(max-width:1024px)');

    return (
        <>
            {!isMobile && <UserHeaderDesktop />}
            <div className="wrapper-dashboard-personal">
                <div className={`wrapper-elements-dashboard ${isMobile && "mobile"}`}>
                    <div className="text-dashboard-personal">
                        <h1>Desempenho</h1>
                        <h3>Acompanhe suas métricas e resultados</h3>
                    </div>
                    <div className={`kpis-dashboard-personal${isMobile ? "-mobile" : ""}`}>
                        <KPICards isMobile={isMobile} isFull={!isMobile} title="Quantidade treinos realizados" value="20" description="Treinos realizados " icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>} />
                        <KPICards isMobile={isMobile} isFull={!isMobile} title="Porcetagem de horaríos disponiveis" value="20%" description="% de Horaríos disponiveis" icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>} />
                        <KPICards isMobile={isMobile} isFull={true} value="R$1200" title="Receita Mensal" icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>} />
                    </div>
                </div>
                {isMobile && <UserHeaderMobile />}
            </div>
        </>
    )
}