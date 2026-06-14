import CardServices from "../../../components/Home/Cards/CardServices";

export default function ServicesSection({ isMobile }: { isMobile: boolean }) {
  return (
    <section
      id={isMobile ? "services-section-mobile" : "services-section"}
      className={`scroll-mt-20 ${isMobile ? "mt-10 mb-10 p-5" : "px-16 mt-10"}`}
    >
      <div className={isMobile ? "" : "max-w-[1600px] mx-auto"}>
        <div
          className={`${
            isMobile
              ? "mb-10 px-2"
              : "flex justify-center items-center uppercase mb-16 mt-8"
          }`}
        >
          <h1
            className={`mx-auto font-bebas tracking-wide ${
              isMobile
                ? "text-5xl text-center text-oxford-blue leading-tight"
                : "text-7xl text-center text-oxford-blue drop-shadow-sm"
            }`}
          >
            Bora treinar com quem <span className="text-gigant-orange">entende</span> e se importa
          </h1>
        </div>

        <CardServices
          bgColor="bg-indigo"
          title="Um guia para a saúde em todas as idades"
          content="Da infância à melhor idade, a saúde é nossa prioridade em cada etapa! Com um olhar atento às necessidades de cada um, oferecemos orientação personalizada para crianças, jovens, adultos e idosos."
          image="/Home/bg-1-2.jpg"
          isReverse={true}
          isMobile={isMobile}
        />

        <CardServices
          bgColor="bg-white"
          color="text-oxford-blue"
          title="Cuidando da sua saúde e inspirando sua família a fazer o mesmo"
          content="Sua saúde é um presente que pode inspirar a todos ao seu redor, especialmente a sua família! Com nosso suporte, você encontrará o equilíbrio perfeito para se cuidar e motivar seus entes queridos a adotarem hábitos saudáveis."
          image="/Home/cardImage2.png"
          isMobile={isMobile}
        />

        <CardServices
          bgColor="bg-indigo"
          title="Muito além do físico: um treinador que cuida de você"
          content="Aqui, você encontra um personal que realmente se importa com o seu bem-estar completo, da mente ao corpo. Venha treinar em um ambiente acolhedor, onde seus objetivos são levados a sério e seu progresso é celebrado a cada passo."
          image="/Home/cardImage3.png"
          isReverse={true}
          isMobile={isMobile}
        />
      </div>
    </section>
  );
}