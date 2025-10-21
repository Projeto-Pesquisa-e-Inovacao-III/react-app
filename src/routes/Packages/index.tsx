import { LogoHeaderMobile } from "../../components/LogoHeaderMobile";
import { useMediaQuery } from "@mui/material";
import UserHeaderMobile from "../../components/UserHeader/UserHeaderMobile/UserHeaderMobile";
import { UserHeaderDesktop } from "../../components/UserHeader/UserHeaderDesktop/UserHeaderDesktop";
import { PackageCard } from "../../components/PackageCard";
import { packagesMock } from "./mocks/packagesMock"; 
import { packagesMockAdicional } from "./mocks/packagesMockAdicional";
import "./mobile.css"
import "./desktop.css"

export function Packages() {
    const isMobile = useMediaQuery("(max-width:1024px)");

    const Header = isMobile ? UserHeaderMobile : UserHeaderDesktop;

    const handleBuyClick = (packageTitle: string) => {
        alert(`Você clicou para comprar o pacote: ${packageTitle}`);
    }


    return (
        <>
            <div className={`user-view-schedule${isMobile ? "-mobile" : ""}`}>
                {isMobile && (
                    <div className="logo-header-mobile">
                        <LogoHeaderMobile />
                    </div>
                )}
                {!isMobile && <Header />}
            </div>
            
            <div className="packages-title-container">
                <h1>Pacotes de Consultoria</h1>
            </div>

            <div className={`packages-list-wrapper${isMobile ? '-mobile' : '-desktop'}`}>
                {packagesMock.map((pacote, index) => (
                    <PackageCard
                        key={index}
                        title={pacote.title}
                        subtitle={pacote.subtitle}
                        price={pacote.price}
                        duration={pacote.duration}
                        benefits={pacote.benefits}
                        titlebtn={pacote.titlebtn}
                        onClick={() => handleBuyClick(pacote.title)}
                        isMobile={isMobile}
                    />
                ))}
            </div>

            <div className="packages-title-container additional-title">
                <h1>Pacotes Adicionais</h1>
            </div>

            <div className={`packages-list-wrapper-${isMobile ? 'mobile' : 'desktop'}`}>
                {packagesMockAdicional.map((pacote, index) => (
                    <PackageCard
                        key={`adicional-${index}`}
                        title={pacote.title}
                        subtitle={pacote.subtitle}
                        price={pacote.price}
                        duration={pacote.duration}
                        benefits={pacote.benefits}
                        titlebtn={pacote.titlebtn}
                        onClick={() => handleBuyClick(pacote.title)}
                        isMobile={isMobile}
                        variant="adicional" 
                    />
                ))}
            </div>

            {isMobile && <Header />}
        </>
    )
}