import { useCallback, useContext, useEffect, useState } from "react";
import PlansCard from "../../../components/Home/PlansCard";
import { useQuery } from "@tanstack/react-query";
import { getPackages } from "../../../constants/home";
import { isAuthenticated } from "../../../constants/user";
import useEmblaCarousel from "embla-carousel-react";
import { TypeContext } from "../../../App";
import { Plus } from "lucide-react";

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

    const data = isPackagesSelected
        ? packages.data?.filter((pkg: any) => pkg.tipoProduto === "PACOTE")
        : packages.data?.filter((pkg: any) => pkg.tipoProduto === "ADICIONAL")

    const shouldUseCarousel = (data?.length ?? 0) >= 5

    const slidesToRender = shouldUseCarousel
        ? [...data, ...data, ...data]
        : data

    const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", loop: true })

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])


    return (
        <section id="plans-section" className={`bg-indigo p-5 pt-10 pb-10 ${isMobile ? "mt-10" : ""}`}>
            <div className={`${!isMobile ? "ml-20 mr-20" : ""}`}>
                <h2 className="text-white font-bold text-3xl">Escolha o melhor pacote para você</h2>
                <div className="flex justify-center mt-10  mb-10">
                    <button className={`cursor-pointer transition-all duration-150 border border-white font-semibold py-2 px-4 rounded-l-lg ${isPackagesSelected ? "bg-white text-black" : "bg-transparent text-white"}`} onClick={() => setIsPackagesSelected(true)}>Pacotes</button>
                    <button className={`cursor-pointer transition-all duration-150 border border-white font-semibold py-2 px-4 rounded-r-lg ${!isPackagesSelected ? "bg-white text-black" : "bg-transparent text-white"}`} onClick={() => setIsPackagesSelected(false)}>Adicionais</button>
                </div>
                {/* <div className="grid grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-8"> */}
                <div>
                    {shouldUseCarousel ? (
                        <div className="flex items-center gap-3 w-full">
                            <button
                                onClick={scrollPrev}
                                className="flex-shrink-0 w-10 h-10 rounded-full bg-white text-black text-2xl flex items-center justify-center hover:opacity-80 transition"
                            >
                                ‹
                            </button>

                            <div className="flex-1 min-w-0 w-0">
                                <div className="overflow-hidden" ref={emblaRef}>
                                    <div className="flex">
                                        {slidesToRender?.map((pkg: any, i: number) => (
                                            <div
                                                key={`slide-${i}-${pkg.id}`}
                                                className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_25%] box-border px-3"
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
                            </div>

                            <button
                                onClick={scrollNext}
                                className="flex-shrink-0 w-10 h-10 rounded-full bg-white text-black text-2xl flex items-center justify-center hover:opacity-80 transition"
                            >
                                ›
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {data?.map((pkg: any) => (
                                <div key={pkg.id}>
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
                    )}
                </div>

            </div>
        </section >
    );
}