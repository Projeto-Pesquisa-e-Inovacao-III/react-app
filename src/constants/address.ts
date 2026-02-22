import type { Address } from "../models/address";
import { api } from "../system";

export async function createAddress(addressData: Address) {
    return api.post(`/enderecos`, addressData)
}
