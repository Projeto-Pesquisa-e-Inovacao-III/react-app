export type PackagesCardType = {
    title: string;
    subtitle: string;
    imageUrl?: string;
    price: string;
    duration: string;
    benefits: string[];
    titlebtn: string;
    onClick: () => void;
    typeUser: "personal" | "usuario";
}