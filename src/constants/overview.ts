import { api } from "../system";

export function getTotalByClassType(classType: string) {
    return api.get(`produtos-contratados/total-tipo/${classType}
`).then(response => {
        console.log("Total by class type fetched successfully:", response.data);
        return response.data.saldoAula;
    }).catch(error => {
        console.error("Error fetching total by class type:", error);
        return 0;
    });
}
