import ButtonHome from "../ButtonHome";

export default function HomeSection({ isMobile }: { isMobile: boolean }) {
    return (
        <section
            className={
                isMobile
                    ? "flex flex-col justify-center p-5"
                    : "flex flex-col justify-center p-5 h-dvh bg-[url('/Home/bgImageMain.png')] bg-cover bg-center"
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
                            livre para pessoas todas as idades.
                        </p>

                        <img
                            className="w-full"
                            src="/Home/bgImageMobileMain.png"
                            alt="Imagem principal mobile"
                        />
                    </div>

                    <button className="bg-oxford-blue mt-3 min-h-12 w-3/4 text-white rounded-md font-poppins font-semibold text-lg">
                        Entre em contato
                    </button>
                </>
            ) : (
                <div className="w-fit flex flex-col justify-center items-start gap-5 mt-64 ml-20 mr-20">
                    <h1 className="text-5xl w-[53.2%] font-poppins font-bold uppercase text-center text-white">
                        Bem-vindo a csf Treinamentos
                    </h1>

                    <ButtonHome to="https://http.cat/404" title="Entre em contato" />
                </div>
            )}
        </section>
    );
}