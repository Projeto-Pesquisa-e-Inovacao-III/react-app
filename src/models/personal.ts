export type PersonalDTO = {
        nome: string;
    sexo: string;
    email: string;
    telefones?: {
        id: number;
        ddd: string;
        numero: string;
        pais: string;
    }[];
    dataNascimento?: string;
    caminhoFoto?: string;
};


export type HorariosPersonal = {
    "inicio": string
    "fim": string
}[];
    