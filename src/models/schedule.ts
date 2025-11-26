export type Schedule = {
    idAgendamento?: number,
    data: Date | string,
    descricao: string,
    novoEndereco: {
        numero: string,
        complemento: string,
        unidade: string,
        tipo: string,
        cep: {
            id: string,
            logradouro: string,
            bairro: string,
            localidade: string,
            uf: string
        }
    },
    personalId: number,
    tipoAulaProdutoContratado: string
}
