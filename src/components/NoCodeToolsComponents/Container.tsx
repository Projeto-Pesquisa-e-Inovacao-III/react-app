import { useNode } from '@craftjs/core';
import React from 'react';

type Props = {
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    flexDirection?: 'row' | 'col' | '';
    alignItems?: 'start' | 'center' | 'end' | 'stretch' | '';
    justifyContent?: 'start' | 'center' | 'end' | 'between' | 'around' | '';
};

export function Container({ children, className = '', style, flexDirection = '', alignItems = '', justifyContent = '' }: Props) {
    const {
        connectors: { connect },
        selected,
    } = useNode((state) => ({ selected: state.events.selected }));

    const layoutClasses = [
        flexDirection ? 'flex' : '',
        flexDirection === 'row' ? 'flex-row' : '',
        flexDirection === 'col' ? 'flex-col' : '',
        alignItems ? `items-${alignItems}` : '',
        justifyContent ? `justify-${justifyContent}` : '',
    ].filter(Boolean).join(' ');

    return (
        <div
            ref={(ref) => {
                if (ref) connect(ref);
            }}
            className={`${layoutClasses} ${className} ${selected ? 'outline outline-1 outline-dashed outline-[#0C6291]/50' : ''}`}
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
        flexDirection: '',
        alignItems: '',
        justifyContent: '',
    },
    rules: {
        canDrag: () => true,
        canMoveIn: () => true,
    },
};
