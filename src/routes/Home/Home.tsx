import { useMediaQuery } from "@mui/material";
import MainSection from "./MainSection";
import AboutSection from "./AboutSection";
import ServicesSection from "./ServicesSection";
import PlansSection from "./PlansSection";
import FAQSection from "./FAQSection";
import Footer from "../../components/Home/Footer/Footer";
import HeaderMobile from "../../components/Home/Header/HeaderMobile/HeaderMobile";
import HeaderDesktop from "../../components/Home/Header/HeaderDesktop/HeaderDesktop";
import { isAuthenticated } from "../../services/authService";
import useMobile from "../../hooks/isMobile";
import { useQuery } from "@tanstack/react-query";

//todo: update images; 
// remake header mobile; 
export default function Home() {
    const isMobile = useMobile();
    const Header = isMobile ? HeaderMobile : HeaderDesktop;

    const isLoggedIn = useQuery({
        queryKey: ["isAuthenticated"],
        queryFn: () => isAuthenticated(),
        retry: false,
        refetchOnWindowFocus: false,
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