import UserHeaderMobile from "../UserHeader/UserHeaderMobile/UserHeaderMobile";
import UserHeaderDesktop from "../UserHeader/UserHeaderDesktop/UserHeaderDesktop";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { LogoHeaderMobile } from "../LogoHeaderMobile/LogoHeaderMobile";
import { TypeContext } from "../../App";
import useMobile from "../../hooks/isMobile";
import { isAuthenticated } from "../../constants/user";
import { useQuery, useQueryClient } from "@tanstack/react-query";


const titles = {
    "*": "Carregando... | CSF Treinamentos",
    "/": "Início | CSF Treinamentos",
    "/login": "Login | CSF Treinamentos",
    "/register": "Cadastro | CSF Treinamentos",
    "/forgot-password": "Esqueci a senha | CSF Treinamentos",
    "/logout": "Saindo... | CSF Treinamentos",
    "/plans-history": "Histórico de compra | CSF Treinamentos",
    "/schedule": "Agenda | CSF Treinamentos",
    "/schedule/": "Agenda | CSF Treinamentos",
    "/schedule-history": "Histórico de Agendamentos | CSF Treinamentos",
    "/schedule-history/": "Histórico de Agendamentos | CSF Treinamentos",
    "/schedule-details": "Detalhes do Agendamento | CSF Treinamentos",
    "/schedule-details/": "Detalhes do Agendamento | CSF Treinamentos",
    "/plans-history-details": "Detalhes do Plano | CSF Treinamentos",
    "/packages": "Pacotes | CSF Treinamentos",
    "/home": "Visão Geral | CSF Treinamentos",
    "/dashboard": "Dashboard | CSF Treinamentos",
    "/users": "Usuários | CSF Treinamentos",
    "/users/view-user-data": "Dados do Usuário | CSF Treinamentos",
    "/edit-user": "Editar Usuário | CSF Treinamentos",
    "/edit-user/security": "Editar Usuário | CSF Treinamentos",
    "/personal/check-schedule": "Solicitações | CSF Treinamentos",
    "/more-options": "Mais Opções | CSF Treinamentos",
    "/set-availability": "Definir Horário | CSF Treinamentos",
    "/anamnesis": "Anamnese | CSF Treinamentos",
    "/edit-user/anamnesis": "Editar Anamnese | CSF Treinamentos",
};

const exceptions = ["/", "/login", "/register", "/forgot-password", "/logout", "/no-code-tool", "/anamnesis"];

export default function Layout() {
    const isMobile = useMobile();
    const Header = isMobile ? UserHeaderMobile : UserHeaderDesktop;

    const nav = useNavigate();

    const location = useLocation();
    const queryClient = useQueryClient();
    useEffect(() => {
        queryClient.invalidateQueries({ queryKey: ["isAuthenticated"] });
        document.title = titles[location.pathname as keyof typeof titles] || "Meu App";
    }, [location.pathname]);

    const hideLogoPaths = [...exceptions, "/more-options"].includes(location.pathname);

    const isLoggedIn = useQuery({
        queryKey: ["isAuthenticated"],
        queryFn: () => isAuthenticated(),
        retry: false,
        refetchOnWindowFocus: false,
        select: (res) => res.data,
    });

    const context = useContext(TypeContext);

    if (!context) throw new Error("TypeContext não encontrado");

    const { type, setType } = context;

    useEffect(() => {
        console.log("logado e nao carregando", !isLoggedIn.isLoading && !isLoggedIn.data?.autentificado)
        console.log("erro e nao carregando", isLoggedIn.isError && !isLoggedIn.isLoading)
        const notAuthenticated = (!isLoggedIn.isLoading && !isLoggedIn.data?.autentificado);
        if (notAuthenticated && !exceptions.includes(location.pathname)) {
            nav("/login");
        }
    }, [isLoggedIn, location.pathname, isLoggedIn.data, isLoggedIn.isError, isLoggedIn.isLoading, type, nav]);

    useEffect(() => {
        if (isLoggedIn.data?.autentificado) {
            const backendType = isLoggedIn.data.user.tipo.toLowerCase();
            setType(backendType === "personal" ? "personal" : "aluno");
        }
    }, [isLoggedIn.data]);

    // useEffect(() => {
    //     if (isLoggedIn.isLoading || !isLoggedIn.data) return;

    //     const ativoAnamnese = isLoggedIn.data?.ativoAnamnese;
    //     console.log("ativoAnamnese", !ativoAnamnese && !exceptions.includes(location.pathname) && type === "aluno");
    //     if (!ativoAnamnese && !exceptions.includes(location.pathname) && type === "aluno") {
    //         nav("/anamnesis");
    //     }
    // }, [isLoggedIn.data, isLoggedIn.isLoading, location.pathname, nav, type]);

    return (
        <div>
            <>
                {!isMobile && !exceptions.includes(location.pathname) && <Header userName={isLoggedIn.data?.user.nome} type={type} isLoading={isLoggedIn.isLoading} />}
                {isMobile && !hideLogoPaths && <div className="logo_header_mobile">
                    <LogoHeaderMobile />
                </div>}
                <main className={`${!hideLogoPaths ? "layout_main_outlet" : ""}`}><Outlet context={type} /></main>
                {isMobile && !exceptions.includes(location.pathname) && <Header type={type} isLoading={isLoggedIn.isLoading} />}
            </>
        </div>
    )
}