import type { Schedule } from "../models/schedule";
import { api } from "../system";

export function insertAppointment(data: Schedule) {
    return api.post("/agendamentos", data);
}

export function updateAppointment(data: any) {
    return api.put("/agendamentos/reagendar", data);
}

export function cancelAppointment(data: any) {
    return api.put("/agendamentos/cancelar", data);
}

export function doneAppointment(data: any) {
    return api.put("/agendamentos/concluir", data);
}

export function reportAbsenceStudent(data: any) {
    return api.put("/agendamentos/relatar-ausencia/aluno", data);
}

export function reportAbsencePersonal(data: any) {
    return api.put("/agendamentos/relatar-ausencia/personal", data);
}

export function findUserAppointments() {
    return api.get("/agendamentos/me");
}

export function findPersonalRequests() {
    return api.get("/agendamentos/solicitacoes");
}

export function appointmentAtCalendar() {
    return api.get("/agendamentos/calendario");
}

export function findAppointmentById(id: number) {
    return api.get(`/agendamentos/${id}`);
}
