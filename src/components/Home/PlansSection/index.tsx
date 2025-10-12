import { useState } from "react";
import PlansCard from "../PlansCard";

export default function PlansSection({ isMobile }: { isMobile: boolean }) {
    const [isPackagesSelected, setIsPackagesSelected] = useState(true);

    return (
        <section id="plans-section" className={`bg-indigo p-5 pt-10 pb-10 ${isMobile ? "mt-10" : ""}`}>
            <div className={`${!isMobile ? "ml-20 mr-20" : ""}`}>
                <h2 className="text-white font-bold text-3xl">Escolha o melhor pacote para você</h2>
                <div className="flex justify-center mt-10  mb-10">
                    <button className={`cursor-pointer transition-all duration-150 border border-white font-semibold py-2 px-4 rounded-l-lg ${isPackagesSelected ? "bg-white text-black" : "bg-transparent text-white"}`} onClick={() => setIsPackagesSelected(true)}>Pacotes</button>
                    <button className={`cursor-pointer transition-all duration-150 border border-white font-semibold py-2 px-4 rounded-r-lg ${!isPackagesSelected ? "bg-white text-black" : "bg-transparent text-white"}`} onClick={() => setIsPackagesSelected(false)}>Adicionais</button>
                </div>
                <div className={`${isMobile ? "grid grid-cols-1" : "grid grid-cols-3"} gap-8 h-full`}>
                    {isPackagesSelected ? (
                        <>
                            <PlansCard title="Plano X" content="Descrição do Plano X" price="R$ 99,90" benefits={["Benefício 1", "Benefício 2"]} />
                            <PlansCard title="Plano Y" content="Descrição do Plano Y" price="R$ 149,90" benefits={["Benefício 1", "Benefício 2", "Benefício 3"]} />
                            <PlansCard title="Plano Z" content="Descrição do Plano Z" price="R$ 199,90" benefits={["Benefício 1", "Benefício 2", "Benefício 3", "Benefício 4"]} />
                        </>
                    ) : (
                        <>
                            <PlansCard title="Adicional X" content="Descrição do Adicional X" price="R$ 29,90" benefits={["Benefício 1", "Benefício 2"]} />
                            <PlansCard title="Adicional Y" content="Descrição do Adicional Y" price="R$ 49,90" benefits={["Benefício 1", "Benefício 2", "Benefício 3"]} />
                            <PlansCard title="Adicional Z" content="Descrição do Adicional Z" price="R$ 69,90" benefits={["Benefício 1", "Benefício 2", "Benefício 3", "Benefício 4"]} />
                        </>
                    )}
                </div>
            </div>
        </section >
    );
}