import ButtonHome from "../../../components/Home/ButtonHome/ButtonHome";

export default function HomeSection({ isMobile }: { isMobile: boolean }) {
    return (
        <section
            className={
                isMobile
                    ? "flex flex-col justify-center p-5"
                    : "relative flex flex-col justify-center h-dvh bg-[url('/Home/bgImageMainRight-3.jpg')] bg-cover bg-center overflow-hidden"
            }
        >
                {/* Overlay azul diagonal — apenas desktop */}
                {!isMobile && (
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background: "linear-gradient(165deg, rgba(26, 97, 141, 1) 0%, rgba(6, 14, 25, 1) 69%)",
                            clipPath: "polygon(0 0, 43.3% 0, 57% 45%, 41% 100%, 0 100%)",
                            zIndex: 1,
                        }}
                    />
                )}

                {isMobile ? (
                    <>
                        <div>
                            <h1 className="text-3xl font-bold mb-3 uppercase animate-hero-1">
                                Bem-vindo ao csf Treinamentos
                            </h1>
                            <p className="mb-8 animate-hero-2">
                                A Consultoria Saúde Fitness é especializada em oferecer atendimento
                                personalizado em academias, residências e também ao ar livre para
                                pessoas{" "}
                                <span className="text-gigant-orange font-semibold">
                                    todas as idades
                                </span>
                                .
                            </p>
                            <img
                                className="w-full animate-hero-3"
                                src="/Home/bgImageMobileMain.png"
                                alt="Imagem principal mobile"
                            />
                        </div>
                        <a
                            href="https://api.whatsapp.com/send?phone=5511945584686&text=Olá%2C%20tudo%20bem%3F"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mx-auto mt-5 bg-oxford-blue min-h-12 w-3/4 text-white rounded-md font-poppins font-semibold text-lg flex items-center justify-center animate-hero-3"
                        >
                            Entre em contato
                        </a>
                    </>
                ) : (
                    <div
                        className="relative w-fit flex flex-col justify-center items-start gap-5 ml-20 mr-20"
                        style={{ zIndex: 2 }}
                    >
                        <h1 className="text-8xl text-[5.5rem] w-[53.2%] font-poppins font-bold uppercase text-left text-white animate-hero-1">
                            Bem-vindo a csf Treinamentos
                        </h1>
                        <p className="text-2xl w-[53.2%] text-left font-montserrat text-white animate-hero-2">
                            A jornada para uma vida mais ativa e saudável começa aqui. Orientação
                            profissional adaptada à sua rotina e necessidade
                        </p>
                        <div className="w-2/4 h-1/3! animate-hero-3">
                            <ButtonHome
                                classname="mt-3! h-full! bg-gigant-orange text-white! rounded-2xl! text-xl"
                                to="https://api.whatsapp.com/send?phone=5511945584686&text=Olá%2C%20tudo%20bem%3F"
                                title="Entre em contato"
                            />
                        </div>
                    </div>
                )}
        </section>
    );
}