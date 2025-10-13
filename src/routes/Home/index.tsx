import { useEffect, useState } from "react";
import HomeMobile from "./HomeMobile";
import HomeDesktop from "./HomeDesktop";
import { useMediaQuery } from "@mui/material";

//todo: create component for button; 
// fix button hover (PlansCard); 
// update faq; update images; 
// remake header mobile; 
// refactor aboutUs section (make it a component);
export default function Home() {
    const isMobile = useMediaQuery('(max-width:1024px)');

    return (
        <>
            {isMobile ? <HomeMobile /> : <HomeDesktop />}

        </>
    );
}