import Header from "../../components/Header";
import Accordion from '@mui/material/Accordion';
import "./style.css"
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { ChevronDown } from "lucide-react";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import Card from "../../components/Cards";
import PlansCard from "../../components/PlansCard";

export default function Home() {

  const [displayMainImage, setDisplayMainImage] = useState(true);

  useEffect(() => {

    window.innerWidth <= 768 ? setDisplayMainImage(true) : setDisplayMainImage(false);
    console.log(window.innerWidth);
  }, [window.innerWidth]);
  return (
    <>
      <Header />
      <div>
        <section className="wrapper-main-home p-5">
          <div className="wrapper-content">
            <div className="wrapper-content-main">
              <div className="wrapper-main-home-text">
                <h1 className="text-3xl font-bold mb-3 uppercase">
                  Bem-vindo ao csf Treinamentos
                </h1>
                <p className="mb-8">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Porro quaerat enim deserunt nisi excepturi </p>

                {displayMainImage && (
                  <div className="main-img">
                    <img src="https://placehold.co/330x330" alt="" />
                  </div>
                )}
                <button className="mt-3 min-h-12 w-3/4 text-white rounded-md" style={{ backgroundColor: "var(--background-blue-500)" }}>Lorem, ipsum.</button>

              </div>
              {!displayMainImage && (
                <div className="main-img">
                  <img src="https://placehold.co/600x530" alt="" />
                </div>
              )}
            </div>
          </div>
        </section>

{/* about */}
        <section className="flex justify-center home-about p-5" style={{ backgroundColor: "var(--background-blue-500)" }}>
          <div className="wrapper-content">
            <div className="wrapper-content-about">
              <div className="about-img">
                <img src="https://placehold.co/500x500" alt="" />
              </div>

              <div className="text-white flex flex-col justify-center">
                <h1>Quem sou?</h1>
                <p className="text-lg">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea labore eaque deserunt cumque libero tempora nam recusandae nobis doloremque sunt! Dolorum, quisquam. Atque, praesentium recusandae.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 mb-10 p-5">
          <div className="home-cta-text border-b-4 uppercase border-amber-600 wrapper-content ">
            <h1 className="text-4xl text-black">Bora treinar com quem entende e se importa</h1>
          </div>
          <Card title="Muito além do físico: um treinador que cuida de você" content="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Perferendis voluptatum, beatae nihil dicta suscipit expedita rerum aliquid libero eum voluptates voluptate deleniti unde ullam ex!" image="https://placehold.co/500x500" isReverse={true} />
          <Card title="Um guia para a saúde em todas as idades" content="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Perferendis voluptatum, beatae nihil dicta suscipit expedita rerum aliquid libero eum voluptates voluptate deleniti unde ullam ex!" image="https://placehold.co/500x500" />
          <Card title="Cuidando da sua saúde e inspirando sua família a fazer o mesmo" content="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Perferendis voluptatum, beatae nihil dicta suscipit expedita rerum aliquid libero eum voluptates voluptate deleniti unde ullam ex!" image="https://placehold.co/500x500" isReverse={true} />
        </section >

        <section className=" p-5 pt-10 mt-10 mb-10 home-plans" style={{ backgroundColor: "var(--indigo-500)" }}>
          <h2 className="text-white text-3xl">Nossos Planos!</h2>
          <PlansCard title="Plano X" content="Descrição do Plano X" image="https://placehold.co/330x440" price={<p>R$ 99,90</p>} />
          <PlansCard title="Plano Y" content="Descrição do Plano Y" image="https://placehold.co/330x440" price={<p>R$ 149,90</p>} />
          <PlansCard title="Plano Z" content="Descrição do Plano Z" image="https://placehold.co/330x440" price={<p>R$ 199,90</p>} />
        </section>

        <section className="home-frequently-asked p-5" style={{ backgroundColor: "var(--background-blue-500)" }}>
          <div className="wrapper-asks">
            <h2>Perguntas Frequentes</h2>

            <Accordion>
              <AccordionSummary
                expandIcon={<ChevronDown />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <h3>Pergunta 1</h3>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>Resposta para a pergunta 1.</Typography>
              </AccordionDetails>

            </Accordion>

            <Accordion>
              <AccordionSummary
                expandIcon={<ChevronDown />}
                aria-controls="panel2-content"
                id="panel2-header"
              >
                <h3>Pergunta 2</h3>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>Resposta para a pergunta 2.</Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary
                expandIcon={<ChevronDown />}
                aria-controls="panel3-content"
                id="panel3-header"
              >
                <h3>Pergunta 3</h3>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>Resposta para a pergunta 3.</Typography>
              </AccordionDetails>
            </Accordion>
          </div>
        </section>

        <footer>

        </footer>
      </div >
    </>
  );
}
