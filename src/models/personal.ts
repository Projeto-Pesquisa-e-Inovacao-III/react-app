export type PersonalDTO = {
        nome: string;
    sexo: string;
    email: string;
    telefone?: {
        ddd: string;
        numero: string;
        pais: string;
    };
}


export type HorariosPersonal = {
    "inicio": string
    "fim": string
}[];