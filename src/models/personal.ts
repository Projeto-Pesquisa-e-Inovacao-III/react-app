export type PersonalDTO = {
        nome: string;
    sexo: string;
    email: string;
    telefone?: {
        ddd: string;
        numero: string;
        pais: string;
    };
    dataNascimento?: string;
}