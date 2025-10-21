import type { PackagesCardType } from "../../../models/packagesCardType";

export const packagesMockAdicional: PackagesCardType[] = [
    {
        title: "Aulas com Personal",
        subtitle: "As aulas com personal são cobradas separadamente da consultoria.",
        imageUrl: "", 
        price: "R$120",
        duration: "por aula",
        benefits: [
            "Treinos individuais com personal na academia, com duração de 1 hora a aula.",
        ],
        titlebtn: "Adicionar",
        onClick: () => {
            alert("Aulas com Personal Adicionadas!");
        },
        typeUser: "usuario" 
    },
    {
        title: "Personal Residencial",
        subtitle: "As aulas com personal são cobradas separadamente da consultoria.",
        imageUrl: "", 
        price: "R$200",
        duration: "por aula",
        benefits: [
            "Atendimento personalizado em sua residência, com duração de 1 hora por aula.",
        ],
        titlebtn: "Adicionar",
        onClick: () => {
            alert("Personal Residencial Adicionado!");
        },
        typeUser: "usuario" 
    },
    {
        title: "Aula Funcional",
        subtitle: "As aulas funcionais são cobradas separadamente da consultoria.",
        imageUrl: "", 
        price: "R$100",
        duration: "por aula",
        benefits: [
            "Treinos coletivos focados em condicionamento físico e resistência com 30 minutos de aula.",
        ],
        titlebtn: "Adicionar",
        onClick: () => {
            alert("Aula Funcional Adicionada!");
        },
        typeUser: "usuario" 
    }
];