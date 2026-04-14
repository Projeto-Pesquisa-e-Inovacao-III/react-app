import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { disabledPersonalDays } from "../constants/schedule";

/**
 * returns a string array of lowercased day names (e.g. ["domingo", "sabado"]).
 *
 * @param targetId - The ID of the personal trainer whose disabled days should be fetched.
 *                   When undefined/null the query is skipped.
 */
export function useDisabledDays(targetId: number | undefined) {
    const [disabledDays, setDisabledDays] = useState<string[]>([]);

    const checkDays = useQuery({
        queryKey: ["disabledDays", targetId],
        queryFn: () => disabledPersonalDays(targetId!),
        enabled: !!targetId,
        retry: false,
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (checkDays.data?.data) {
            const inactiveDays: string[] = checkDays.data.data
                .filter((day: { ativo: boolean }) => !day.ativo)
                .map((day: { diaSemana: string }) => day.diaSemana.toLowerCase());
            setDisabledDays(Array.from(new Set(inactiveDays)));
        }
    }, [checkDays.data]);

    return { disabledDays, isLoading: checkDays.isLoading };
}
