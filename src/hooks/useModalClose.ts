import { useState, useEffect } from "react";

type UseModalCloseOptions = {
    /** Tempo idêntico ao da animação no CSS (ex: modalLeave 0.18s = 180ms) */
    duration?: number;
    /** Caso true, bloqueia a rolagem da página inteira enquanto o modal estiver aberto */
    lockScroll?: boolean;
    /** Ação real de fechar o modal, rodada após a animação (ex: (prev) => setOpen(!prev)) */
    onClose: () => void;
};

type UseModalCloseReturn = {
    isClosing: boolean;
    handleAnimatedClose: () => void;
};

export default function useModalClose({
    duration = 180,
    lockScroll = true,
    onClose,
}: UseModalCloseOptions): UseModalCloseReturn {
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        if (!lockScroll) return;
        
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [lockScroll]);

    function handleAnimatedClose() {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
        }, duration);
    }

    return { isClosing, handleAnimatedClose };
}
