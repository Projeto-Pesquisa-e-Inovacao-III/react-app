import { useMediaQuery, useTheme } from "@mui/material";

// Hook to determine if the device is mobile based on the specified breakpoint
export default function useMobile() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
    console.log("isMobile hook:", isMobile);
    return isMobile;
}
