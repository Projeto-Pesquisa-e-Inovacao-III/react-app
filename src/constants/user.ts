
import type { UserDTO } from "../models/user";
import { api } from "../system";

export function findByEmail(email: string) {
   return api.get(`/usuarios/email/${email}`)
}

export function findUserData() {
   return api.get(`/usuarios/me`)
}

export function register(userdata: UserDTO) {
   return api.post(`/alunos/cadastro`, userdata)
}

export function login(email: string, password: string) {
   return api.post(`/usuarios/login`, { email: email, senha: password })
}

export function update(id: string, userdata: UserDTO) {
   return api.put(`/usuarios/${id}`, userdata)
}

export function softDelete(id: string) {
   return api.patch(`/usuarios/${id}`)
}

export function logout() {
   return api.get(`/usuarios/logout`)
}