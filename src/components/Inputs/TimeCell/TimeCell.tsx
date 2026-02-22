import dayjs, { Dayjs } from "dayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { useEffect, useRef, useState } from "react";

type TimeCellProps = {
    value?: string;
    onChange: (time: string) => void;
};

export default function TimeCell({ value, onChange }: TimeCellProps) {
    const timeoutRef = useRef<NodeJS.Timeout>();

    const handleChange = (newValue: Dayjs | null) => {
        if (!newValue?.isValid()) return;

        // Cancela a chamada anterior se existir
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Aguarda 1 segundo após parar de digitar
        timeoutRef.current = setTimeout(() => {
            onChange(newValue.format("HH:mm"));
        }, 1000);
    };

    return (
        <TimePicker
            value={value ? dayjs(value, "HH:mm") : null}
            onChange={handleChange}
            ampm={false}
            format="HH:mm"
            slotProps={{
                textField: {
                    size: "small",
                    variant: "outlined",
                    fullWidth: true,
                },
            }}
        />
    );
}
