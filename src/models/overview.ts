export type appointmentsCards = {
    "agendamentoId": number,
    "agendamentoStatus": "APROVADO" | "PENDENTE_CLIENTE_APROVACAO" | "PENDENTE_PERSONAL_APROVACAO" | "CONCLUIDO" | "PENDENTE_PERSONAL_CONCLUIR" | "CANCELADO_CLIENTE" | "CANCELADO_PERSONAL" | "AUSENCIA_CLIENTE" | "AUSENCIA_PERSONAL",
    "data": string,
    "datafim": string,
    "personalNome": string,
    "alunoNome": string,
    "caminhoFoto": string,
    "tipoAula": string,
    "endereco": {
        "numero": string,
        "bairro": string,
        "cidade": string,
        "uf": string
    }
}[];


