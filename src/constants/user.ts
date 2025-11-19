
import type { UpdateUserDTO, UserDTO } from "../models/user";
import { api } from "../system";

export function findByEmail(email: string) {
   return api.get(`/usuarios/email/${email}`)
}

export function findUserData() {
   return api.get(`/usuarios/me`)
}

export function getUserImage() {
   return api.get(`/usuarios/me/imagem`)
}

export function getUserImageByName(name: string) {
   return api.get(`/usuarios/foto/${name}`)
}

export function removerUserImage() {
   return api.delete(`/usuarios/me/imagem`)
}

export function insertUserImage(imageData: FormData) {
   return api.post(`/usuarios/me/imagem`, imageData)
}

export function update(userdata: UpdateUserDTO) {
   return api.put(`/alunos/me`, userdata)
}

export function register(userdata: UserDTO) {
   return api.post(`/alunos/cadastro`, userdata)
}

export function login(email: string, password: string) {
   return api.post(`/usuarios/login`, { email: email, senha: password })
}

export function softDelete(id: string) {
   return api.patch(`/usuarios/${id}`)
}

export function logout() {
   return api.get(`/usuarios/logout`)
}

export function sendResetCode(number: string) {
   return api.post(`/api/password-reset/send-code`, { number: `+55${number}` })
}

export function changePassword(oldPassword: string, newPassword: string) {
   return api.post(`/usuarios/mudar-senha`, { senhaAntiga: oldPassword, senhaNova: newPassword })
}