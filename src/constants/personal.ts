import { api } from "../system";

export function listStudents() {
    return api.get(`/alunos`);
}