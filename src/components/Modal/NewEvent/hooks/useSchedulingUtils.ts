import { useMemo } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function useFormattedDate(date?: string, hour?: string, type?: string) {
    return useMemo(() => {
        if (!date || !hour) return null;

        try {
            const dateObj = new Date(`${date}T${hour}`);
            const durationMinutes = type === "PRESENCIAL" || type === "RESIDENCIAL" ? 60 : 30;
            const finalDateObj = new Date(dateObj.getTime() + durationMinutes * 60000);

            const datePart = format(dateObj, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
            const initialHour = format(dateObj, "HH:mm");
            const finalHour = format(finalDateObj, "HH:mm");

            return {
                full: `${datePart} das ${initialHour} às ${finalHour}`,
                datePart,
                timePart: `${initialHour} às ${finalHour}`
            };
        } catch (e) {
            return null;
        }
    }, [date, hour, type]);
}

export function useTimeOfDay(hours?: { inicio: string }[]) {
    return useMemo(() => {
        if (!hours || hours.length === 0) return "MANHÃ";

        const firstHour = parseInt(hours[0].inicio.split(":")[0]);
        if (firstHour < 12) return "MANHÃ";
        if (firstHour < 18) return "TARDE";
        return "NOITE";
    }, [hours]);
}
