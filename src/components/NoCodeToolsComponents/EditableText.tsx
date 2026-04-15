import { useNode } from '@craftjs/core';
import React from 'react';

type TextTag = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';

type Props = {
    text?: string;
    tag?: TextTag;
    className?: string;
    color?: string;
    fontSize?: string;
    fontWeight?: string;
};

export default function EditableText({
    text = 'Texto editável',
    tag = 'p',
    className = '',
    color = '',
    fontSize = '',
    fontWeight = '',
}: Props) {
    const {
        connectors: { connect, drag },
        selected,
    } = useNode((state) => ({ selected: state.events.selected }));

    const Tag = tag as React.ElementType;

    const inlineStyle: React.CSSProperties = {};
    if (color) inlineStyle.color = color;
    if (fontSize) inlineStyle.fontSize = fontSize;
    if (fontWeight) inlineStyle.fontWeight = fontWeight;

    return (
        <Tag
            ref={(ref: HTMLElement | null) => {
                if (ref) connect(drag(ref));
            }}
            className={`${className} ${selected ? 'outline outline-2 outline-dashed outline-[#0C6291] outline-offset-2' : ''} cursor-pointer transition-all duration-75`}
            style={inlineStyle}
        >
            {text}
        </Tag>
    );
}

EditableText.craft = {
    displayName: 'Texto',
    props: {
        text: 'Texto editável',
        tag: 'p',
        className: '',
        color: '',
        fontSize: '',
        fontWeight: '',
    },
    rules: {
        canDrag: () => true,
    },
};
