import Header from "../../components/Header";
import Accordion from '@mui/material/Accordion';
import "./style.css"
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { ChevronDown } from "lucide-react";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import Card from "../../components/Cards";

export default function Home() {

  const [displayMainImage, setDisplayMainImage] = useState(true);

  useEffect(() => {

    window.innerWidth <= 768 ? setDisplayMainImage(true) : setDisplayMainImage(false);
    console.log(window.innerWidth);
  }, [window.innerWidth]);
  return (
    <>
      <Header />
      <div className="container-home">
        <section className="wrapper-main-home default-padding">
          <div className="wrapper-content">
            <div className="wrapper-content-main">
              <div className="wrapper-main-home-text">
                <h1>
                  Bem-vindo ao csf Treinamentos
                </h1>
                <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Porro quaerat enim deserunt nisi excepturi </p>

                {displayMainImage && (
                  <div className="main-img">
                    <img src="https://placehold.co/330x330" alt="" />
                  </div>
                )}
                <button className="main-btn">Lorem, ipsum.</button>

              </div>
              {!displayMainImage && (
                <div className="main-img">
                  <img src="https://placehold.co/600x530" alt="" />
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="home-about bg-blue default-padding">
          <div className="wrapper-content">
            <div className="wrapper-content-about">
              <div className="about-img">
                <img src="https://placehold.co/500x500" alt="" />
              </div>

              <div className="about-text">
                <h1>Quem sou?</h1>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea labore eaque deserunt cumque libero tempora nam recusandae nobis doloremque sunt! Dolorum, quisquam. Atque, praesentium recusandae.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="home-cta default-padding">
          <div className="home-cta-text wrapper-content">
            <h1>Bora treinar com quem entende e se importa</h1>
          </div>
          <Card title="Muito além do físico: um treinador que cuida de você" content="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Perferendis voluptatum, beatae nihil dicta suscipit expedita rerum aliquid libero eum voluptates voluptate deleniti unde ullam ex!" image="https://placehold.co/500x500" isReverse={true} />
          <Card title="Um guia para a saúde em todas as idades" content="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Perferendis voluptatum, beatae nihil dicta suscipit expedita rerum aliquid libero eum voluptates voluptate deleniti unde ullam ex!" image="https://placehold.co/500x500" />
          <Card title="Cuidando da sua saúde e inspirando sua família a fazer o mesmo" content="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Perferendis voluptatum, beatae nihil dicta suscipit expedita rerum aliquid libero eum voluptates voluptate deleniti unde ullam ex!" image="https://placehold.co/500x500" isReverse={true} />
        </section >

        <section className="home-plans bg-blue default-padding">
          <h2>Nossos Planos</h2>
          <div className="home-plan-card">
            <h2>Plano X</h2>
            <img src="https://placehold.co/330x440" alt="" />
          </div>
          <div className="home-plan-card">
            <h2>Plano X</h2>
            <img src="https://placehold.co/330x440" alt="" />
          </div>
          <div className="home-plan-card">
            <h2>Plano X</h2>
            <img src="https://placehold.co/330x440" alt="" />
          </div>
        </section>

        <section className="home-frequently-asked bg-blue default-padding">
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
