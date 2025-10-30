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

//todo: update images; 
// remake header mobile; 
export default function Home() {
    const isMobile = useMobile();
    const Header = isMobile ? HeaderMobile : HeaderDesktop;

    const isUserLoggedIn = isAuthenticated();

    return (
        <>
            <Header userLoggedIn={isUserLoggedIn} />
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