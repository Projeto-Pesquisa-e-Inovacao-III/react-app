import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import { ChevronDown } from "lucide-react";

export default function FAQSection({ isMobile = false }: { isMobile: boolean }) {
    return (
        <section id="faq" className={`scroll-mt-20 bg-indigo pt-16 pb-16 ${isMobile ? "p-5" : "px-16"}`}>
            <div className={`text-black bg-white rounded-2xl shadow-2xl p-8 max-w-[1600px] mx-auto ${!isMobile ? "mt-4" : ""}`}>
                <h2 className="text-oxford-blue text-4xl font-bold text-center mb-10 font-poppins">Perguntas Frequentes</h2>

                <div className="flex flex-col gap-3">
                    <Accordion className="rounded-xl! shadow-sm! border border-gray-100! before:hidden">
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

                <Accordion className="rounded-xl! shadow-sm! border border-gray-100! before:hidden">
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

                <Accordion className="rounded-xl! shadow-sm! border border-gray-100! before:hidden">
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

                <Accordion className="rounded-xl! shadow-sm! border border-gray-100! before:hidden">
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

                <Accordion className="rounded-xl! shadow-sm! border border-gray-100! before:hidden">
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

                <Accordion className="rounded-xl! shadow-sm! border border-gray-100! before:hidden">
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
            </div>
        </section>

    );
}