
import axios from "axios";
import { UserDTO } from "../models/user";
import { HOST } from "../system";

export function register(userdata: UserDTO) {
   return axios.post(`${HOST}/usuarios/cadastrar`, userdata)
}

export function login(email: string, password: string) {
   return axios.post(`${HOST}/usuarios/login`, {email: email, password: password})
}

export function update(userdata: UserDTO) {
   return axios.put(`${HOST}/usuarios/atualizar/${userdata.id}`, userdata)
}

export function deleteUser(id: string) {
   return axios.delete(`${HOST}/usuarios/deletar/${id}`)
}