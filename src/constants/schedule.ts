import { api } from "../system";

export function insertAppointment(data: any) {
    return api.post("/agendamento", data);
}

export function updateAppointment(data: any) {
    return api.put("/agendamento/reagendar", data);
}

export function cancelAppointment(data: any) {
    return api.put("/agendamento/cancelar", data);
}

export function doneAppointment(data: any) {
    return api.put("/agendamento/concluir", data);
}

export function reportAbsenceStudent(data: any) {
    return api.put("/agendamento/relatar-ausencia/aluno", data);
}

export function reportAbsencePersonal(data: any) {
    return api.put("/agendamento/relatar-ausencia/personal", data);
}

export function findUserAppointments() {
    return api.get("/agendamento/buscar-usuario");
}

export function listAppointments() {
    return api.get("/agendamento/listar");
}

export function findAppointmentById(id: number) {
    return api.get(`/agendamento/${id}`);
}
