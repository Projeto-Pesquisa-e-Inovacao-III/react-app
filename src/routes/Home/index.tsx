import { useEffect, useState } from "react";
import HomeMobile from "./HomeMobile";
import HomeDesktop from "./HomeDesktop";
import { useMediaQuery } from "@mui/material";

//todo: update images; 
// remake header mobile; 
// need to see if really need to use two different components for mobile and desktop. I could use only one and use media query to change styles and layout;
export default function Home() {
    const isMobile = useMediaQuery('(max-width:1024px)');

    return (
        <>
            {isMobile ? <HomeMobile /> : <HomeDesktop />}

        </>
    );
}