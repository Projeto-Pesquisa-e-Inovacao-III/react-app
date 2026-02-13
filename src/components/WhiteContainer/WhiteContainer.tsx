import { type ReactNode } from "react";
import styles from "./WhiteContainer.module.css"
import classNames from "classnames";

type WhiteContainerProps = {
    title?: string | "",
    children?: ReactNode,
    gap?: number,
    titleMarginBottom?: number,
    containerClassName?: string,
    contentClassName?: string
}

export function WhiteContainer({ title, children, gap, titleMarginBottom, contentClassName, containerClassName }: WhiteContainerProps) {
    return (
        <div className={classNames(styles.whiteContainer, containerClassName)}>
            <h2
            style={{
                marginBottom: `${titleMarginBottom || 20}px`
            }}
            >{title}</h2>
            <div className={classNames(styles.content, contentClassName)}
            style={{
                gap: `${gap || 0}px` 
            }}>
                {children}
            </div>
        </div>
    );
}