import { useState } from "react";
import PlansCard from "../../../components/Home/PlansCard";

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
                <div className={`${isMobile ? "grid grid-cols-1" : "grid grid-cols-[repeat(auto-fit,minmax(0,1fr))] "} gap-8 h-full`}>
                    {isPackagesSelected ? (
                        <>
                            <PlansCard description="12 meses" content="Pacote Anual" price="R$ 2.400,00" benefits={["Treino personalizado;", "Anamnese;", "Feedback Diário;", "1 aula grátis com o personal a cada mês   (12 aulas).", "Dicas de Suplementação.", "Indicação de Nutricionistas."]} />
                            <PlansCard description="6 meses" content="Pacote Semestral" price="R$ 700,00" benefits={["Treino personalizado;", "Anamnese;", "Feedback Diário;", "1 aula grátis com o personal a cada mês   (6 aulas).", "Dicas de Suplementação."]} />
                            <PlansCard description="3 meses" content="Pacote Trimestral" price="R$ 500,00" benefits={["Treino personalizado;", "Anamnese;", "Feedback Diário;", "1 aula grátis com o personal a cada mês   (3 aulas)."]} />
                            <PlansCard description="1 mês" content="Pacote Mensal" price="R$ 200,00" benefits={["Treino personalizado;", "Anamnese;", "Feedback Diário;"]} />
                        </>
                    ) : (
                        <>
                            <PlansCard description="As aulas com personal são cobradas separadamente da consultoria." content="Personal Residencial" price="R$ 200" benefits={["Atendimento personalizado em sua residência, com duração de 1 hora por aula."]} />
                            <PlansCard description="As aulas com personal são cobradas separadamente da consultoria." content="Aulas com Personal" price="R$ 120" benefits={["Treinos individuais com personal na academia, com duração de 1 hora a aula."]} />
                            <PlansCard description="As aulas com personal são cobradas separadamente da consultoria." content="Aula Funcional" price="R$ 100" benefits={["Treinos coletivos focados em condicionamento físico e resistência com 30 minutos de aula."]} />
                        </>
                    )}
                </div>
            </div>
        </section >
    );
}