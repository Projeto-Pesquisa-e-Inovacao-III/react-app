import { useMediaQuery } from "@mui/material";
import MainSection from "./MainSection";
import AboutSection from "./AboutSection";
import ServicesSection from "./ServicesSection";
import PlansSection from "./PlansSection";
import FAQSection from "./FAQSection";
import Footer from "../../components/Home/Footer/Footer";
import HeaderMobile from "../../components/Home/Header/HeaderMobile/HeaderMobile";
import HeaderDesktop from "../../components/Home/Header/HeaderDesktop/HeaderDesktop";
import useMobile from "../../hooks/isMobile";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { isAuthenticated } from "../../constants/user";
import { useEffect } from "react";

//todo: update images; 
// remake header mobile; 
export default function Home() {
    const isMobile = useMobile();
    const Header = isMobile ? HeaderMobile : HeaderDesktop;

    const isLoggedIn = useQuery({
        queryKey: ["isAuthenticated"],
        queryFn: () => isAuthenticated(),
        select: (res) => res.data?.autentificado
    });

    console.log("Home authentication check:", {
        isLoading: isLoggedIn.isLoading,
        data: isLoggedIn.data,
        isError: isLoggedIn.isError
    });
    
    return (
        <>
            <Header userLoggedIn={isLoggedIn.data} />
            <div id="main-section">
                {/* main */}
                <MainSection isMobile={isMobile} />

                {/* about */}
                <AboutSection isMobile={isMobile} />

                {/* services */}
                <ServicesSection isMobile={isMobile} />

                {/* plans */}
                <PlansSection isMobile={isMobile} />

                {/* FAQ */}
                <FAQSection isMobile={isMobile} />

                {/* footer */}
                <Footer isMobile={isMobile} />
            </div >
        </>
    );
}