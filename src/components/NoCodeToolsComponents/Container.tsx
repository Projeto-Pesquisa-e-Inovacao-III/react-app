import { useNode } from "@craftjs/core";

type Props = {
    children: React.ReactNode;
    className?: string;
};

export function Container({ children }: Props) {
    const { connectors: { connect } } = useNode();

    return (
        <div
            ref={connect}
        >
            {children}
        </div>
    );

}



Container.craft = {
    displayName: "Container",
};
