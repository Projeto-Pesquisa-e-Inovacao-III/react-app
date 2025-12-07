import { useState } from "react";
import PlansCard from "../../../components/Home/PlansCard";
import { useQuery } from "@tanstack/react-query";
import { getPackages } from "../../../constants/home";

export default function PlansSection({ isMobile }: { isMobile: boolean }) {
    const [isPackagesSelected, setIsPackagesSelected] = useState(true);

    const packages = useQuery({
        queryKey: ['packages'],
        queryFn: getPackages,
        select: (res) => res.data,
    });

    console.log(packages.data);

    return (
        <section id="plans-section" className={`bg-indigo p-5 pt-10 pb-10 ${isMobile ? "mt-10" : ""}`}>
            <div className={`${!isMobile ? "ml-20 mr-20" : ""}`}>
                <h2 className="text-white font-bold text-3xl">Escolha o melhor pacote para você</h2>
                <div className="flex justify-center mt-10  mb-10">
                    <button className={`cursor-pointer transition-all duration-150 border border-white font-semibold py-2 px-4 rounded-l-lg ${isPackagesSelected ? "bg-white text-black" : "bg-transparent text-white"}`} onClick={() => setIsPackagesSelected(true)}>Pacotes</button>
                    <button className={`cursor-pointer transition-all duration-150 border border-white font-semibold py-2 px-4 rounded-r-lg ${!isPackagesSelected ? "bg-white text-black" : "bg-transparent text-white"}`} onClick={() => setIsPackagesSelected(false)}>Adicionais</button>
                </div>
                <div className={`${isMobile ? "grid grid-cols-1" : "grid grid-cols-[repeat(auto-fit,minmax(0,1fr))] "} gap-8 h-full`}>
                    {isPackagesSelected ? (
                        packages.data?.filter((pkg: any) => pkg.tipoProduto === "PACOTE").map((pkg: any) => (
                            <PlansCard
                                key={pkg.id}
                                description={pkg.periodo}
                                content={pkg.titulo}
                                price={`R$ ${pkg.preco}`}
                                benefits={JSON.parse(pkg.descricao)}
                            />
                        ))

                    ) : (
                        packages.data?.filter((pkg: any) => pkg.tipoProduto === "ADICIONAL").map((pkg: any) => (
                            <PlansCard
                                key={pkg.id}
                                description={pkg.periodo}
                                content={pkg.titulo}
                                price={`R$ ${pkg.preco}`}
                                benefits={JSON.parse(pkg.descricao)}
                            />
                        ))
                    )}
                </div>
            </div>
        </section >
    );
}