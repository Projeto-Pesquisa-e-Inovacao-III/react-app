import { useNode } from '@craftjs/core';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import { ChevronDown } from 'lucide-react';

type Props = {
    title?: string;
    content?: string;
    className?: string;
};

export default function EditableAccordion({
    title = 'Título da Pergunta',
    content = 'Conteúdo da resposta',
    className = '',
}: Props) {
    const {
        connectors: { connect, drag },
        selected,
    } = useNode((state) => ({ selected: state.events.selected }));

    return (
        <Accordion
            ref={(ref: HTMLElement | null) => {
                if (ref) connect(drag(ref));
            }}
            className={`${className} ${selected ? 'outline outline-2 outline-dashed outline-[#0C6291] outline-offset-2' : ''}`}
        >
            <AccordionSummary expandIcon={<ChevronDown />}>
                <h3>{title}</h3>
            </AccordionSummary>
            <AccordionDetails>
                <Typography>{content}</Typography>
            </AccordionDetails>
        </Accordion>
    );
}

EditableAccordion.craft = {
    displayName: 'Accordion',
    props: {
        title: 'Título da Pergunta',
        content: 'Conteúdo da resposta',
        className: '',
    },
    rules: {
        canDrag: () => true,
    },
};
