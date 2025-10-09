import { useEffect, useRef, useState } from "react";
import "./style.css"
import ViewScheduleDesktop from "./ViewScheduleDesktop/ViewScheduleDesktop";
import ViewScheduleMobile from "./ViewScheduleMobile/ViewScheduleMobile";

// todo: check friday if cards will be mocked, backend or prototipe
export default function ViewSchedule() {
    const [isMobile, setIsMobile] = useState<boolean>(false);

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
            {isMobile ? <ViewScheduleMobile /> : <ViewScheduleDesktop />}
        </>
    );
}
