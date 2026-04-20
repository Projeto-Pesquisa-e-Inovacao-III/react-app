import * as React from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { Calendar } from "lucide-react";
import styles from "../InputWithIcon/InputWithIcon.module.css";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

interface MuiDatePickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  helperText?: string;
}

export default function MuiDatePicker({
  label,
  value,
  onChange,
  error,
  helperText,
}: MuiDatePickerProps) {
  dayjs.locale("pt-br");

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
          <DatePicker
            format="DD/MM/YYYY"
            value={value ? dayjs(value, "DD/MM/YYYY") : null}
            onChange={(date) => {
              if (date && dayjs(date).isValid()) {
                onChange(dayjs(date).format("DD/MM/YYYY"));
              } else {
                onChange("");
              }
            }}
                slotProps={{
                textField: {
                    error,
                    helperText,
                    fullWidth: true,
                    size: "small"
                },
                }}
            dayOfWeekFormatter={(date) =>
              date.format("ddd").replace(".", "").toUpperCase()
            }
          />
    </LocalizationProvider>
  );
}
