import { useNode } from '@craftjs/core';
import React from 'react';

type Props = {
    children?: React.ReactNode;
    backgroundColor?: string;
    backgroundImage?: string;
    paddingTop?: string;
    paddingBottom?: string;
    className?: string;
    id?: string;
};

export function EditableSection({
    children,
    backgroundColor = '',
    backgroundImage = '',
    paddingTop = '80px',
    paddingBottom = '80px',
    className = '',
    id = '',
}: Props) {
    const {
        connectors: { connect },
        selected,
    } = useNode((state) => ({ selected: state.events.selected }));

    const style: React.CSSProperties = {};
    if (backgroundColor) style.backgroundColor = backgroundColor;
    if (backgroundImage) style.backgroundImage = `url('${backgroundImage}')`;
    if (paddingTop) style.paddingTop = paddingTop;
    if (paddingBottom) style.paddingBottom = paddingBottom;

    return (
        <section
            ref={(ref) => {
                if (ref) connect(ref);
            }}
            id={id || undefined}
            className={`${className} ${selected ? 'outline outline-2 outline-dashed outline-[#0C6291]' : ''}`}
            style={style}
        >
            {children}
        </section>
    );
}

EditableSection.craft = {
    displayName: 'Seção',
    props: {
        backgroundColor: '',
        backgroundImage: '',
        paddingTop: '80px',
        paddingBottom: '80px',
        className: '',
        id: '',
    },
    rules: {
        canDrag: () => false,
        canMoveIn: () => true,
    },
};
