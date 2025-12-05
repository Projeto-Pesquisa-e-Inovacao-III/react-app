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

export type ScheduleAfterInserted = {
    agendamentoId: number,
    dataInicio: Date | string,
    dataFim: Date | string,
    descricao: string,
    tipoAula: string,
    status: string,
    endereco: {
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
