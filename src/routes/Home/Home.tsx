import { useMediaQuery } from "@mui/material";
import MainSection from "../../components/Home/MainSection";
import AboutSection from "../../components/Home/AboutSection";
import ServicesSection from "../../components/Home/ServicesSection";
import PlansSection from "../../components/Home/PlansSection";
import FAQSection from "../../components/Home/FAQSection";
import Footer from "../../components/Home/Footer/Footer";
import HeaderMobile from "../../components/Home/Header/HeaderMobile";
import HeaderDesktop from "../../components/Home/Header/HeaderDesktop";

//todo: update images; 
// remake header mobile; 
export default function Home({ hasHeader }: { hasHeader: React.Dispatch<React.SetStateAction<boolean>> }) {
    const isMobile = useMediaQuery('(max-width:1024px)');

    const Header = isMobile ? HeaderMobile : HeaderDesktop;

    hasHeader(false);

    return (
        <>
            <Header />
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