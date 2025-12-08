import KPICards from "../../../components/Dashboard/Cards/KPICards/KPICards";

import styles from "./Dashboard.module.css"
import { useMediaQuery } from "@mui/material";
import Chart from "../../../components/Dashboard/Charts/Chart";
import classnames from "classnames";
import useMobile from "../../../hooks/isMobile";
import { useState } from "react";
import { set } from "date-fns";
import { getConsultingSessions, getPlansSalesQuantity, getQuantityofActiveStudents, getQuantityofInactiveStudents, getSalesQuantity } from "../../../constants/dashboard";
import { useEffect } from "react";

export const description = "A bar chart"

const mesesNomes = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

export default function Dashboard() {
    const isMobile = useMobile();

    const [quantitySessionInMonth, setQuantitySessionInMonth] = useState<any>();
    const [sallesCount, setSallesCount] = useState<any[]>([]);
    const [plansSalesQuantity, setPlansSalesQuantity] = useState<any>();
    const [activeStudentsCount, setActiveStudentsCount] = useState<any>();
    const [inactiveStudentsCount, setInactiveStudentsCount] = useState<any>();
    const [percentualInactiveStudents, setPercentualInactiveStudents] = useState<any>();

    async function fetchQuantitySessionInMonth() {
        try {
            const result = await getConsultingSessions();

            setQuantitySessionInMonth(result.data.map((item: any) => ({
                month: mesesNomes[item.mes - 1],
                servicos: item.totalConsultorias
            })));

        } catch (error) {
            console.error("Erro ao buscar dados:", error);
        }
    }

    async function fetchPlansSalesQuantity() {
        try {
            const result = await getPlansSalesQuantity();
            setPlansSalesQuantity(result.data);

        } catch (error) {
            console.error("Erro ao buscar dados:", error);
        }
    }

    async function fetchSalesCount() {
        try {
            const result = await getSalesQuantity();
            const salesData = result.data;

            setSallesCount(salesData.map((item: any) => ({
                month: mesesNomes[item.mes - 1],
                servicos: item.totalPreco
            })));

        } catch (error) {
            console.error("Erro ao buscar dados:", error);
        }
    }



    async function fetchgetQuantityofActiveStudents() {
        try {
            const result = await getQuantityofActiveStudents();
            setActiveStudentsCount(result.data.quantidadeAlunos);

        } catch (error) {
            console.error("Erro ao buscar dados:", error);
        }

    }

    async function fetchQuantityofInactiveStudents() {
        try {
            const result = await getQuantityofInactiveStudents();
            setInactiveStudentsCount(result.data.quantidadeAlunos);
            setPercentualInactiveStudents(result.data.percentualAlunos);
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
        }
    }


    useEffect(() => {
        fetchQuantitySessionInMonth(); //lista a quantidade de consultorias realizadas nos ultimos 30 dias
        fetchPlansSalesQuantity(); //Pega a quantidade de planos vendidos nos ultimos 30 dias
        fetchSalesCount(); //lista as vendas por mês
        fetchgetQuantityofActiveStudents(); //Pega a quantidade de alunos ativos
        fetchQuantityofInactiveStudents(); //Pega a quantidade de alunos inativos
    }, []);

    return (
        <>
            <div className={styles.wrapperDashboardPersonal}>
                <div className={classnames(styles.wrapperElementsDashboard, { [styles.dashMobile]: isMobile })}>
                    <div className={styles.textDashboardPersonal}>
                        <h1>Desempenho</h1>
                        {/* <h3>Acompanhe suas métricas e resultados</h3> */}
                    </div>
                    <div className={classnames(styles.kpisDashboardPersonal, { [styles.kpisDashboardPersonalMobile]: isMobile })}>
                        <KPICards isMobile={isMobile} isFull={!isMobile} title="Alunos com planos ativos" value={activeStudentsCount} description="Alunos ativos"
                            icon={<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-dumbbell-icon lucide-dumbbell"><path d="M17.596 12.768a2 2 0 1 0 2.829-2.829l-1.768-1.767a2 2 0 0 0 2.828-2.829l-2.828-2.828a2 2 0 0 0-2.829 2.828l-1.767-1.768a2 2 0 1 0-2.829 2.829z" /><path d="m2.5 21.5 1.4-1.4" /><path d="m20.1 3.9 1.4-1.4" /><path d="M5.343 21.485a2 2 0 1 0 2.829-2.828l1.767 1.768a2 2 0 1 0 2.829-2.829l-6.364-6.364a2 2 0 1 0-2.829 2.829l1.768 1.767a2 2 0 0 0-2.828 2.829z" /><path d="m9.6 14.4 4.8-4.8" /></svg>} />
                        <KPICards isMobile={isMobile} isFull={!isMobile} title="Vendas dos ultimos 30 dias" value={plansSalesQuantity} description="Vendas dos ultimos 30 dias"
                            icon={<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-history-icon lucide-history"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M12 7v5l4 2" /></svg>} />


                        <KPICards isMobile={isMobile} isFull={true} value={inactiveStudentsCount} title="Alunos sem planos ativos"
                            icon={<svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18.4993 18.5001C16.8035 18.5001 15.3518 17.8963 14.1441 16.6886C12.9365 15.481 12.3327 14.0292 12.3327 12.3334C12.3327 10.6376 12.9365 9.18585 14.1441 7.97821C15.3518 6.77057 16.8035 6.16675 18.4993 6.16675C20.1952 6.16675 21.6469 6.77057 22.8546 7.97821C24.0622 9.18585 24.666 10.6376 24.666 12.3334C24.666 14.0292 24.0622 15.481 22.8546 16.6886C21.6469 17.8963 20.1952 18.5001 18.4993 18.5001ZM6.16602 30.8334V26.5167C6.16602 25.6431 6.39084 24.8402 6.84049 24.1079C7.29015 23.3756 7.88754 22.8167 8.63268 22.4313C10.2257 21.6348 11.8445 21.0374 13.4889 20.6391C15.1334 20.2409 16.8035 20.0417 18.4993 20.0417C20.1952 20.0417 21.8653 20.2409 23.5098 20.6391C25.1542 21.0374 26.773 21.6348 28.366 22.4313C29.1112 22.8167 29.7085 23.3756 30.1582 24.1079C30.6079 24.8402 30.8327 25.6431 30.8327 26.5167V30.8334H6.16602ZM9.24935 27.7501H27.7493V26.5167C27.7493 26.2341 27.6787 25.9772 27.5374 25.7459C27.3961 25.5147 27.2098 25.3348 26.9785 25.2063C25.591 24.5126 24.1907 23.9923 22.7775 23.6454C21.3643 23.2985 19.9382 23.1251 18.4993 23.1251C17.0605 23.1251 15.6344 23.2985 14.2212 23.6454C12.808 23.9923 11.4077 24.5126 10.0202 25.2063C9.78893 25.3348 9.60265 25.5147 9.46133 25.7459C9.32001 25.9772 9.24935 26.2341 9.24935 26.5167V27.7501ZM18.4993 15.4167C19.3473 15.4167 20.0731 15.1148 20.677 14.511C21.2808 13.9072 21.5827 13.1813 21.5827 12.3334C21.5827 11.4855 21.2808 10.7596 20.677 10.1558C20.0731 9.55199 19.3473 9.25008 18.4993 9.25008C17.6514 9.25008 16.9256 9.55199 16.3217 10.1558C15.7179 10.7596 15.416 11.4855 15.416 12.3334C15.416 13.1813 15.7179 13.9072 16.3217 14.511C16.9256 15.1148 17.6514 15.4167 18.4993 15.4167Z" fill="#1D1B20" />
                            </svg>
                            } />
                        <KPICards isMobile={isMobile} isFull={true} value={`${percentualInactiveStudents}%`} title="Percentual planos inativos"
                            icon={<svg width="39" height="39" viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M34.6361 19.6586C34.6361 22.6521 33.7484 25.5784 32.0853 28.0674C30.4222 30.5564 28.0584 32.4964 25.2928 33.642C22.5271 34.7875 19.4839 35.0873 16.5479 34.5033C13.6119 33.9192 10.915 32.4777 8.79831 30.361C6.68158 28.2443 5.24007 25.5474 4.65606 22.6114C4.07206 19.6754 4.37179 16.6322 5.51736 13.8666C6.66292 11.1009 8.60287 8.73708 11.0919 7.07398C13.5809 5.41087 16.5072 4.52319 19.5007 4.52319C21.4884 4.52294 23.4566 4.91426 25.2931 5.6748C27.1295 6.43534 28.7981 7.5502 30.2036 8.9557C31.6091 10.3612 32.724 12.0298 33.4845 13.8663C34.2451 15.7027 34.6364 17.671 34.6361 19.6586ZM14.5473 18.2305C15.2324 18.2305 15.902 18.0274 16.4717 17.6469C17.0413 17.2663 17.4853 16.7254 17.7475 16.0925C18.0098 15.4597 18.0785 14.7632 17.945 14.0913C17.8115 13.4194 17.4818 12.8021 16.9975 12.3176C16.5132 11.8331 15.8961 11.503 15.2243 11.3691C14.5524 11.2352 13.856 11.3036 13.223 11.5655C12.5899 11.8274 12.0488 12.2711 11.6679 12.8405C11.287 13.4099 11.0836 14.0795 11.0832 14.7645C11.0837 15.6833 11.4488 16.5643 12.0982 17.2141C12.7477 17.864 13.6285 18.2295 14.5473 18.2305ZM14.5473 16.1104C14.2811 16.1104 14.0209 16.0315 13.7996 15.8836C13.5782 15.7357 13.4057 15.5255 13.3039 15.2796C13.202 15.0336 13.1753 14.763 13.2273 14.5019C13.2792 14.2409 13.4074 14.0011 13.5956 13.8128C13.7838 13.6246 14.0237 13.4964 14.2847 13.4445C14.5458 13.3926 14.8164 13.4192 15.0623 13.5211C15.3083 13.623 15.5185 13.7955 15.6664 14.0168C15.8142 14.2381 15.8932 14.4983 15.8932 14.7645C15.8927 15.1213 15.7507 15.4634 15.4984 15.7156C15.2461 15.9679 14.9041 16.1099 14.5473 16.1104ZM25.4826 13.4301C25.6011 13.2651 25.6851 13.078 25.7298 12.8799C25.7745 12.6818 25.7788 12.4767 25.7426 12.2769C25.7064 12.077 25.6303 11.8865 25.519 11.7167C25.4076 11.5468 25.2632 11.4011 25.0944 11.2882C24.9256 11.1753 24.7358 11.0976 24.5363 11.0595C24.3368 11.0215 24.1317 11.024 23.9331 11.0669C23.7346 11.1098 23.5468 11.1921 23.3807 11.3091C23.2147 11.4261 23.0739 11.5752 22.9667 11.7478L13.5532 25.8413C13.334 26.1752 13.2556 26.5822 13.3351 26.9736C13.4147 27.3651 13.6456 27.7092 13.9777 27.9311C14.3098 28.153 14.7162 28.2347 15.1083 28.1584C15.5003 28.0821 15.8464 27.8539 16.071 27.5236L25.4826 13.4301ZM27.9411 24.5891C27.9411 23.9039 27.738 23.2342 27.3573 22.6645C26.9767 22.0948 26.4357 21.6508 25.8027 21.3886C25.1697 21.1265 24.4732 21.0579 23.8012 21.1915C23.1292 21.3252 22.512 21.6551 22.0275 22.1396C21.543 22.624 21.2131 23.2413 21.0795 23.9133C20.9458 24.5852 21.0144 25.2818 21.2766 25.9147C21.5388 26.5477 21.9828 27.0887 22.5524 27.4694C23.1221 27.85 23.7919 28.0532 24.477 28.0532C25.3954 28.0522 26.276 27.6869 26.9254 27.0375C27.5748 26.388 27.9401 25.5075 27.9411 24.5891ZM25.821 24.5891C25.821 24.8553 25.742 25.1156 25.594 25.337C25.446 25.5584 25.2357 25.7309 24.9897 25.8327C24.7437 25.9345 24.4729 25.961 24.2118 25.909C23.9507 25.8569 23.7109 25.7285 23.5227 25.5401C23.3346 25.3517 23.2066 25.1117 23.1548 24.8505C23.1031 24.5893 23.1301 24.3186 23.2322 24.0727C23.3344 23.8268 23.5072 23.6167 23.7288 23.4691C23.9503 23.3214 24.2107 23.2428 24.477 23.2432C24.8335 23.2442 25.175 23.3864 25.4269 23.6386C25.6788 23.8909 25.8205 24.2326 25.821 24.5891Z" fill="black" />
                            </svg>
                            } />
                    </div>


                    <div className={styles.wrapperChartsDashboardPersonal}>
                        <Chart data={quantitySessionInMonth} type="bar" title="Consultorias por mês" titleY="Quantidade de consultorias" titleX="Mês" legend="Consultorias" ooffsetY={1} />
                        <Chart data={sallesCount} type="line" title="Ganhos Mensais" titleY="Quantidade de vendas em R$" titleX="Mês" legend="Ganhos" ooffsetY={15} />
                    </div>
                </div>
            </div>
        </>
    )
}