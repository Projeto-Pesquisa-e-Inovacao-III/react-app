type Plan = {
    title: string;
    subtitle: string;
    headerTitle: string;
    date: string;
}

export const PlansHistoryMock: Plan[] = [
    {
        title: "Plano Mensal",
        subtitle: "Válido até 20 de Fevereiro de 2023",
        headerTitle: "20 de Janeiro de 2023",
        date: "2023-01-20"
    },
    {
        title: "Plano Mensal",
        subtitle: "Válido até 20 de Novembro de 2025",
        headerTitle: "20 de Novembro de 2025",
        date: "2025-11-20"
    },
    {
        title: "Plano Trimestral",
        subtitle: "Válido até 20 de Maio de 2023",
        headerTitle: "20 de Fevereiro de 2023",
        date: "2023-02-20"
    },
    {
        title: "Plano Semestral",
        subtitle: "Válido até 20 de Agosto de 2023",
        headerTitle: "20 de Março de 2023",
        date: "2023-03-20"
    },
    {
        title: "Plano Anual",
        subtitle: "Válido até 20 de Março de 2024",
        headerTitle: "20 de Abril de 2023",
        date: "2023-04-20"
    },
    {
        title: "Plano Vitalício",
        subtitle: "Válido para toda a vida",
        headerTitle: "21 de Novembro de 2025",
        date: "2025-11-21"
    }
]