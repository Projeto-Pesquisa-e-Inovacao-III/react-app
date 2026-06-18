import ButtonHome from "../../../components/Home/ButtonHome/ButtonHome";

export default function AboutSection({ isMobile }: { isMobile: boolean }) {
    return (
        <section
            id="about-section"
            className={`scroll-mt-20 bg-oxford-blue flex justify-center ${isMobile ? 'p-5 pt-14 pb-14' : 'px-16 pt-20 pb-20'
                }`}
        >
            <div
                className={`font-poppins w-full max-w-[1600px] flex ${isMobile ? 'flex-col items-center gap-8' : 'flex-row items-center justify-between mx-auto gap-16'
                    }`}
            >
                <div className={`${isMobile ? 'w-full px-4' : 'w-1/2 flex'}`}>
                    <img className="rounded-2xl shadow-2xl shadow-black/60 object-cover max-h-[500px]" src="/Home/about-2.png" alt="Fábio Bernardes" />
                </div>

                <div
                    className={`text-white flex flex-col ${!isMobile
                        ? 'w-1/2 max-w-2xl'
                        : 'px-4'
                        }`}
                >
                    <h1
                        className={`font-black mb-6 mt-3 text-gigant-orange ${!isMobile ? 'text-5xl uppercase tracking-wider' : 'text-4xl text-center'
                            }`}
                    >
                        Quem sou?
                    </h1>
                    <p className={`${isMobile ? 'text-lg text-center leading-relaxed text-gray-200' : 'text-2xl leading-relaxed text-gray-200 w-fit whitespace-pre-line'}`}>
                        Sou <span className="text-white font-bold">Fábio Bernardes</span>, professor de Educação Física e Personal Trainer apaixonado por transformar vidas através do movimento.
                    </p>
                    <p className={`${isMobile ? 'text-lg text-center mt-5 leading-relaxed text-gray-200 mb-8' : 'text-2xl mt-6 leading-relaxed text-gray-200 w-fit mb-10'}`}>
                        Além de <span className="text-white font-bold">profissional</span>, sou marido e pai, e entendo na prática os desafios de conciliar uma rotina agitada com o <span className="text-white font-bold">cuidado da saúde</span>. É por isso que minha consultoria foi desenvolvida para se adaptar aos seus objetivos.
                    </p>

                    {!isMobile && (
                        <div className="mt-4">
                            <ButtonHome to="#plans-section" title="Conheça os pacotes disponíveis" classname="bg-gigant-orange text-white hover:bg-orange-600 shadow-lg px-6 py-2.5 text-lg rounded-lg font-bold transition-all w-fit min-w-[280px] mt-0!" />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
