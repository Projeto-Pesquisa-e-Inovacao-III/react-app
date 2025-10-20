import React, { type ReactNode } from "react";
import "./WhiteContainer.css"

interface WhiteContainerProps {
    title?: string | "",
    children?: ReactNode,
    gap?: number
}

export function WhiteContainer({ title, children, gap }: WhiteContainerProps) {
    return (
        <div className="white-container">
            <h2>{title}</h2>
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