import CardServices from "../../../components/Home/Cards/CardServices";

export default function ServicesSection({ isMobile }: { isMobile: boolean }) {
  return (
    <section
      id={isMobile ? "services-section-mobile" : "services-section"}
      className={`${isMobile ? "mt-10 mb-10" : "mt-10"} p-5`}
    >
      <div className={isMobile ? "" : "ml-20 mr-20"}>
        <div
          className={`${
            isMobile
              ? "border-b-4 uppercase"
              : "flex justify-center items-center uppercase border-amber-600 wrapper-content mb-10"
          }`}
        >
          <h1
            className={`ml-auto mr-auto mt-0 mb-0 font-bebas leading-none ${
              isMobile
                ? "text-5xl text-left text-oxford-blue border-b-4"
                : "text-8xl text-center border-b-8 line-clamp-1"
            }`}
          >
            Bora treinar com quem entende e se importa
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
          bgColor={`${isMobile ? "gradient-white-with-blue-bar-mobile" : "gradient-white-with-blue-bar"}`}
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