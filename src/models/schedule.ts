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
    idAgendamento?: number,
    agendamentoId: number,
    data: string,
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


export type ScheduleReschedule = {
    idAgendamento?: number,
    data: string,
    descricao: string,
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