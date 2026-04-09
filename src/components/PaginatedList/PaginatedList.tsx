import { type ReactNode } from "react";
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
    buttonDisabledClass?: string;
    children: ReactNode;
};

export default function PaginatedList({
    page,
    animClass,
    pagination,
    onPageChange,
    listClassName = "",
    buttonDisabledClass = "bg-gray-400! cursor-auto!",
    children,
}: Readonly<PaginatedListProps>) {
    const isFirst = page === 0;
    const isLast = pagination ? page === pagination.totalPages - 1 : true;

    return (
        <div className={`${listClassName} ${animClass}`.trim()}>
            {children}

            {pagination && pagination.totalPages > 1 && (
                <div className={styles.navButtons}>
                    <SmallerButton
                        icon={<ChevronLeft />}
                        classname={`w-22! h-10! items-center ${isFirst ? buttonDisabledClass : ""}`}
                        handleButtonClick={() => {
                            if (!isFirst) onPageChange(page - 1);
                        }}
                    />
                    <SmallerButton
                        icon={<ChevronRight />}
                        classname={`w-22! h-10! items-center ${isLast ? buttonDisabledClass : ""}`}
                        handleButtonClick={() => {
                            if (!isLast) onPageChange(page + 1);
                        }}
                    />
                </div>
            )}
        </div>
    );
}
