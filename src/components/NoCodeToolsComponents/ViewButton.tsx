import { useNode } from '@craftjs/core';

type Props = {
    title?: string;
    href?: string;
    bgColor?: string;
    textColor?: string;
    className?: string;
};

export default function ViewButton({
    title = 'Entre em contato',
    href = 'https://api.whatsapp.com/send?phone=5511945584686&text=Olá%2C%20tudo%20bem%3F',
    bgColor = '#E05C00',
    textColor = '#ffffff',
    className = '',
}: Props) {
    const {
        connectors: { connect, drag },
    } = useNode();

    return (
        <a
            ref={(ref) => {
                if (ref) connect(drag(ref));
            }}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center justify-center min-h-12 px-8 font-semibold rounded-md transition-opacity hover:opacity-90 ${className}`}
            style={{ backgroundColor: bgColor, color: textColor }}
        >
            {title}
        </a>
    );
}

ViewButton.craft = {
    displayName: 'Botão',
    props: {
        title: 'Entre em contato',
        href: 'https://api.whatsapp.com/send?phone=5511945584686&text=Olá%2C%20tudo%20bem%3F',
        bgColor: '#E05C00',
        textColor: '#ffffff',
        className: '',
    },
    rules: {
        canDrag: () => true,
    },
};
