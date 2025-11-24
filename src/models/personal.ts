export type PersonalDTO = {
        nome: string;
    sexo: string;
    email: string;
    cref?: string;
    telefone?: {
        ddd: string;
        numero: string;
        pais: string;
    };
    dataNascimento: string;
    senha: string;
}