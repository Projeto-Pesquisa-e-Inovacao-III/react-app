
import axios from "axios";
import { UserDTO } from "../models/user";
import { HOST } from "../system";

export function register(userdata: UserDTO) {
   return axios.post(`${HOST}/register`, userdata)
}

export function login(email: string, password: string) {
   return axios.post(`${HOST}/login`, {email: email, password: password})
}

export function update(id: string, userdata: UserDTO) {
   return axios.put(`${HOST}/usuarios/${id}`, userdata)
}

export function softDelete(id: string) {
   return axios.patch(`${HOST}/usuarios/${id}`)
}