import { useNode } from '@craftjs/core';
import React from 'react'

type Props = {
    text?: string;
    type: React.ElementType;
    classname?: string;
}

export default function Text(props: Props) {
    const {
        connectors: { connect }
    } = useNode();

    const Tag = props.type;

    return (
        <Tag ref={connect} className={props.classname}>
            {props.text}
        </Tag>
    );
}

Text.craft = {
    displayName: "Text",
    props: {
        text: "Texto editável",
        type: "h1"
    }
};