import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import PlansCard from "../../../components/Home/PlansCard";
import { useQuery } from "@tanstack/react-query";
import { getPackages } from "../../../constants/home";
import { isAuthenticated } from "../../../constants/user";
import useEmblaCarousel from "embla-carousel-react";

interface Benefit {
    valor: string;
}

interface Package {
    id: string;
    tipoProduto: string;
    status: string;
    periodo: string;
    quantidadeAula: string;
    titulo: string;
    preco: number;
    beneficios: Benefit[];
}

export default function PlansSection({ isMobile }: { isMobile: boolean }) {
    const [isPackagesSelected, setIsPackagesSelected] = useState(true);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [expandedPkgId, setExpandedPkgId] = useState<string | null>(null);
    const [uniformHeight, setUniformHeight] = useState<number | undefined>(undefined);
    const containerRef = useRef<HTMLElement>(null);

    const packages = useQuery({
        queryKey: ['packages'],
        queryFn: getPackages,
        select: (res) => res.data,
    });

    const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
    useEffect(() => {
        const checkAuth = async () => {
            const auth = await isAuthenticated();
            setIsUserAuthenticated(auth.data.autentificado);
        };
        checkAuth();
    }, []);

    const rawData = Array.isArray(packages.data) ? packages.data : [];
    const data = rawData.filter((pkg: Package) => {
        const targetType = isPackagesSelected ? "PACOTE" : "ADICIONAL";
        return pkg.tipoProduto === targetType && pkg.status === "ATIVO";
    });

    const shouldUseCarousel = isMobile ? data?.length >= 1 : data?.length > 4;

    const [emblaRef, emblaApi] = useEmblaCarousel(
        { 
            align: isMobile ? "center" : "start", 
            loop: false, 
            skipSnaps: false,
            containScroll: "trimSnaps"
        },
        []
    );

    useEffect(() => {
        if (!emblaApi) return;
        emblaApi.reInit({
            align: isMobile ? "center" : "start",
            loop: false,
            skipSnaps: false,
            containScroll: "trimSnaps"
        });
    }, [emblaApi, isMobile]);

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        emblaApi.on("select", onSelect);
        onSelect();
        return () => { emblaApi.off("select", onSelect); };
    }, [emblaApi, onSelect]);

    useEffect(() => {
        setExpandedPkgId(null);
        setUniformHeight(undefined);
        setSelectedIndex(0);
        emblaApi?.scrollTo(0, true);
    }, [isPackagesSelected, emblaApi]);

    useEffect(() => {
        const handleResize = () => {
            setUniformHeight(undefined);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        document.fonts?.ready?.then(() => {
            setUniformHeight(undefined);
        });
    }, []);

    useLayoutEffect(() => {
        if (!containerRef.current || !data?.length || expandedPkgId !== null || uniformHeight !== undefined) return;
        const cards = Array.from(containerRef.current.querySelectorAll('[data-plancard]')) as HTMLElement[];
        const maxH = Math.max(...cards.map((el) => el.offsetHeight));
        if (maxH > 0) setUniformHeight(maxH);
    }, [data, isPackagesSelected, expandedPkgId, isMobile, uniformHeight]);

    return (
        <section ref={containerRef} id="plans-section" className={`scroll-mt-20 bg-indigo ${isMobile ? "p-5 mt-10" : "px-16"} pt-16 pb-16`}>
            <div className={`${!isMobile ? "max-w-[1600px] mx-auto" : ""}`}>
                <h2 className={`text-white font-black font-poppins text-center ${isMobile ? "text-3xl" : "text-5xl tracking-wide"} drop-shadow-md`}>Escolha o melhor pacote para você</h2>
                <div className="flex justify-center mt-10 mb-12">
                    <button className={`cursor-pointer transition-all duration-150 border border-white font-semibold py-2 px-4 rounded-l-lg ${isPackagesSelected ? "bg-white text-black" : "bg-transparent text-white"}`} onClick={() => setIsPackagesSelected(true)}>Pacotes</button>
                    <button className={`cursor-pointer transition-all duration-150 border border-white font-semibold py-2 px-4 rounded-r-lg ${!isPackagesSelected ? "bg-white text-black" : "bg-transparent text-white"}`} onClick={() => setIsPackagesSelected(false)}>Adicionais</button>
                </div>
                <div>
                    {shouldUseCarousel ? (
                        <div>
                            <div className="flex items-center gap-3 w-full">
                                {!isMobile && (
                                    <button
                                        onClick={scrollPrev}
                                        className="flex-shrink-0 w-10 h-10 rounded-full bg-white text-black text-2xl flex items-center justify-center hover:opacity-80 transition"
                                    >
                                        ‹
                                    </button>
                                )}

                                <div className="flex-1 min-w-0 w-0">
                                    <div className="overflow-hidden" ref={emblaRef}>
                                        <div className="flex items-start">
                                            {data?.map((pkg: Package, i: number) => (
                                                <div
                                                    key={`slide-${i}-${pkg.id}`}
                                                    className={`box-border px-3 ${isMobile ? "flex-[0_0_88%]" : "flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_25%]"}`}
                                                >
                                                    <PlansCard
                                                        description={pkg.quantidadeAula}
                                                        content={pkg.titulo}
                                                        price={`R$ ${pkg.preco}`}
                                                        benefits={pkg.beneficios.map((b: Benefit) => b.valor)}
                                                        isLoggedIn={isUserAuthenticated}
                                                        controlledExpanded={expandedPkgId === pkg.id}
                                                        onToggle={() => setExpandedPkgId(expandedPkgId === pkg.id ? null : pkg.id)}
                                                        uniformHeight={uniformHeight}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {!isMobile && (
                                    <button
                                        onClick={scrollNext}
                                        className="flex-shrink-0 w-10 h-10 rounded-full bg-white text-black text-2xl flex items-center justify-center hover:opacity-80 transition"
                                    >
                                        ›
                                    </button>
                                )}
                            </div>

                            {isMobile && (
                                <div className="flex justify-center gap-2 mt-5">
                                    {data?.map((_: Package, i: number) => (
                                        <button
                                            key={i}
                                            onClick={() => emblaApi?.scrollTo(i)}
                                            style={{
                                                width: selectedIndex === i ? "20px" : "8px",
                                                height: "8px",
                                                borderRadius: "9999px",
                                                background: selectedIndex === i ? "#ffffff" : "rgba(255,255,255,0.4)",
                                                border: "none",
                                                padding: 0,
                                                cursor: "pointer",
                                                transition: "all 0.25s ease",
                                            }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div
                            className="grid gap-4"
                            style={{ gridTemplateColumns: `repeat(${data?.length}, 1fr)`, alignItems: "start" }}
                        >
                            {data?.map((pkg: Package) => (
                                <div key={pkg.id}>
                                    <PlansCard
                                        description={pkg.quantidadeAula}
                                        content={pkg.titulo}
                                        price={`R$ ${pkg.preco}`}
                                        benefits={pkg.beneficios.map((b: Benefit) => b.valor)}
                                        isLoggedIn={isUserAuthenticated}
                                        controlledExpanded={expandedPkgId === pkg.id}
                                        onToggle={() => setExpandedPkgId(expandedPkgId === pkg.id ? null : pkg.id)}
                                        uniformHeight={uniformHeight}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </section>
    );
}