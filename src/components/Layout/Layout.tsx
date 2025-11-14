import UserHeaderMobile from "../UserHeader/UserHeaderMobile/UserHeaderMobile";
import UserHeaderDesktop from "../UserHeader/UserHeaderDesktop/UserHeaderDesktop";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { isAuthenticated } from "../../services/authService";
import { LogoHeaderMobile } from "../LogoHeaderMobile/LogoHeaderMobile";
import { TypeContext } from "../../App";
import useMobile from "../../hooks/isMobile";


const titles = {
    "/": "Início | CSF Treinamentos",
    "/login": "Login | CSF Treinamentos",
    "/register": "Cadastro | CSF Treinamentos",
    "/forgot-password": "Esqueci a senha | CSF Treinamentos",
    "/logout": "Saindo... | CSF Treinamentos",
    "/plans-history": "Histórico de Planos | CSF Treinamentos",
    "/schedule-history": "Histórico de Agendamentos | CSF Treinamentos",
    "/schedule-details": "Detalhes do Agendamento | CSF Treinamentos",
    "/plans-history-details": "Detalhes do Plano | CSF Treinamentos",
    "/schedule": "Agenda | CSF Treinamentos",
    "/packages": "Pacotes | CSF Treinamentos",
    "/home": "Visão Geral | CSF Treinamentos",
    "/dashboard": "Dashboard | CSF Treinamentos",
    "/users": "Usuários | CSF Treinamentos",
    "/users/view-user-data": "Dados do Usuário | CSF Treinamentos",
    "/edit-user": "Editar Usuário | CSF Treinamentos",
    "/personal/check-schedule": "Solicitações | CSF Treinamentos",
    "/more-options": "Mais Opções | CSF Treinamentos",
};

export default function Layout() {
    const isMobile = useMobile();
    const Header = isMobile ? UserHeaderMobile : UserHeaderDesktop;
    const isLogged = isAuthenticated();

    const nav = useNavigate();

    const type = useContext(TypeContext);

    const location = useLocation();

    const hideLogoPaths = ["/more-options", "/", "/login", "/forgot-password", "/register", "/logout"].includes(location.pathname);
    const exceptions = ["/", "/login", "/register", "/forgot-password"];

    useEffect(() => {
        document.title = titles[location.pathname as keyof typeof titles] || "Meu App";
    }, [location.pathname]);

    // useEffect(() => {
    //     if (!isLogged) {
    //         nav("/login");
    //     }
    // }, []);


    return (
        <div>
            {/* {isLogged && ( */}
                <>
                    {!isMobile && !exceptions.includes(location.pathname) && <Header type={type} />}
                    {isMobile && !hideLogoPaths && <div className="logo_header_mobile">
                        <LogoHeaderMobile />
                    </div>}
                    <main className={`${!hideLogoPaths ? "layout_main_outlet" : ""}`}><Outlet context={type} /></main>
                    {isMobile && !exceptions.includes(location.pathname) && <Header type={type} />}
                </>
            {/* )} */}
        </div>
    )
}