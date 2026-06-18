import ButtonHome from "../../../components/Home/ButtonHome/ButtonHome";

export default function HomeSection({ isMobile }: { isMobile: boolean }) {
    return (
        <section
            className={
                isMobile
                    ? "flex flex-col justify-center p-5"
                    : "relative flex flex-col justify-center h-dvh bg-[url('/Home/bg-1-1-EDIT.jpg')] bg-cover bg-center overflow-hidden"
            }
        >
                {/* Overlay azul escuro/gradiente — apenas desktop — reduzido para mais claridade */}
                {!isMobile && (
                    <div
                        className="absolute inset-0 bg-gradient-to-r from-[#051128]/60 via-[#051128]/20 to-transparent pointer-events-none"
                    />
                )}

                {isMobile ? (
                    <>
                        <div>
                            <h1 className="text-4xl text-center font-extrabold mb-4 uppercase animate-hero-1 text-oxford-blue leading-tight tracking-tight">
                                Bem-vindo à <span className="text-gigant-orange">CSF</span> Treinamentos
                            </h1>
                            <p className="mb-8 animate-hero-2 text-lg text-gray-700 leading-relaxed">
                                A Consultoria Saúde Fitness é especializada em oferecer atendimento
                                personalizado em academias, residências e também ao ar livre para
                                pessoas de{" "}
                                <span className="text-gigant-orange font-semibold">
                                    todas as idades
                                </span>
                                .
                            </p>
                            <img
                                className="w-full animate-hero-3 rounded-2xl shadow-xl mb-6"
                                src="/Home/bgImageMobileMain.png"
                                alt="Imagem principal mobile"
                            />
                        </div>
                        <a
                            href="https://api.whatsapp.com/send?phone=5511945584686&text=Olá%2C%20tudo%20bem%3F"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mx-auto mt-2 bg-gigant-orange hover:bg-orange-600 transition-colors shadow-lg min-h-[56px] w-full max-w-sm text-white rounded-xl font-poppins font-bold text-lg flex items-center justify-center animate-hero-3"
                        >
                            Entre em contato
                        </a>
                    </>
                ) : (
                    <div className="w-full max-w-[1600px] mx-auto relative flex items-center h-full" style={{ zIndex: 2 }}>
                        <div className="w-full flex flex-col justify-center items-start gap-8">
                            <h1 className="text-8xl text-[5.5rem] max-w-4xl font-poppins font-black uppercase text-left text-white animate-hero-1 leading-[1.05] drop-shadow-lg tracking-tight">
                                Bem-vindo à <br/><span className="text-gigant-orange">CSF</span> Treinamentos
                            </h1>
                            <p className="text-2xl max-w-2xl text-left font-montserrat text-gray-200 animate-hero-2 leading-relaxed drop-shadow-md opacity-90">
                                A jornada para uma vida mais ativa e saudável começa aqui. Orientação
                                profissional adaptada à sua rotina e necessidade.
                            </p>
                            <div className="animate-hero-3 mt-6">
                                <ButtonHome
                                    classname="bg-gigant-orange hover:bg-orange-600 transition-all shadow-xl text-white! rounded-xl! text-xl px-10 py-4 font-bold w-fit min-w-[300px] mt-0!"
                                    to="https://api.whatsapp.com/send?phone=5511945584686&text=Olá%2C%20tudo%20bem%3F"
                                    title="Entre em contato"
                                />
                            </div>
                        </div>
                    </div>
                )}
        </section>
    );
}