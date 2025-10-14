import type {AppointmentCardType} from "../../../models/appointmentCardType.ts";

export const appointmentCardsData: AppointmentCardType[] = [
    {
        status: "Confirmado",
        name: "João Silva",
        photoUrl: "https://randomuser.me/api/portraits/men/1.jpg",
        date: "2024-07-10",
        time: "14:00"
    },
    {
        status: "Pendente",
        name: "Maria Souza",
        photoUrl: "https://randomuser.me/api/portraits/men/1.jpg",
        date: "2024-07-12",
        time: "09:30"
    },
    {
        status: "Cancelado",
        name: "Carlos Lima",
        photoUrl: "https://randomuser.me/api/portraits/men/1.jpg",
        date: "2024-07-15",
        time: "16:00"
    }
];
