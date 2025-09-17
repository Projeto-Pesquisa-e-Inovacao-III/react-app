import Header from "../../components/Header";
import Accordion from '@mui/material/Accordion';
import "./style.css"
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { ChevronDown } from "lucide-react";

export default function Home() {
  return (
    <>
      <Header />
      <section className="wrapper-main-home">
        <div className="wrapper-main-home-text">
          <h1>
            Bem-vindo ao csf Treinamentos
          </h1>
          <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Porro quaerat enim deserunt nisi excepturi </p>
        </div>

        <img src="https://placehold.co/330x330" alt="" />
        <button className="main-btn">Lorem, ipsum.</button>
      </section>

      <section className="home-about bg-blue">
        <img src="https://placehold.co/330x330" alt="" />
        <div className="about-text">
          <h2>Quem sou?</h2>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea labore eaque deserunt cumque libero tempora nam recusandae nobis doloremque sunt! Dolorum, quisquam. Atque, praesentium recusandae.</p>
        </div>
      </section>

      <section className="home-cta">
        <div className="home-cta-card">
          <h1>Bora treinar com quem se importa</h1>
          <h2>Muito além do físico: um treinador que cuida de você</h2>
          <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Perferendis voluptatum, beatae nihil dicta suscipit expedita rerum aliquid libero eum voluptates voluptate deleniti unde ullam ex!</p>
          <img src="https://placehold.co/330x440" alt="" />
        </div>

        <div className="home-cta-card">
          <h2>Um guia para a saúde em todas as idades</h2>
          <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Perferendis voluptatum, beatae nihil dicta suscipit expedita rerum aliquid libero eum voluptates voluptate deleniti unde ullam ex!</p>
          <img src="https://placehold.co/330x440" alt="" />
        </div>

        <div className="home-cta-card">
          <h2>Cuidando da sua saúde e inspirando sua família a fazer o mesmo</h2>
          <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Perferendis voluptatum, beatae nihil dicta suscipit expedita rerum aliquid libero eum voluptates voluptate deleniti unde ullam ex!</p>
          <img src="https://placehold.co/330x440" alt="" />
        </div>
      </section>

      <section className="home-plans bg-blue">
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

      <section className="home-frequently-asked bg-blue" >
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
            <p>Resposta para a pergunta 1.</p>
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
            <p>Resposta para a pergunta 2.</p>
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
            <p>Resposta para a pergunta 3.</p>
          </AccordionDetails>
        </Accordion>

      </section>

    </>
  );
}
