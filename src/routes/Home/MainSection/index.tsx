import ButtonHome from "../../../components/Home/ButtonHome/ButtonHome";

export default function HomeSection({ isMobile }: { isMobile: boolean }) {
    return (
        <>
            <section
                className={
                    isMobile
                        ? "flex flex-col justify-center p-5"
                        : "flex flex-col justify-center p-5 h-dvh bg-[url('/Home/bgImageMainRight.png')] bg-cover bg-center"
                }
            >
                {isMobile ? (
                    <>
                        <div>
                            <h1 className="text-3xl font-bold mb-3 uppercase">
                                Bem-vindo ao csf Treinamentos
                            </h1>

                            <p className="mb-8">
                                A Consultoria Saúde Fitness é especializada em oferecer
                                atendimento personalizado em academias, residências e também ao ar
                                livre para pessoas <span className="text-gigant-orange font-semibold"> todas as idades</span>.
                            </p>
                            

                            <img
                                className="w-full"
                                src="/Home/bgImageMobileMain.png"
                                alt="Imagem principal mobile"
                            />
                        </div>

                        <a href="https://api.whatsapp.com/send?phone=5511945584686&text=Olá%2C%20tudo%20bem%3F" target="_blank" rel="noopener noreferrer" className="mx-auto mt-5 bg-oxford-blue min-h-12 w-3/4 text-white rounded-md font-poppins font-semibold text-lg flex items-center justify-center">
                            Entre em contato
                        </a>
                    </>
                ) : (
                    <div className="w-fit flex flex-col justify-center items-start gap-5 mt-64 ml-20 mr-20">
                        <h1 className="text-5xl w-[53.2%] font-poppins font-bold uppercase text-center text-white">
                            Bem-vindo a csf Treinamentos
                        </h1>

                        <ButtonHome to="https://api.whatsapp.com/send?phone=5511945584686&text=Olá%2C%20tudo%20bem%3F" title="Entre em contato"/>
                    </div>
                )}
            </section>
        </>
    );
}