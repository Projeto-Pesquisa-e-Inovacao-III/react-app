import { LogoHeaderMobile } from "../../components/LogoHeaderMobile";
import { useMediaQuery } from "@mui/material";
import { PackageCard } from "../../components/PackageCard";
import { packagesMock } from "./mocks/packagesMock";
import { packagesMockAdicional } from "./mocks/packagesMockAdicional";
import "./mobile.css"
import "./desktop.css"
import SmallerButton from "../../components/SmallerButton";

type PackagesProps = {
    hasHeader: React.Dispatch<React.SetStateAction<boolean>>;
    type: "personal" | "student";
};

export function Packages({ hasHeader, type }: PackagesProps) {
    const isMobile = useMediaQuery("(max-width:1024px)");
    hasHeader(true);

    const isPersonal = type === "personal";

    const handleBuyClick = (packageTitle: string) => {
        alert(`Você clicou para comprar o pacote: ${packageTitle}`);
    };

    return (
        <>
            {isMobile && (
                <div className={`user-view-schedule-mobile`}>
                    <div className="logo-header-mobile">
                        <LogoHeaderMobile />
                    </div>
                </div>
            )}

            <div
                className={`${isPersonal ? "personal-packages-title-container" : "packages-title-container"
                    }${isMobile ? "-mobile" : ""}`}
            >
                <h1>
                    {isPersonal ? "Pacotes Atuais" : "Pacotes de Consultoria"}
                </h1>

                {isPersonal && (
                    <SmallerButton type="button" title="Adicionar Pacote" />
                )}
            </div>

            <div className={`packages-list-wrapper${isMobile ? "-mobile" : "-desktop"}`}>
                {packagesMock.map((pacote, index) => (
                    <PackageCard
                        key={index}
                        {...pacote}
                        onClick={() => handleBuyClick(pacote.title)}
                        isMobile={isMobile}
                        isPersonal={isPersonal}
                    />
                ))}
            </div>

            <div
                className={`${isPersonal ? "personal-packages-title-container" : "packages-title-container"
                    } additional-title${isMobile ? "-mobile" : ""}`}
            >
                <h1>Pacotes Adicionais</h1>

                {isPersonal && (
                    <SmallerButton type="button" title="Adicionar Pacote Adicional" />
                )}
            </div>

            <div className={`packages-list-wrapper-${isMobile ? "mobile" : "desktop"}`}>
                {packagesMockAdicional.map((pacote, index) => (
                    <PackageCard
                        key={`adicional-${index}`}
                        {...pacote}
                        onClick={() => handleBuyClick(pacote.title)}
                        isMobile={isMobile}
                        variant="adicional"
                        isPersonal={isPersonal}
                    />
                ))}
            </div>
        </>
    );
}
