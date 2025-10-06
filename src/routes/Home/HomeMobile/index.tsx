import Card from "../../../components/Home/Cards/CardServicesMobile";
import HeaderMobile from "../../../components/Home/Header/HeaderMobile";
import PlansSection from '../../../components/Home/PlansSection';
import FAQSection from '../../../components/Home/FAQSection';
import Footer from '../../../components/Home/Footer';

export default function HomeMobile() {
  console.log("Home renderizou");
  return (
    <>
      <HeaderMobile />
      <div>
        <section className={"p-5 mt-5 mb-5"}>
          <>
            <div>
              <h1 className={"text-3xl font-bold mb-3 uppercase"}>
                Bem-vindo ao csf Treinamentos
              </h1>

              <p className="mb-8">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Porro quaerat enim deserunt nisi excepturi </p>
              <div>
                <img className="w-full" src="/Home/bgImage.png" alt="" />
              </div>
            </div>
            <button className="bg-oxford-blue mt-3 min-h-12 w-3/4 text-white rounded-md text-poppins font-semibold text-lg">Entre em contato</button>
          </>
        </section>

        {/* about */}
        <section className="bg-oxford-blue flex justify-center home-about pt-10 pb-10 p-5">
          <div>
            <div>
              <img className="w-full" src="https://placehold.co/500x500" alt="" />
            </div>

            <div className="text-white flex flex-col justify-center">
              <h1 className="text-3xl font-bold mb-5 mt-3">Quem sou?</h1>
              <p className="text-lg">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea labore eaque deserunt cumque libero tempora nam recusandae nobis doloremque sunt! Dolorum, quisquam. Atque, praesentium recusandae.</p>
            </div>
          </div>
        </section>

        <section className="mt-10 mb-10 p-5">
          <div className="border-b-4 uppercase">
            <h1 className="ml-auto mr-auto mt-0 mb-0 border-b-4 text-6xl text-left text-oxford-blue font-bebas leading-none">Bora treinar com quem entende e se importa</h1>
          </div>
          <Card title="Muito além do físico: um treinador que cuida de você" content="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Perferendis voluptatum, beatae nihil dicta suscipit expedita rerum aliquid libero eum voluptates voluptate deleniti unde ullam ex!" image="https://placehold.co/400x500" isReverse={true} />
          <Card title="Um guia para a saúde em todas as idades" content="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Perferendis voluptatum, beatae nihil dicta suscipit expedita rerum aliquid libero eum voluptates voluptate deleniti unde ullam ex!" image="https://placehold.co/400x500" />
          <Card title="Cuidando da sua saúde e inspirando sua família a fazer o mesmo" content="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Perferendis voluptatum, beatae nihil dicta suscipit expedita rerum aliquid libero eum voluptates voluptate deleniti unde ullam ex!" image="https://placehold.co/400x500" isReverse={true} />
        </section >

        <PlansSection isMobile={true} />

        <FAQSection isMobile={true} />

        <Footer />

      </div >
    </>
  );
}
