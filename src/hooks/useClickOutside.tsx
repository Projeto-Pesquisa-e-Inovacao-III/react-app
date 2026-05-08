import { useEffect } from "react";

type Props<T extends HTMLElement> = {
    ref: React.RefObject<T | null>;
    callback: () => void;
    disabled?: boolean;
}

// Hook para detectar cliques fora de um elemento específico
// Uso: const ref = useRef(null); useClickOutside({ ref, callback: () => 

export default function useClickOutside<T extends HTMLElement>({ ref, callback, disabled }: Props<T>) {
    useEffect(() => {
        if (disabled) return;

        function handleClickOutside(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                callback();
            }
        }

        document.addEventListener("pointerdown", handleClickOutside);

        return () => {
            document.removeEventListener("pointerdown", handleClickOutside);
        };
    }, [ref, callback]);
}
