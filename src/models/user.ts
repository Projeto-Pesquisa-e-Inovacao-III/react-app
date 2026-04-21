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

export type UpdateUserDTO = {
    nome: string;
    sexo: string;
    email: string;
    telefone?: {
        ddd: string;
        numero: string;
        pais: string;
    };
    telefones?: [{
        numero: string;
        ddd: string;
        id: number;
    }];
}

// export type UserDTOSprint2 = {
//     nome: string;
//     sobrenome: string;
//     email: string;
//     cpf: string;
//     telefone: string;
//     genero: string;
//     senha: string;
//     confirmarSenha: string;
// }