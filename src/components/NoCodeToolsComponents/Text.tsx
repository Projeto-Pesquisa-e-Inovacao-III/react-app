import { useNode } from '@craftjs/core';
import React from 'react'

type Props = {
    text?: string;
    type: React.ElementType;
    classname?: string;
}

export default function Text(props: Props) {
const {
    connectors: { connect },
    actions: { setProp },
    selected
  } = useNode((node) => ({
    selected: node.events.selected
  }));

  const Tag = props.type;

    return (
        <Tag ref={connect}
            contentEditable={selected}
            suppressContentEditableWarning
            onBlur={(e: React.FocusEvent<HTMLElement>) =>
                setProp((props: any) => {
                    props.text = e.currentTarget.innerText;
                })
            }
            className={props.classname ? props.classname : "text-5xl font-bold"}>
            {props.text}
        </Tag>

    )
}

Text.craft = {
    displayName: "Text",
    props: {
        text: "Texto padrão",
        type: "h1",
        classname: "text-5xl font-bold"
    }
};