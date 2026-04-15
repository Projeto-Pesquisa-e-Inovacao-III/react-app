import { useNode } from '@craftjs/core';
import React from 'react';

type Props = {
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
};

export function Container({ children, className = '', style }: Props) {
    const {
        connectors: { connect },
        selected,
    } = useNode((state) => ({ selected: state.events.selected }));

    return (
        <div
            ref={(ref) => {
                if (ref) connect(ref);
            }}
            className={`${className} ${selected ? 'outline outline-1 outline-dashed outline-[#0C6291]/50' : ''}`}
            style={style}
        >
            {children}
        </div>
    );
}

Container.craft = {
    displayName: 'Container',
    props: {
        className: '',
    },
    rules: {
        canDrag: () => true,
        canMoveIn: () => true,
    },
};
