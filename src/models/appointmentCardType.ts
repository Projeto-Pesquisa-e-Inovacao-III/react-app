export type AppointmentCardType = {
    status: "Confirmado" | "Pendente" | "Cancelado";
    name: string;
    photoUrl: string;
    date: string;
    type: string;
    time: string;
    address: string;
    isMobile?: boolean;
};
