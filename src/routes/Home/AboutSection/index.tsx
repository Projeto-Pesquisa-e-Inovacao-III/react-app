import ButtonHome from "../../../components/Home/ButtonHome/ButtonHome";

export default function AboutSection({ isMobile }: { isMobile: boolean }) {
    return (
        <section
            id="about-section"
            className={`scroll-mt-20 bg-oxford-blue flex justify-center p-5 ${isMobile ? 'pt-10 pb-10' : 'pt-20 pb-20'
                }`}
        >
            <div
                className={`font-poppins w-full flex ${isMobile ? 'flex-col items-center' : 'ml-20 mr-20'
                    }`}
            >
                <div className={`${isMobile ? 'w-full mb-5' : 'w-2/4 not-2xl:w-full'}`}>
                    <img className="rounded-lg" src="/Home/about-2.png" alt="" />
                </div>

                <div
                    className={`text-white flex flex-col ${!isMobile
                        ? 'justify-evenly ml-20 w-2xl max-w-3xl'
                        : ''
                        }`}
                >
                    <h1
                        className={`text-3xl font-bold mb-5 mt-3 ${!isMobile ? 'uppercase' : ''
                            }`}
                    >
                        Quem sou?
                    </h1>
                    <p className={`${isMobile ? 'text-lg' : 'text-2xl w-fit whitespace-pre-line'}`}>
                        Sou <span className="text-gigant-orange font-semibold">Fábio Bernardes</span>, professor de Educação Física e Personal Trainer apaixonado por transformar vidas através do movimento.
                    </p>
                    <p className={`${isMobile ? 'text-lg mt-5' : 'text-2xl w-fit'}`}>
                        Além de <span className="text-gigant-orange font-semibold">profissional</span>, sou marido e pai, e entendo na prática os desafios de conciliar uma rotina agitada com o <span className="text-gigant-orange font-semibold">cuidado da saúde</span>. É por isso que minha consultoria foi desenvolvida para se adaptar aos seus objetivos.
                    </p>

                    {!isMobile && (
                        <ButtonHome to="#plans-section" title="Conheça os pacotes disponíveis" />
                    )}
                </div>
            </div>
        </section>
    );
}
