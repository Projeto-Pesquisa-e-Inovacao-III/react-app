import type { Address } from "../models/address";
import { api } from "../system";

export async function createAddress(addressData: Address) {
    return api.post(`/enderecos`, addressData)
}

export async function getUserAddresses() {
    return api.get(`/enderecos`)
}

export async function updateUserAddress(id: number, addressData: Address) {
    return api.put(`/enderecos/${id}`, addressData)
}

export async function deleteUserAddress(id: number) {
    return api.delete(`/enderecos/${id}`)
}