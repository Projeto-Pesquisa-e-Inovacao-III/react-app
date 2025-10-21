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
                        <Typography>Resposta para a pergunta 1.</Typography>
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
                        <Typography>Resposta para a pergunta 2.</Typography>
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
                        <Typography>Resposta para a pergunta 3.</Typography>
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
                        <Typography>Resposta para a pergunta 3.</Typography>
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
                        <Typography>Resposta para a pergunta 3.</Typography>
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
                        <Typography>Resposta para a pergunta 3.</Typography>
                    </AccordionDetails>
                </Accordion>

            </div>
        </section>

    );
}