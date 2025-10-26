import type { AppointmentCardType } from "../../../models/appointmentCardType.ts";

export const appointmentCardsData: AppointmentCardType[] = [
    {
        status: "Confirmado",
        name: "João Silva",
        photoUrl: "https://randomuser.me/api/portraits/men/1.jpg",
        date: "10/07/2024",
        time: "14:00",
    },
    {
        status: "Pendente",
        name: "Maria Souza",
        photoUrl: "https://randomuser.me/api/portraits/women/1.jpg",
        date: "12/07/2024",
        time: "09:30",
    },
    {
        status: "Cancelado",
        name: "Carlos Lima",
        photoUrl: "https://randomuser.me/api/portraits/men/2.jpg",
        date: "15/07/2024",
        time: "16:00",
    },
];
