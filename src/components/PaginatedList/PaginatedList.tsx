import { type ReactNode, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SmallerButton from "../SmallerButton/SmallerButton";
import styles from "./PaginatedList.module.css";

export type PaginationInfo = {
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
};

type PaginatedListProps = {
    page: number;
    animClass: string;
    pagination?: PaginationInfo | null;
    onPageChange: (newPage: number) => void;
    listClassName?: string;
    includeNavMargin?: boolean;
    buttonDisabledClass?: string;
    alwaysShowPagination?: boolean;
    children: ReactNode;
};

export default function PaginatedList({
    page,
    animClass,
    pagination,
    onPageChange,
    listClassName = "",
    includeNavMargin = true,
    buttonDisabledClass = "bg-gray-400! cursor-auto!",
    alwaysShowPagination = false,
    children,
}: Readonly<PaginatedListProps>) {
    const isFirst = page === 0;
    const isLast = pagination ? page === pagination.totalPages - 1 : true;

    const visiblePages = useMemo(() => {
        if (!pagination) return [];
        const totalPages = pagination.totalPages;
        let start = Math.max(0, page - 1);
        let end = Math.min(totalPages - 1, page + 1);

        if (end - start < 2) {
            if (start === 0) {
                end = Math.min(totalPages - 1, start + 2);
            } else if (end === totalPages - 1) {
                start = Math.max(0, end - 2);
            }
        }

        const pages = [];
        for (let i = start; i <= end; i++) {
            if (totalPages > 3 && (i === 0 || i === totalPages - 1)) continue;
            pages.push(i);
        }
        return pages;
    }, [page, pagination]);

    return (
        <>
            <div className={`${listClassName} ${animClass}`.trim()}>
                {children}
            </div>

            {pagination && (alwaysShowPagination || pagination.totalPages > 1) && (
                <div className={styles.navButtons} style={{ marginTop: includeNavMargin ? "20px" : "0px" }}>
                    <SmallerButton
                        icon={<ChevronLeft />}
                        classname={`${styles.navButton} ${isFirst ? buttonDisabledClass : ""}`}
                        handleButtonClick={() => {
                            if (!isFirst) onPageChange(page - 1);
                        }}
                    />

                    {pagination.totalPages > 3 && (
                        <>
                            <SmallerButton
                                title="1"
                                classname={`${styles.pageButton} ${page === 0 ? styles.activePage : ""}`}
                                handleButtonClick={() => onPageChange(0)}
                            />
                            {visiblePages[0] > 1 && <span className={styles.ellipsis}>...</span>}
                        </>
                    )}

                    {visiblePages.map(p => (
                        <SmallerButton
                            key={p}
                            title={`${p + 1}`}
                            classname={`${styles.pageButton} ${page === p ? styles.activePage : ""}`}
                            handleButtonClick={() => {
                                if (page !== p) onPageChange(p);
                            }}
                        />
                    ))}

                    {pagination.totalPages > 3 && (
                        <>
                            {visiblePages[visiblePages.length - 1] < pagination.totalPages - 2 && <span className={styles.ellipsis}>...</span>}
                            <SmallerButton
                                title={`${pagination.totalPages}`}
                                classname={`${styles.pageButton} ${page === pagination.totalPages - 1 ? styles.activePage : ""}`}
                                handleButtonClick={() => onPageChange(pagination.totalPages - 1)}
                            />
                        </>
                    )}

                    <SmallerButton
                        icon={<ChevronRight />}
                        classname={`${styles.navButton} ${isLast ? buttonDisabledClass : ""}`}
                        handleButtonClick={() => {
                            if (!isLast) onPageChange(page + 1);
                        }}
                    />
                </div>
            )}
        </>
    );
}
