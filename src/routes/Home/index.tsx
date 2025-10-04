import { useEffect, useState } from "react";
import HomeMobile from "./HomeMobile";
import HomeDesktop from "./HomeDesktop";
import { ChevronDown } from "lucide-react";
import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";

export default function Home() {
    const [isMobile, setIsMobile] = useState(true);



    useEffect(() => {
        function handleResize() {
            setIsMobile(window.innerWidth <= 1024);
        }
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <>
            {isMobile ? <HomeMobile /> : <HomeDesktop />}

        </>
    );
}