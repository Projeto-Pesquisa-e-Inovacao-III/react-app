import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import { ChevronDown } from "lucide-react";

export default function FAQSection({ isMobile = false }: { isMobile: boolean }) {
    return (
        <section className="bg-indigo pt-10 pb-10 p-5">
            <div className={`text-black bg-white rounded-lg p-5 ${!isMobile ? "ml-20 mr-20" : ""}`}>
                <h2 className="text-black text-2xl mb-5">Perguntas Frequentes</h2>

                <Accordion>
                    <AccordionSummary
                        expandIcon={<ChevronDown />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                    >
                        <h3>A consultoria é totalmente online?</h3>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>A consultoria é totalmente online, realizada via WhatsApp. Alguns pacotes incluem aulas presenciais com o personal, nas quais você recebe acompanhamento e orientações práticas durante o treino.</Typography>
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary
                        expandIcon={<ChevronDown />}
                        aria-controls="panel2-content"
                        id="panel2-header"
                    >
                        <h3>Quais as formas de pagamento disponivéis?</h3>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>Atualmente, o pagamento é feito via PIX. Alguns bancos digitais oferecem a opção de parcelamento diretamente pelo aplicativo.</Typography>
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary
                        expandIcon={<ChevronDown />}
                        aria-controls="panel3-content"
                        id="panel3-header"
                    >
                        <h3>A consultoria é para todos ou apenas para quem já treina?</h3>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>A consultoria é indicada para todos os perfis, inclusive para quem nunca treinou ou não tem experiência com atividades físicas.
                        </Typography>
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary
                        expandIcon={<ChevronDown />}
                        aria-controls="panel3-content"
                        id="panel3-header"
                    >
                        <h3>Quais as formas de contato com o personal?</h3>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>O contato é realizado principalmente pelo WhatsApp, além de telefone e Instagram.</Typography>
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary
                        expandIcon={<ChevronDown />}
                        aria-controls="panel3-content"
                        id="panel3-header"
                    >
                        <h3>Como funciona a consultoria após a contratação do pacote?</h3>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>Após a contratação, o personal entrará em contato para entender seu perfil, seus objetivos e sua experiência com treinos. Dependendo do pacote contratado, você terá direito a aulas presenciais mensais para agendamento.</Typography>
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary
                        expandIcon={<ChevronDown />}
                        aria-controls="panel3-content"
                        id="panel3-header"
                    >
                        <h3>Tenho direito a reembolso?</h3>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>Sim. Você pode solicitar o reembolso em até 7 (sete) dias corridos após a contratação. Esse prazo segue o Código de Defesa do Consumidor para compras realizadas online.
                        </Typography>
                    </AccordionDetails>
                </Accordion>

            </div>
        </section>

    );
}