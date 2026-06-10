import { useInfiniteQuery } from "@tanstack/react-query";
import { useRef, useEffect, useCallback } from "react";
export type PaginatedResponse<T> = {
    content: T[];
    page: {
        size: number;
        number: number;
        totalElements: number;
        totalPages: number;
    };
};


type UseInfinitePaginationProps<T> = {
    queryKey: unknown[];
    queryFn: (page: number) => Promise<PaginatedResponse<T>>;
    enable?: boolean
    getNextPageParam?: (
        lastPage: PaginatedResponse<T>,
        allPages: PaginatedResponse<T>[]
    ) => number | undefined;
};

// hook for infinite pagination
/* 
example of usage:
const { data, fetchNextPage, hasNextPage, isFetchingNextPage, loadMoreRef } = useInfinitePagination({
    queryKey: ["students"],
    queryFn: (page) => listStudents(page),
    enable: true,
    getNextPageParam: (lastPage) => {
        const currentPage = lastPage.page.number;
        const totalPages = lastPage.page.totalPages;
        return currentPage + 1 < totalPages ? currentPage + 1 : undefined;
    }
});
*/
export function useInfinitePagination<T>(

    { queryKey, queryFn, enable, getNextPageParam }: UseInfinitePaginationProps<T>) {

    const observer = useRef<IntersectionObserver | null>(null);

    const query = useInfiniteQuery({
        queryKey,
        queryFn: ({ pageParam = 0 }) => queryFn(pageParam),
        initialPageParam: 0,
        enabled: enable && enable,
        getNextPageParam:
            getNextPageParam ??
            ((lastPage) => {
                if (!lastPage?.page) return undefined;

                const currentPage = lastPage.page.number;
                const totalPages = lastPage.page.totalPages;
                return currentPage + 1 < totalPages ? currentPage + 1 : undefined;
            }),
        refetchOnWindowFocus: false
    });

    const loadMoreRef = useCallback((node: HTMLElement | null) => {
        if (query.isFetchingNextPage) return;
        
        if (observer.current) observer.current.disconnect();

        if (node) {
            observer.current = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting && query.hasNextPage) {
                    query.fetchNextPage();
                }
            }, {
                rootMargin: '100px',
            });
            observer.current.observe(node);
        }
    }, [query.isFetchingNextPage, query.hasNextPage, query.fetchNextPage]);

    return {
        ...query,
        loadMoreRef,
        data: query.data?.pages.flatMap(page => page.content) ?? [],
        pagination: query.data?.pages.at(-1)?.page
    }
}