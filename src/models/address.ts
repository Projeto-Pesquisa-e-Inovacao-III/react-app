export type Address = {
    id?: number;
    apelido?: string;
    tipo: string;
    numero: string;
    complemento?: string;
    unidade?: string;
    logradouro?: string;
    bairro?: string;
    padrao?: boolean;
    cep: {
        id: string;
        cep?: string;
        logradouro?: string;
        bairro?: string;
        localidade?: string;
        uf?: string;
        cidade?: {
            nome: string;
            estado?: {
                sigla: string;
            };
        };
    };
};