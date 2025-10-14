import HeaderMobile from "../../../components/Home/Header/HeaderMobile";
import PlansSection from '../../../components/Home/PlansSection';
import FAQSection from '../../../components/Home/FAQSection';
import CardServices from "../../../components/Home/Cards/CardServices";
import Footer from "../../../components/Home/Footer/Footer";
import AboutSection from "../../../components/Home/AboutSection";

export default function HomeMobile() {
  return (
    <>
      <HeaderMobile />
      <div>
        <section id="main-section-mobile" className={"p-5 mt-5 mb-5"}>
          <>
            <div>
              <h1 className={"text-3xl font-bold mb-3 uppercase"}>
                Bem-vindo ao csf Treinamentos
              </h1>

              <p className="mb-8">A Consultoria Saúde Fitness é especializada em oferecer atendimento personalizado em academias, residências e também ao ar livre para pessoas todas as idades.</p>
              <div>
                <img className="w-full" src="/Home/bgImageMobileMain.png" alt="" />
              </div>
            </div>
            <button className="bg-oxford-blue mt-3 min-h-12 w-3/4 text-white rounded-md text-poppins font-semibold text-lg">Entre em contato</button>
          </>
        </section>

        {/* about */}
        <AboutSection isMobile={true} />

        <section id="services-section-mobile" className="mt-10 mb-10 p-5">
          <div className="border-b-4 uppercase">
            <h1 className="ml-auto mr-auto mt-0 mb-0 border-b-4 text-5xl text-left text-oxford-blue font-bebas leading-none">Bora treinar com quem entende e se importa</h1>
          </div>
          <CardServices bgColor="bg-indigo" title="Um guia para a saúde em todas as idades" content="Da infância à melhor idade, a saúde é nossa prioridade em cada etapa! Com um olhar atento às necessidades de cada um, oferecemos orientação personalizada para crianças, jovens, adultos e idosos. " image="https://placehold.co/650x430" isReverse={true} isMobile={true} />
          <CardServices bgColor="bg-lapis-lazuli" title="Cuidando da sua saúde e inspirando sua família a fazer o mesmo" content="Sua saúde é um presente que pode inspirar a todos ao seu redor, especialmente a sua família! Com nosso suporte, você encontrará o equilíbrio perfeito para se cuidar e motivar seus entes queridos a adotarem hábitos saudáveis. " image="https://placehold.co/650x430" isMobile={true} />
          <CardServices bgColor="bg-indigo" title="Muito além do físico: um treinador que cuida de você" content="Aqui, você encontra um personal que realmente se importa com o seu bem-estar completo, da mente ao corpo. Venha treinar em um ambiente acolhedor, onde seus objetivos são levados a sério e seu progresso é celebrado a cada passo." image="https://placehold.co/650x430" isReverse={true} isMobile={true} />
        </section >

        <PlansSection isMobile={true} />

        <FAQSection isMobile={true} />

        <Footer isMobile={true} />

      </div >
    </>
  );
}
