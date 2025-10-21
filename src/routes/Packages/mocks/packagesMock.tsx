import type { PackagesCardType } from "../../../models/packagesCardType";

export const packagesMock: PackagesCardType[] = [
    {
        title: "Pacote Mensal",
        subtitle: "Esse pacote é adquirido de forma única e não possui cobrança automática.",
        imageUrl: "", 
        price: "R$200",
        duration: "1 mês",
        benefits: [
            "Treino personalizado (visando o seu objetivo);",
            "Anamnese;",
            "Feedback diário."
        ],
        titlebtn: "Comprar",
        onClick: () => {
            alert("Pacote Mensal Adquirido!");
        },
        typeUser: "usuario"  

    },

    {
        title: "Pacote Trimestral",
        subtitle: "Esse pacote é adquirido de forma única e não possui cobrança automática.",
        imageUrl: "", 
        price: "R$500",
        duration: "3 meses",
        benefits: [
            "Treino personalizado (visando o seu objetivo);",
            "Anamnese;",
            "Feedback diário;",
            "1 aula grátis com o personal por mês (3 aulas no total)."
        ],
        titlebtn: "Comprar",
        onClick: () => {
            alert("Pacote Trimestral Adquirido!");
        },
        typeUser: "usuario"  

    },

    {
        title: "Pacote Semestral",
        subtitle: "Esse pacote é adquirido de forma única e não possui cobrança automática.",
        imageUrl: "", 
        price: "R$700",
        duration: "6 meses",
        benefits: [
            "Treino personalizado (visando o seu objetivo);",
            "Anamnese;",
            "Feedback diário;",
            "1 aula grátis com o personal por mês (6 aulas no total);",
            "Dicas de suplementação."
        ],
        titlebtn: "Comprar",
        onClick: () => {
            alert("Pacote Semestral Adquirido!");
        },
        typeUser: "usuario"  

    },

    {
        title: "Pacote Anual",
        subtitle: "Esse pacote é adquirido de forma única e não possui cobrança automática.",
        imageUrl: "", 
        price: "R$2.000",
        duration: "12 meses",
        benefits: [
            "Treino personalizado (visando o seu objetivo);",
            "Anamnese;",
            "Feedback diário;",
            "1 aula grátis com o personal por mês (12 aulas no total);",
            "Dicas de suplementação;",
            "Indicações de nutricionistas."
        ],
        titlebtn: "Comprar",
        onClick: () => {
            alert("Pacote Anual Adquirido!");
        },
        typeUser: "usuario"  

    }
]