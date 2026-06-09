import { useRef, useState } from "react";
import useClickOutside from "./useClickOutside";

export function useAiPanel() {
    const [aiPanelOpen, setAiPanelOpen] = useState(false);
    const [isAiPanelClosing, setIsAiPanelClosing] = useState(false);
    const aiPanelRef = useRef<HTMLDivElement>(null);

    function closeAiPanel() {
        setIsAiPanelClosing(true);
        setTimeout(() => {
            setAiPanelOpen(false);
            setIsAiPanelClosing(false);
        }, 280);
    }

    useClickOutside({
        ref: aiPanelRef,
        callback: () => {
            if (aiPanelOpen && !isAiPanelClosing) closeAiPanel();
        },
    });

    return { aiPanelOpen, setAiPanelOpen, isAiPanelClosing, aiPanelRef, closeAiPanel };
}
