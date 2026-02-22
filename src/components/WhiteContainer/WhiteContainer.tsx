import { type ReactNode } from "react";
import styles from "./WhiteContainer.module.css"
import classNames from "classnames";

type WhiteContainerProps = {
    title?: string | "",
    children?: ReactNode,
    gap?: number,
    icon?: ReactNode,

    titleFontSize?: number,
    titleMarginBottom?: number,
    titleClassName?: string,
    
    containerClassName?: string,
    contentClassName?: string
}

export function WhiteContainer({ title, children, gap, titleMarginBottom, titleClassName, contentClassName, containerClassName, titleFontSize, icon }: WhiteContainerProps) {
    return (
        <div className={classNames(styles.whiteContainer, containerClassName)}>
            <h2 className={classNames(styles.title, titleClassName)}
            style={{
                marginBottom: `${titleMarginBottom || 20}px`,
                fontSize: `${titleFontSize || 16}px`
            }}
            >{icon && <span className={styles.icon}>{icon}</span>} {title}</h2>
            <div className={classNames(styles.content, contentClassName)}
            style={{
                gap: `${gap || 0}px` 
            }}>
                {children}
            </div>
        </div>
    );
}