export type AppointmentCardType = {
    status: "Confirmado" | "Pendente" | "Cancelado";
    name: string;
    photoUrl: string;
    date: string;
    time: string;
    isMobile?: boolean;
};
