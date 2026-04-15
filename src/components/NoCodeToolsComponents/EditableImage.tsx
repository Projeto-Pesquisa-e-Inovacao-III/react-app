import { useNode } from '@craftjs/core';

type Props = {
    src?: string;
    alt?: string;
    className?: string;
    borderRadius?: string;
};

export default function EditableImage({
    src = '/Home/imageAbout.png',
    alt = 'Imagem',
    className = 'w-full',
    borderRadius = '',
}: Props) {
    const {
        connectors: { connect, drag },
        selected,
    } = useNode((state) => ({ selected: state.events.selected }));

    return (
        <img
            ref={(ref) => {
                if (ref) connect(drag(ref));
            }}
            src={src}
            alt={alt}
            className={`${className} ${selected ? 'outline outline-2 outline-dashed outline-[#0C6291] outline-offset-2' : ''} cursor-pointer`}
            style={{ borderRadius: borderRadius || undefined }}
        />
    );
}

EditableImage.craft = {
    displayName: 'Imagem',
    props: {
        src: '/Home/imageAbout.png',
        alt: 'Imagem',
        className: 'w-full',
        borderRadius: '',
    },
    rules: {
        canDrag: () => true,
    },
};
