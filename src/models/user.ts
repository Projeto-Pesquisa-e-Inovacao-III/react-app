export type UserDTO = {
    id?: string;
    nome: string;
    sexo: string;
    dataNascimento: string;
    email: string;
    senha: string;
    cpf?: string;
    telefone?: {
        ddd: string;
        numero: string;
        pais: string;
    };
}

export type UserDTOSprint2 = {
    nome: string;
    sobrenome: string;
    email: string;
    cpf: string;
    telefone: string;
    genero: string;
    senha: string;
    confirmarSenha: string;
}