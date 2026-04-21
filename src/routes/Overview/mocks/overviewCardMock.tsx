export const cardsArray = (nav: (path: string) => void) => [
    {
        title: "Aulas para realizar hoje",
        subtitle: "5",
        type: "",
        titletbn: "Agendar",
        onClick: () => nav("/schedule"),
        typeUser: "personal",
    },
    {
        title: "Solicitações de agendamentos pendentes",
        subtitle: "5",
        type: "",
        titletbn: "Ir Para Solicitações",
        onClick: () => nav("/personal/check-schedule"),
        typeUser: "personal",
    },
    {
        title: "Agendamentos Restantes",
        subtitle: "2",
        type: "",
        titletbn: "Agendamentos",
        onClick: () => nav("/schedule"),
        typeUser: "usuario",
    },
    {
        title: "Status de planos",
        subtitle: "Não possui assinatura",
        type: "",
        titletbn: "Planos",
        onClick: () => nav("/packages"),
        typeUser: "usuario",
    },
];