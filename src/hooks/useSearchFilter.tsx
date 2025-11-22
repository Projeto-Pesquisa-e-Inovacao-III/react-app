import { isAfter, isBefore, isValid, parse, parseISO, startOfDay } from 'date-fns';
import React, { useMemo, useState } from 'react'

export default function useSearchFilter<T>(
    data: T[],
    filterConfig?: {
        searchStatus?: (item: T) => string;
        searchName?: (item: T) => string[];
        dateFilter?: (item: T) => string;
    }) {

    const [filterStatus, setFilterStatus] = useState<string>("");
    const [filterSearch, setFilterSearch] = useState<string>("");
    const [filterInitialDate, setFilterInitialDate] = useState<string>("");
    const [filterFinalDate, setFilterFinalDate] = useState<string>("");

    const filteredData = useMemo(() => {
        const normalizedSearch = filterSearch.toLowerCase();
        const normalizedStatus = filterStatus.toLowerCase();

        return data.filter(item => {
            const matchesStatus = filterConfig?.searchStatus ? filterConfig.searchStatus(item).toLowerCase().includes(normalizedStatus) : true;
            const matchesSearch = filterConfig?.searchName ? filterConfig.searchName(item).some(field => field.toLowerCase().includes(normalizedSearch)) : true;

            if (filterConfig?.dateFilter) {
                const eventDate = startOfDay(parseISO(filterConfig.dateFilter(item)));

                if (filterInitialDate) {
                    const startDate = startOfDay(parse(filterInitialDate, "dd/MM/yyyy", new Date()));

                    if (isValid(startDate) && isBefore(eventDate, startDate)) {
                        return false;
                    }
                }

                if (filterFinalDate) {
                    const endDate = startOfDay(parse(filterFinalDate, 'dd/MM/yyyy', new Date()));

                    if (isValid(endDate) && isAfter(eventDate, endDate)) {
                        return false;
                    }
                }
            }

            return matchesStatus && matchesSearch;
        });
    }, [data, filterStatus, filterSearch, filterInitialDate, filterFinalDate]);

    const hasFilters = filterStatus !== "" || filterSearch !== "" || filterInitialDate !== "" || filterFinalDate !== "";

    function clearFilters() {
        setFilterStatus("");
        setFilterSearch("");
        setFilterInitialDate("");
        setFilterFinalDate("");
    }
    return {
        filterStatus,
        setFilterStatus,
        filterSearch,
        setFilterSearch,
        filterInitialDate,
        setFilterInitialDate,
        filterFinalDate,
        setFilterFinalDate,
        filteredData,
        hasFilters,
        clearFilters,
    };
}