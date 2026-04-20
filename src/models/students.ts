export type ListStudents = {
    "id": number,
    "nome": string,
    "idade": number,
    "dataNascimento"?: string,
    "caminhoFoto": string,
    "roles": string[]
}[];