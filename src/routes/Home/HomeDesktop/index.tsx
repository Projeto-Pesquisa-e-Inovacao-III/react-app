import HeaderDesktop from "../../../components/Home/Header/HeaderDesktop";
import PlansSection from "../../../components/Home/PlansSection";
import FAQSection from "../../../components/Home/FAQSection";
import CardServices from "../../../components/Home/Cards/CardServices";
import Footer from "../../../components/Home/Footer/Footer";
import AboutSection from "../../../components/Home/AboutSection";
import ButtonHome from "../../../components/Home/ButtonHome";

export default function HomeDesktop() {
    return (
        <>
            <HeaderDesktop />
            <div id="main-section">
                {/* main */}
                <section className={"flex flex-col justify-center p-5 h-dvh  bg-[url('/Home/bgImageMain.png')] bg-cover bg-center"}>
                    <div className="w-fit flex flex-col justify-center items-start gap-5 mt-64 ml-20 mr-20">
                        <h1 className={"text-5xl w-[53.2%] font-poppins font-bold uppercase text-center text-white"}>
                            Bem-vindo a csf Treinamentos
                        </h1>
                        {/* <button className="bg-white w-[53.2%] mt-10 min-h-12 text-black font-semibold rounded-md cursor-pointer">Entre em contato</button> */}
                        <ButtonHome to="https://http.cat/404" title="Entre em contato" />
                    </div>
                </section>

                {/* about */}
                <AboutSection isMobile={false} />


                {/* <section id="services-section" className="bg-oxford-blue p-5"> */}
                <section id="services-section" className="mt-10 p-5">
                    <div className="ml-20 mr-20">
                        <div className="flex justify-center items-center uppercase border-amber-600 wrapper-content mb-10">
                            {/* <h1 className="ml-auto mr-auto mt-0 mb-0 text-center border-b-8 text-8xl line-clamp-1 text-white font-bebas leading-none">Bora treinar com quem entende e se importa</h1> */}
                            <h1 className="ml-auto mr-auto mt-0 mb-0 text-center border-b-8 text-8xl line-clamp-1 font-bebas leading-none">Bora treinar com quem entende e se importa</h1>
                        </div>
                        <CardServices bgColor="bg-indigo" title="Um guia para a saúde em todas as idades" content="Da infância à melhor idade, a saúde é nossa prioridade em cada etapa! Com um olhar atento às necessidades de cada um, oferecemos orientação personalizada para crianças, jovens, adultos e idosos. " image="https://placehold.co/650x430" isReverse={true} />
                        <CardServices bgColor="bg-lapis-lazuli" title="Cuidando da sua saúde e inspirando sua família a fazer o mesmo" content="Sua saúde é um presente que pode inspirar a todos ao seu redor, especialmente a sua família! Com nosso suporte, você encontrará o equilíbrio perfeito para se cuidar e motivar seus entes queridos a adotarem hábitos saudáveis. " image="https://placehold.co/650x430" />
                        <CardServices bgColor="bg-indigo" title="Muito além do físico: um treinador que cuida de você" content="Aqui, você encontra um personal que realmente se importa com o seu bem-estar completo, da mente ao corpo. Venha treinar em um ambiente acolhedor, onde seus objetivos são levados a sério e seu progresso é celebrado a cada passo." image="https://placehold.co/650x430" isReverse={true} />
                    </div>
                </section >

                <PlansSection isMobile={false} />

                <FAQSection isMobile={false} />

                <Footer isMobile={false} />
            </div >
        </>
    );
}
