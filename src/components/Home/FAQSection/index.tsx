import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import { ChevronDown } from "lucide-react";

export default function FAQSection() {
    return (
        <section className="bg-oxford-blue pt-10 pb-10 p-5">
            <div className="ml-20 mr-20">
                <h2 className="text-white text-2xl mb-5">Perguntas Frequentes</h2>

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

    );
}