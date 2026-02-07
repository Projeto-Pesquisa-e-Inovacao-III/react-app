import { useInfiniteQuery } from "@tanstack/react-query";
import { useRef, useEffect } from "react";
type PaginatedResponse<T> = {
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
    getNextPageParam?: (
        lastPage: PaginatedResponse<T>,
        allPages: PaginatedResponse<T>[]
    ) => number | undefined;
};

export function useInfinitePagination<T>(

    { queryKey, queryFn, getNextPageParam }: UseInfinitePaginationProps<T>) {

    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    const query = useInfiniteQuery({
        queryKey,
        queryFn: ({ pageParam = 0 }) => queryFn(pageParam),
        initialPageParam: 0,
        getNextPageParam:
            getNextPageParam ??
            ((lastPage) => {
                const currentPage = lastPage.page.number;
                const totalPages = lastPage.page.totalPages;
                return currentPage + 1 < totalPages ? currentPage + 1 : undefined;
            }),
    });

    useEffect(() => {
        if (!loadMoreRef.current || !query.hasNextPage) return;

        const observer = new IntersectionObserver((entries => {
            if (entries[0].isIntersecting) {
                query.fetchNextPage();
            }
        }), {
            rootMargin: '100px',
        });

        observer.observe(loadMoreRef.current);

        return () => observer.disconnect();
    }, [query.fetchNextPage, query.hasNextPage]);

    return {
        ...query,
        loadMoreRef,
        data: query.data?.pages.flatMap(page => page.content) ?? [],
    }
}