import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import MainSection from "./MainSection";
import AboutSection from "./AboutSection";
import ServicesSection from "./ServicesSection";
import PlansSection from "./PlansSection";
import FAQSection from "./FAQSection";
import Footer from "../../components/Home/Footer/Footer";
import HeaderMobile from "../../components/Home/Header/HeaderMobile/HeaderMobile";
import HeaderDesktop from "../../components/Home/Header/HeaderDesktop/HeaderDesktop";
import useMobile from "../../hooks/isMobile";
import NoCodeRenderer from "../../components/NoCodeRenderer/NoCodeRenderer";
import { getNoCodeContent } from "../../services/noCodeService";
import { splitNoCodeContent } from "../../utils/splitNoCodeContent";

//todo: update images; 
// remake header mobile; 
export default function Home() {
    const isMobile = useMobile();
    const Header = isMobile ? HeaderMobile : HeaderDesktop;

    const { data } = useQuery({
        queryKey: ['noCodeContent'],
        queryFn: getNoCodeContent,
        refetchOnWindowFocus: false,
        retry: 1,
    });

    const noCodeParts = useMemo(() => {
        if (!data?.content) return null;
        try { return splitNoCodeContent(data.content); }
        catch { return null; }
    }, [data?.content]);

    return (
        <>
            <Header />
            <div id="main-section">
                {noCodeParts && !isMobile ? (
                    <NoCodeRenderer content={noCodeParts.beforePlans} />
                ) : (
                    <>
                        <MainSection isMobile={isMobile} />
                        <AboutSection isMobile={isMobile} />
                        <ServicesSection isMobile={isMobile} />
                    </>
                )}

                <PlansSection isMobile={isMobile} />

                {noCodeParts && !isMobile ? (
                    <NoCodeRenderer content={noCodeParts.afterPlans} />
                ) : (
                    <FAQSection isMobile={isMobile} />
                )}

                <Footer isMobile={isMobile} />
            </div>
        </>
    );
}