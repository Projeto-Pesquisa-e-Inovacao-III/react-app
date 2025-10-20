import type {OverviewCardType} from "../../../models/overviewCardType";

export const cardsArray: OverviewCardType[] = [
    {
        title: "Aulas para realizar hoje",
        subtitle: "5 aulas agendadas para hoje.",
        type: "",
        titletbn: "Agendar",
        onClick: () => alert("Ir para aulas de hoje!"),
        typeUser: "personal",
    },
    {
        title: "Solicitações de agendamentos pendentes",
        subtitle: "5 solicitações aguardando aprovação.",
        type: "",
        titletbn: "Ir Para Solicitações",
        onClick: () => alert("Ir para solicitações!"),
        typeUser: "personal",
    },
    {
        title: "Agendamentos Restantes",
        subtitle: "Você tem 2 agendamentos restantes.",
        type: "",
        titletbn: "",
        onClick: () => alert("Agendamentos clicados!"),
        typeUser: "usuario",
    },
    {
        title: "Status de planos",
        subtitle: "Não possui assinatura - Tipo de assinatura: Nenhum",
        type: "Plano atual: Nenhum",
        titletbn: "Planos",
        onClick: () => alert("Plano clicado!"),
        typeUser: "usuario",
    },
];
