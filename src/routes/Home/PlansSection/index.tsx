import { useEffect, useState } from "react";
import PlansCard from "../../../components/Home/PlansCard";
import { useQuery } from "@tanstack/react-query";
import { getPackages } from "../../../constants/home";
import { isAuthenticated } from "../../../constants/user";

export default function PlansSection({ isMobile }: { isMobile: boolean }) {
    const [isPackagesSelected, setIsPackagesSelected] = useState(true);

    const packages = useQuery({
        queryKey: ['packages'],
        queryFn: getPackages,
        select: (res) => res.data,
    });

    console.log(packages.data);

    const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
    useEffect(() => {
        const checkAuth = async () => {
            const auth = await isAuthenticated();
            console.log("User authenticated:", auth.data.autentificado);
            setIsUserAuthenticated(auth.data.autentificado);
        };
        checkAuth();
    }, []);

    return (
        <section id="plans-section" className={`bg-indigo p-5 pt-10 pb-10 ${isMobile ? "mt-10" : ""}`}>
            <div className={`${!isMobile ? "ml-20 mr-20" : ""}`}>
                <h2 className="text-white font-bold text-3xl">Escolha o melhor pacote para você</h2>
                <div className="flex justify-center mt-10  mb-10">
                    <button className={`cursor-pointer transition-all duration-150 border border-white font-semibold py-2 px-4 rounded-l-lg ${isPackagesSelected ? "bg-white text-black" : "bg-transparent text-white"}`} onClick={() => setIsPackagesSelected(true)}>Pacotes</button>
                    <button className={`cursor-pointer transition-all duration-150 border border-white font-semibold py-2 px-4 rounded-r-lg ${!isPackagesSelected ? "bg-white text-black" : "bg-transparent text-white"}`} onClick={() => setIsPackagesSelected(false)}>Adicionais</button>
                </div>
                {/* <div className="grid grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-8"> */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {(isPackagesSelected
                        ? packages.data?.filter((pkg: any) => pkg.tipoProduto === "PACOTE")
                        : packages.data?.filter((pkg: any) => pkg.tipoProduto === "ADICIONAL")
                    )?.map((pkg: any, i: number) => (
                        <div
                            key={pkg.id}
                            className={i === 4 ? "lg:col-start-2 lg:col-end-4" : ""}
                        >
                            <PlansCard
                                description={pkg.periodo}
                                content={pkg.titulo}
                                price={`R$ ${pkg.preco}`}
                                benefits={JSON.parse(pkg.descricao)}
                                isLoggedIn={isUserAuthenticated}
                            />
                        </div>
                    ))}
                </div>

            </div>
        </section >
    );
}