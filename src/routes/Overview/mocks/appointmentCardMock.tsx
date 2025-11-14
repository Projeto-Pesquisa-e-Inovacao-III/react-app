import type { AppointmentCardType } from "../../../models/appointmentCardType.ts";

export const appointmentCardsData: AppointmentCardType[] = [
    {
        status: "Confirmado",
        name: "João Silva",
        photoUrl: "https://randomuser.me/api/portraits/men/1.jpg",
        date: "10/07/2024",
        type: "Personal",
        address: "Rua A, 123",
        time: "14:00",
    },
    {
        status: "Pendente",
        name: "Maria Souza",
        photoUrl: "https://randomuser.me/api/portraits/women/1.jpg",
        date: "12/07/2024",
        type: "Funcional",
        address: "Avenida B, 456",
        time: "09:30",
    },
    {
        status: "Cancelado",
        name: "Carlos Lima",
        photoUrl: "https://randomuser.me/api/portraits/men/2.jpg",
        date: "15/07/2024",
        type: "Funcional",
        address: "Travessa C, 789",
        time: "16:00",
    },
];
