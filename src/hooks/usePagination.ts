import { useRef, useState } from "react";
import styles from "../components/PaginatedList/PaginatedList.module.css";

export type PaginationDirection = "next" | "prev";

export interface UsePaginationReturn {
    page: number;
    direction: PaginationDirection;
    goToPage: (newPage: number) => void;
    animClass: string;
}

export function usePagination(initialPage = 0): UsePaginationReturn {
    const [page, setPage] = useState(initialPage);
    const directionRef = useRef<PaginationDirection>("next");

    function goToPage(newPage: number) {
        directionRef.current = newPage > page ? "next" : "prev";
        setPage(newPage);
    }

    const animClass =
        directionRef.current === "next"
            ? styles.slideInFromRight
            : styles.slideInFromLeft;

    return { page, direction: directionRef.current, goToPage, animClass };
}
