import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export type AddressState = {
    postalCode: string;
    address: string;
    city: string;
    state: string;
    number: string;
    complement: string;
};

export function useAddressLookup(initialData: AddressState) {
    const [addressData, setAddressData] = useState<AddressState>(initialData);
    const [loading, setLoading] = useState(false);
    const debounceTimer = useRef<NodeJS.Timeout>(null);

    useEffect(() => {
        const cleanCep = addressData.postalCode.replace(/\D/g, "");
        
        if (cleanCep.length === 8) {
            if (debounceTimer.current) clearTimeout(debounceTimer.current);

            debounceTimer.current = setTimeout(() => {
                setLoading(true);
                axios.get(`https://viacep.com.br/ws/${cleanCep}/json/`)
                    .then(response => {
                        if (!response.data.erro) {
                            setAddressData(prev => ({
                                ...prev,
                                address: `${response.data.logradouro} - ${response.data.bairro}`,
                                city: response.data.localidade,
                                state: response.data.uf
                            }));
                        }
                    })
                    .catch(error => console.error("CEP lookup failed:", error))
                    .finally(() => setLoading(false));
            }, 500);
        }

        return () => {
            if (debounceTimer.current) clearTimeout(debounceTimer.current);
        };
    }, [addressData.postalCode]);

    return { addressData, setAddressData, isLoading: loading };
}
