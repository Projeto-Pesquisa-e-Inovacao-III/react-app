type Plan = {
    title: string;
    subtitle: string;
    date: string;
    onClick: () => void;
    
}

export const PlansHistoryMock: Plan[] = [
    {
        title: "Plano Mensal",
        subtitle: "Válido até 20 de Fevereiro de 2023",
        date: "20 de Janeiro de 2023",
        onClick: () => {
            alert("Plano Mensal Adquirido!");
        }
    },
    {
        title: "Plano Trimestral",
        subtitle: "Válido até 20 de Maio de 2023",
        date: "20 de Fevereiro de 2023",
        onClick: () => {
            alert("Plano Trimestral Adquirido!");
        }
    },
    {
        title: "Plano Semestral",
        subtitle: "Válido até 20 de Agosto de 2023",
        date: "20 de Março de 2023",
        onClick: () => {
            alert("Plano Semestral Adquirido!");
        }
    },
    {
        title: "Plano Anual",
        subtitle: "Válido até 20 de Março de 2024",
        date: "20 de Abril de 2023",
        onClick: () => {
            alert("Plano Anual Adquirido!");
        }
    },
]