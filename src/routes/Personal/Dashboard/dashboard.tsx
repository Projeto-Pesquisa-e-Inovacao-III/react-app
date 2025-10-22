import UserHeaderDesktop from "../../../components/UserHeader/UserHeaderDesktop/UserHeaderDesktop";
import UserHeaderMobile from "../../../components/UserHeader/UserHeaderMobile/UserHeaderMobile";
import KPICards from "../../../components/Dashboard/Cards/KPICards/KPICards";

import "./style.css"
import { useMediaQuery } from "@mui/material";
import Chart from "../../../components/Dashboard/Charts/Chart";
import { LogoHeaderMobile } from "../../../components/LogoHeaderMobile";

export const description = "A bar chart"

const chartData = [
    { month: "Janeiro", servicos: 186 },
    { month: "Fevereiro", servicos: 305 },
    { month: "Março", servicos: 237 },
    { month: "Abril", servicos: 73 },
    { month: "Maio", servicos: 209 },
    { month: "Junho", servicos: 214 },
]


export default function Dashboard() {
    const isMobile = useMediaQuery('(max-width:1024px)');


    return (
        <>
            {!isMobile && <UserHeaderDesktop type="personal" />}
            <div className="wrapper-dashboard-personal">
                {isMobile && <div className="wrapper-dashboard-personal-logo-mobile">
                    <LogoHeaderMobile />
                </div>
                }
                <div className={`wrapper-elements-dashboard ${isMobile && "dash-mobile"}`}>
                    <div className="text-dashboard-personal">
                        <h1>Desempenho</h1>
                        <h3>Acompanhe suas métricas e resultados</h3>
                    </div>
                    <div className={`kpis-dashboard-personal${isMobile ? "-mobile" : ""}`}>
                        <KPICards isMobile={isMobile} isFull={!isMobile} title="Quantidade treinos realizados" value="20" description="Treinos realizados "
                            icon={<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-dumbbell-icon lucide-dumbbell"><path d="M17.596 12.768a2 2 0 1 0 2.829-2.829l-1.768-1.767a2 2 0 0 0 2.828-2.829l-2.828-2.828a2 2 0 0 0-2.829 2.828l-1.767-1.768a2 2 0 1 0-2.829 2.829z" /><path d="m2.5 21.5 1.4-1.4" /><path d="m20.1 3.9 1.4-1.4" /><path d="M5.343 21.485a2 2 0 1 0 2.829-2.828l1.767 1.768a2 2 0 1 0 2.829-2.829l-6.364-6.364a2 2 0 1 0-2.829 2.829l1.768 1.767a2 2 0 0 0-2.828 2.829z" /><path d="m9.6 14.4 4.8-4.8" /></svg>} />
                        <KPICards isMobile={isMobile} isFull={!isMobile} title="Porcentagem de horários disponíveis" value="20%" description="% de Horários disponíveis"
                            icon={<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-history-icon lucide-history"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M12 7v5l4 2" /></svg>} />
                        <KPICards isMobile={isMobile} isFull={true} value="R$1200" title="Receita Mensal"
                            icon={<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-dollar-sign-icon lucide-dollar-sign"><line x1="12" x2="12" y1="2" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>} />
                    </div>
                    <div className={`wrapper-charts-dashboard-personal`}>
                        <Chart data={chartData} type="bar" title="Consultorias por mês" />
                        <Chart data={chartData} type="line" title="Ganhos Mensais" />
                    </div>
                </div>
                {isMobile && <UserHeaderMobile type="personal" />}
            </div>
        </>
    )
}