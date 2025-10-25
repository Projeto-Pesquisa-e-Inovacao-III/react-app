import React, { type ReactNode } from "react";
import "./WhiteContainer.css"

type WhiteContainerProps = {
    title?: string | "",
    children?: ReactNode,
    gap?: number,
    titleMarginBottom?: number
}

export function WhiteContainer({ title, children, gap, titleMarginBottom }: WhiteContainerProps) {
    return (
        <div className="white-container">
            <h2
            style={{
                marginBottom: titleMarginBottom || 20
            }}
            >{title}</h2>
            <div 
            className="content"
            style={{
                gap: `${gap || 0}px` 
            }}>
                {children}
            </div>
        </div>
    );
}