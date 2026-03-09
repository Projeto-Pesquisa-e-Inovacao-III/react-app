import { useEffect } from "react";

type Props<T extends HTMLElement> = {
    ref: React.RefObject<T | null>;
    callback: () => void;
}

// Hook para detectar cliques fora de um elemento específico
// Uso: const ref = useRef(null); useClickOutside({ ref, callback: () => console.log("Clicou fora!") });

export default function useClickOutside<T extends HTMLElement>({ ref, callback }: Props<T>) {
    useEffect(() => {
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
