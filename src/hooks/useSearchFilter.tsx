import { isAfter, isBefore, isValid, parse, parseISO, startOfDay } from 'date-fns';
import { useMemo, useState } from 'react'

export default function useSearchFilter<T>(
    data: T[],
    filterConfig?: {
        searchStatus?: (item: T) => string;
        searchName?: (item: T) => string[];
        searchTypeClass?: (item: T) => string;
        dateFilter?: (item: T) => string;
    }) {

    const [filterStatus, setFilterStatus] = useState<string>("");
    const [filterSearch, setFilterSearch] = useState<string>("");
    const [filterTypeClass, setFilterTypeClass] = useState<string>("");

    const [filterInitialDate, setFilterInitialDate] = useState<string>("");
    const [filterFinalDate, setFilterFinalDate] = useState<string>("");


    const filteredData = useMemo(() => {
        if (!data) return [];
        
        const normalizedSearch = filterSearch.toLowerCase();
        const normalizedStatus = filterStatus.toLowerCase();
        const normalizedTypeClass = filterTypeClass.toLowerCase();

        return data.filter(item => {
            const matchesStatus = filterConfig?.searchStatus ? filterConfig?.searchStatus(item)?.toLowerCase().includes(normalizedStatus) : true;
            const matchesSearch = filterConfig?.searchName ? filterConfig?.searchName(item)?.some(field => field.toLowerCase().includes(normalizedSearch)) : true;
            const matchesTypeClass = filterConfig?.searchTypeClass ? filterConfig?.searchTypeClass(item)?.toLowerCase().includes(normalizedTypeClass) : true;
            if(!matchesStatus || !matchesSearch || !matchesTypeClass) {
                return false;
            }

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

            return matchesStatus && matchesSearch && matchesTypeClass;
        });
    }, [data, filterStatus, filterSearch, filterInitialDate, filterFinalDate, filterConfig, filterTypeClass]);

    const hasFilters = filterStatus !== "" || filterSearch !== "" || filterInitialDate !== "" || filterFinalDate !== "" || filterTypeClass !== "";

    function clearFilters() {
        setFilterStatus("");
        setFilterSearch("");
        setFilterTypeClass("");
        setFilterInitialDate("");
        setFilterFinalDate("");
    }
    return {
        filterStatus,
        setFilterStatus,
        filterSearch,
        setFilterSearch,
        filterTypeClass,
        setFilterTypeClass,
        filterInitialDate,
        setFilterInitialDate,
        filterFinalDate,
        setFilterFinalDate,
        filteredData,
        hasFilters,
        clearFilters,
    };
}