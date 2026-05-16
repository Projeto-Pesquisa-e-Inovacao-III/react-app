import { useMediaQuery } from "@mui/material";

// Hook to determine if the device is mobile based on the specified breakpoint
export default function useMobile() {
    const isMobile = useMediaQuery("(max-width: 1024px)");
    return isMobile;
}
